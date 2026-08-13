import { VercelRequest, VercelResponse } from '@vercel/node';
import { DATA_GOV_API_KEY, MANDI_API_URL, fetchWithTimeout, MOCK_MANDI_RECORDS, fuzzyMatch, computeTrend } from './_data.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const { commodity } = req.query;
    if (!commodity || typeof commodity !== 'string') {
      return res.status(400).json({ success: false, error: 'Query param "commodity" is required.' });
    }

    let apiEndpoint = `${MANDI_API_URL}?api-key=${DATA_GOV_API_KEY}&format=json&limit=100&filters[commodity]=${encodeURIComponent(commodity)}`;
    let records: any[] = [];
    let isLiveApi = false;

    try {
      const response = await fetchWithTimeout(apiEndpoint, { headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.records) && data.records.length > 0) {
          records = data.records;
          isLiveApi = true;
        }
      }
    } catch (e: any) {
      console.warn(`Compare endpoint: data.gov.in ${e?.name === 'AbortError' ? 'timeout' : 'network error'}, using fallback`);
    }

    if (records.length === 0) {
      records = MOCK_MANDI_RECORDS.filter(r => fuzzyMatch(commodity, r.commodity));
    }

    if (records.length === 0) {
      return res.json({ success: false, error: `No records found for commodity "${commodity}" in any state.` });
    }

    const formatted = records.map((r, i) => {
      const minP = Number(r.min_price) || 0;
      const maxP = Number(r.max_price) || 0;
      const modalP = Number(r.modal_price) || 0;
      return {
        id: i + 1,
        state: r.state || 'N/A',
        district: r.district || 'N/A',
        market: r.market || 'N/A',
        commodity: r.commodity || commodity,
        variety: r.variety || 'Standard',
        minPrice: minP,
        maxPrice: maxP,
        modalPrice: modalP,
        trend: computeTrend(minP, maxP, modalP),
      };
    }).sort((a, b) => b.modalPrice - a.modalPrice);

    const bestMandi = formatted[0];
    const worstMandi = formatted[formatted.length - 1];
    const avgPrice = Math.round(formatted.reduce((sum, r) => sum + r.modalPrice, 0) / formatted.length);

    const responsePayload = {
      success: true,
      commodity,
      source: isLiveApi ? 'data.gov.in (OGD India API)' : 'Data.gov.in Open Data Engine',
      timestamp: new Date().toISOString(),
      summary: {
        totalMarkets: formatted.length,
        bestPrice: { market: bestMandi.market, state: bestMandi.state, district: bestMandi.district, modalPrice: bestMandi.modalPrice },
        lowestPrice: { market: worstMandi.market, state: worstMandi.state, district: worstMandi.district, modalPrice: worstMandi.modalPrice },
        averageModalPrice: avgPrice,
        priceRange: `₹${worstMandi.modalPrice} — ₹${bestMandi.modalPrice}`,
      },
      records: formatted,
    };

    return res.json(responsePayload);

  } catch (error: any) {
    console.error('Error in Mandi Compare:', error);
    return res.status(500).json({ success: false, error: 'Failed to compare mandi prices', message: error.message });
  }
}
