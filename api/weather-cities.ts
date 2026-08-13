import { VercelRequest, VercelResponse } from '@vercel/node';
import { INDIAN_CITIES } from './_data.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const result: Record<string, string[]> = {};
  for (const [state, cities] of Object.entries(INDIAN_CITIES)) {
    result[state] = cities.map(c => c.city);
  }
  return res.json({
    success: true,
    states: Object.keys(INDIAN_CITIES).sort(),
    stateCityMap: result,
  });
}
