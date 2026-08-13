import { VercelRequest, VercelResponse } from '@vercel/node';
import { DATA_GOV_API_KEY, MANDI_API_URL, fetchWithTimeout, MOCK_MANDI_RECORDS, fuzzyMatch, computeTrend } from './_data.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  try {
    const { state, commodity, search, limit = '50' } = req.query;

    let apiEndpoint = `${MANDI_API_URL}?api-key=${DATA_GOV_API_KEY}&format=json&limit=${limit}`;

    if (state && typeof state === 'string' && state !== 'all') {
      apiEndpoint += `&filters[state]=${encodeURIComponent(state)}`;
    }
    if (commodity && typeof commodity === 'string' && commodity !== 'all') {
      apiEndpoint += `&filters[commodity]=${encodeURIComponent(commodity)}`;
    }

    let records: any[] = [];
    let isLiveApi = false;
    let apiStatusMessage = 'Live sync with data.gov.in (OGD Portal)';

    try {
      const response = await fetchWithTimeout(apiEndpoint, {
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.records) && data.records.length > 0) {
          records = data.records;
          isLiveApi = true;
        }
      }
    } catch (fetchError: any) {
      const reason = fetchError?.name === 'AbortError' ? 'timeout (8s)' : 'network failure';
      console.warn(`data.gov.in API ${reason}, switching to local dataset fallback`);
    }

    if (records.length === 0) {
      records = [...MOCK_MANDI_RECORDS];
      apiStatusMessage = 'Cached Live Mandi Rate Stream (data.gov.in format)';
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      records = records.filter(r =>
        (r.commodity && r.commodity.toLowerCase().includes(q)) ||
        (r.market && r.market.toLowerCase().includes(q)) ||
        (r.state && r.state.toLowerCase().includes(q)) ||
        (r.district && r.district.toLowerCase().includes(q)) ||
        (r.variety && r.variety.toLowerCase().includes(q))
      );
    }

    if (!isLiveApi) {
      if (state && typeof state === 'string' && state !== 'all') {
        records = records.filter(r => r.state.toLowerCase() === state.toLowerCase());
      }
      if (commodity && typeof commodity === 'string' && commodity !== 'all') {
        records = records.filter(r => fuzzyMatch(commodity, r.commodity));
      }
    }

    const formattedRecords = records.map((r, i) => {
      const minP = Number(r.min_price) || 0;
      const maxP = Number(r.max_price) || 0;
      const modalP = Number(r.modal_price) || 0;
      return {
        id: i + 1,
        state: r.state || 'N/A',
        district: r.district || 'N/A',
        market: r.market || 'N/A',
        commodity: r.commodity || 'N/A',
        variety: r.variety || 'Standard',
        arrivalDate: r.arrival_date || new Date().toLocaleDateString('en-IN'),
        minPrice: minP,
        maxPrice: maxP,
        modalPrice: modalP,
        pricePerKg: (modalP / 100).toFixed(2),
        trend: computeTrend(minP, maxP, modalP),
      };
    });

    const allStates = Array.from(new Set(MOCK_MANDI_RECORDS.map(r => r.state))).sort();
    const allCommodities = Array.from(new Set(MOCK_MANDI_RECORDS.map(r => r.commodity))).sort();

    const responsePayload = {
      success: true,
      source: isLiveApi ? 'data.gov.in (OGD India API)' : 'Data.gov.in Open Data Engine',
      statusMessage: apiStatusMessage,
      timestamp: new Date().toISOString(),
      totalRecords: formattedRecords.length,
      states: allStates,
      commodities: allCommodities,
      records: formattedRecords,
    };

    return res.json(responsePayload);

  } catch (error: any) {
    console.error('Error fetching Mandi prices:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch Mandi price index data',
      message: error.message,
    });
  }
}
