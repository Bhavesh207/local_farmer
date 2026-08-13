import { VercelRequest, VercelResponse } from '@vercel/node';
import { MOCK_MANDI_RECORDS } from './_data.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const states = Array.from(new Set(MOCK_MANDI_RECORDS.map(r => r.state))).sort();
  const commodities = Array.from(new Set(MOCK_MANDI_RECORDS.map(r => r.commodity))).sort();

  const stateCommodityMap: Record<string, string[]> = {};
  for (const r of MOCK_MANDI_RECORDS) {
    if (!stateCommodityMap[r.state]) stateCommodityMap[r.state] = [];
    if (!stateCommodityMap[r.state].includes(r.commodity)) {
      stateCommodityMap[r.state].push(r.commodity);
    }
  }

  return res.json({
    success: true,
    states,
    commodities,
    stateCommodityMap,
    totalStates: states.length,
    totalCommodities: commodities.length,
  });
}
