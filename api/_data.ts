// API Keys from environment
export const DATA_GOV_API_KEY = process.env.DATA_GOV_IN_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
export const MANDI_API_URL = 'https://api.data.gov.in/resource/9ef74157-1479-464a-b8ca-3d35307d6237';
export const API_TIMEOUT_MS = 8000;

export function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

export function fuzzyMatch(query: string, target: string): boolean {
  const nq = normalize(query);
  const nt = normalize(target);
  if (nt === nq) return true;
  if (nt.includes(nq)) return true;
  if (nq.includes(nt)) return true;
  const qWords = nq.split(' ');
  const tWords = nt.split(' ');
  const shorter = qWords.length <= tWords.length ? qWords : tWords;
  const longer = qWords.length <= tWords.length ? nt : nq;
  return shorter.every(w => w.length > 1 && longer.includes(w));
}

export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = API_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function computeTrend(minPrice: number, maxPrice: number, modalPrice: number): string {
  if (!modalPrice || !minPrice || !maxPrice) return '+0.0%';
  const midpoint = (minPrice + maxPrice) / 2;
  const deviation = ((modalPrice - midpoint) / midpoint) * 100;
  const sign = deviation >= 0 ? '+' : '';
  return `${sign}${deviation.toFixed(1)}%`;
}

export const MOCK_MANDI_RECORDS = [
  { state: 'Punjab', district: 'Amritsar', market: 'Amritsar Central', commodity: 'Wheat', variety: 'Dara (Desi)', arrival_date: '11/08/2026', min_price: '2275', max_price: '2480', modal_price: '2380' },
  { state: 'Punjab', district: 'Ludhiana', market: 'Ludhiana Grain Hub', commodity: 'Paddy (Basmati)', variety: '1121 Super', arrival_date: '11/08/2026', min_price: '3850', max_price: '4300', modal_price: '4120' },
  { state: 'Punjab', district: 'Bathinda', market: 'Bathinda Cotton Yard', commodity: 'Cotton', variety: 'Kapas Long Staple', arrival_date: '11/08/2026', min_price: '6950', max_price: '7620', modal_price: '7340' },
  { state: 'Maharashtra', district: 'Nashik', market: 'Lasalgaon Mandi', commodity: 'Onion', variety: 'Red Globe', arrival_date: '11/08/2026', min_price: '1250', max_price: '1820', modal_price: '1580' },
  { state: 'Maharashtra', district: 'Nashik', market: 'Pimpalgaon Yard', commodity: 'Tomato', variety: 'Hybrid Tomato', arrival_date: '11/08/2026', min_price: '1400', max_price: '2150', modal_price: '1850' },
  { state: 'Maharashtra', district: 'Latur', market: 'Latur Pulse Mandi', commodity: 'Arhar', variety: 'Tur Dal (Red)', arrival_date: '11/08/2026', min_price: '6800', max_price: '7450', modal_price: '7150' },
  { state: 'Gujarat', district: 'Rajkot', market: 'Rajkot Cotton Market', commodity: 'Cotton', variety: 'Kapas Medium', arrival_date: '11/08/2026', min_price: '6850', max_price: '7480', modal_price: '7250' },
  { state: 'Gujarat', district: 'Junagadh', market: 'Junagadh Oilseed Mandi', commodity: 'Groundnut', variety: 'Bold Shell', arrival_date: '11/08/2026', min_price: '5200', max_price: '5850', modal_price: '5540' },
  { state: 'Rajasthan', district: 'Jaipur', market: 'Jaipur Grain Mandi', commodity: 'Mustard', variety: 'Sarson Black', arrival_date: '11/08/2026', min_price: '5150', max_price: '5680', modal_price: '5420' },
  { state: 'Rajasthan', district: 'Jodhpur', market: 'Jodhpur Krishi Mandi', commodity: 'Bajra', variety: 'Pusa Composite', arrival_date: '11/08/2026', min_price: '2150', max_price: '2520', modal_price: '2350' },
  { state: 'Haryana', district: 'Karnal', market: 'Karnal Anaj Mandi', commodity: 'Wheat', variety: 'Sharbati Quality', arrival_date: '11/08/2026', min_price: '2350', max_price: '2600', modal_price: '2490' },
  { state: 'Haryana', district: 'Sirsa', market: 'Sirsa Grain Mandi', commodity: 'Paddy (Basmati)', variety: 'Pusa 1509', arrival_date: '11/08/2026', min_price: '3650', max_price: '4100', modal_price: '3880' },
  { state: 'Uttar Pradesh', district: 'Agra', market: 'Agra Mandi', commodity: 'Potato', variety: 'Jyoti / Kufri', arrival_date: '11/08/2026', min_price: '1100', max_price: '1520', modal_price: '1340' },
  { state: 'Uttar Pradesh', district: 'Lucknow', market: 'Lucknow Sabzi Mandi', commodity: 'Green Peas', variety: 'Arkel Hybrid', arrival_date: '11/08/2026', min_price: '3200', max_price: '4100', modal_price: '3680' },
  { state: 'Uttar Pradesh', district: 'Muzaffarnagar', market: 'Muzaffarnagar Gur Mandi', commodity: 'Sugarcane', variety: 'CoS 767', arrival_date: '11/08/2026', min_price: '350', max_price: '415', modal_price: '385' },
  { state: 'Karnataka', district: 'Kolar', market: 'Kolar Veg Hub', commodity: 'Tomato', variety: 'Desi Hybrid', arrival_date: '11/08/2026', min_price: '1600', max_price: '2300', modal_price: '1980' },
  { state: 'Karnataka', district: 'Davangere', market: 'Davangere Mandi', commodity: 'Maize', variety: 'Yellow Hybrid', arrival_date: '11/08/2026', min_price: '1950', max_price: '2280', modal_price: '2120' },
  { state: 'Madhya Pradesh', district: 'Indore', market: 'Indore Malwa Mandi', commodity: 'Soyabean', variety: 'Yellow Soyabean', arrival_date: '11/08/2026', min_price: '4400', max_price: '4890', modal_price: '4680' },
  { state: 'Madhya Pradesh', district: 'Ujjain', market: 'Ujjain Krishi Upaj Mandi', commodity: 'Wheat', variety: 'Lokwan', arrival_date: '11/08/2026', min_price: '2200', max_price: '2450', modal_price: '2340' },
  { state: 'Madhya Pradesh', district: 'Chhindwara', market: 'Chhindwara Mandi', commodity: 'Bengal Gram', variety: 'Desi Chana', arrival_date: '11/08/2026', min_price: '4900', max_price: '5350', modal_price: '5150' },
  { state: 'Himachal Pradesh', district: 'Shimla', market: 'Shimla Fruit Hub', commodity: 'Apple', variety: 'Royal Delicious', arrival_date: '11/08/2026', min_price: '6500', max_price: '9200', modal_price: '7800' },
  { state: 'Andhra Pradesh', district: 'Guntur', market: 'Guntur Chilli Yard', commodity: 'Chilli', variety: 'Teja Red', arrival_date: '11/08/2026', min_price: '14500', max_price: '18200', modal_price: '16400' },
  { state: 'Andhra Pradesh', district: 'Kurnool', market: 'Kurnool Grain Market', commodity: 'Jowar', variety: 'Maldandi (M-35)', arrival_date: '11/08/2026', min_price: '2800', max_price: '3250', modal_price: '3050' },
  { state: 'Bihar', district: 'Patna', market: 'Patna Anaj Mandi', commodity: 'Wheat', variety: 'Sharbati', arrival_date: '11/08/2026', min_price: '2250', max_price: '2520', modal_price: '2400' },
  { state: 'Bihar', district: 'Muzaffarpur', market: 'Muzaffarpur Fruit Mandi', commodity: 'Banana', variety: 'Robusta Cavendish', arrival_date: '11/08/2026', min_price: '1200', max_price: '1750', modal_price: '1480' },
  { state: 'Bihar', district: 'Bhagalpur', market: 'Bhagalpur Grain Mandi', commodity: 'Maize', variety: 'Yellow Desi', arrival_date: '11/08/2026', min_price: '1850', max_price: '2200', modal_price: '2050' },
  { state: 'West Bengal', district: 'Hooghly', market: 'Dhaniakhali Rice Mandi', commodity: 'Paddy (Basmati)', variety: 'Gobindobhog Aromatic', arrival_date: '11/08/2026', min_price: '3500', max_price: '4050', modal_price: '3780' },
  { state: 'West Bengal', district: 'Malda', market: 'Malda Mango Mandi', commodity: 'Mango', variety: 'Himsagar / Langra', arrival_date: '11/08/2026', min_price: '3000', max_price: '4500', modal_price: '3800' },
  { state: 'Tamil Nadu', district: 'Thanjavur', market: 'Thanjavur Rice Mandi', commodity: 'Paddy (Basmati)', variety: 'Ponni Super', arrival_date: '11/08/2026', min_price: '2600', max_price: '3100', modal_price: '2880' },
  { state: 'Tamil Nadu', district: 'Erode', market: 'Erode Turmeric Yard', commodity: 'Turmeric', variety: 'Salem Erode Finger', arrival_date: '11/08/2026', min_price: '9500', max_price: '13200', modal_price: '11400' },
  { state: 'Tamil Nadu', district: 'Coimbatore', market: 'Coimbatore Veg Market', commodity: 'Banana', variety: 'Nendran Cooking', arrival_date: '11/08/2026', min_price: '1800', max_price: '2400', modal_price: '2100' },
  { state: 'Telangana', district: 'Nizamabad', market: 'Nizamabad Turmeric Mandi', commodity: 'Turmeric', variety: 'Nizamabad Bulb', arrival_date: '11/08/2026', min_price: '8800', max_price: '12500', modal_price: '10800' },
  { state: 'Telangana', district: 'Warangal', market: 'Warangal Cotton Yard', commodity: 'Cotton', variety: 'Bt Hybrid Kapas', arrival_date: '11/08/2026', min_price: '6700', max_price: '7350', modal_price: '7080' },
  { state: 'Odisha', district: 'Sambalpur', market: 'Sambalpur Rice Mandi', commodity: 'Paddy (Basmati)', variety: 'Swarna MTU-7029', arrival_date: '11/08/2026', min_price: '2150', max_price: '2500', modal_price: '2350' },
  { state: 'Odisha', district: 'Rayagada', market: 'Rayagada Mandi', commodity: 'Urad', variety: 'Black Gram T-9', arrival_date: '11/08/2026', min_price: '6200', max_price: '6950', modal_price: '6600' },
  { state: 'Assam', district: 'Nagaon', market: 'Nagaon Rice Market', commodity: 'Paddy (Basmati)', variety: 'Joha Scented', arrival_date: '11/08/2026', min_price: '3200', max_price: '3800', modal_price: '3520' },
  { state: 'Assam', district: 'Jorhat', market: 'Jorhat Mandi', commodity: 'Mustard', variety: 'Toria Yellow', arrival_date: '11/08/2026', min_price: '4800', max_price: '5350', modal_price: '5100' },
  { state: 'Kerala', district: 'Thrissur', market: 'Thrissur APMC Yard', commodity: 'Banana', variety: 'Nendran Plantain', arrival_date: '11/08/2026', min_price: '2200', max_price: '3000', modal_price: '2650' },
  { state: 'Kerala', district: 'Idukki', market: 'Idukki Spice Hub', commodity: 'Garlic', variety: 'Nattupoondu Desi', arrival_date: '11/08/2026', min_price: '8500', max_price: '12000', modal_price: '10200' },
  { state: 'Chhattisgarh', district: 'Raipur', market: 'Raipur Anaj Mandi', commodity: 'Paddy (Basmati)', variety: 'HMT Dubraj', arrival_date: '11/08/2026', min_price: '2100', max_price: '2480', modal_price: '2300' },
  { state: 'Chhattisgarh', district: 'Durg', market: 'Durg Mandi', commodity: 'Moong', variety: 'Green Moong Whole', arrival_date: '11/08/2026', min_price: '7200', max_price: '7900', modal_price: '7580' },
  { state: 'Jharkhand', district: 'Ranchi', market: 'Ranchi Sabzi Mandi', commodity: 'Potato', variety: 'Kufri Jyoti', arrival_date: '11/08/2026', min_price: '1050', max_price: '1450', modal_price: '1280' },
  { state: 'Jharkhand', district: 'Dumka', market: 'Dumka Grain Market', commodity: 'Maize', variety: 'Desi Yellow', arrival_date: '11/08/2026', min_price: '1800', max_price: '2150', modal_price: '1980' },
  { state: 'Uttarakhand', district: 'Dehradun', market: 'Dehradun Mandi', commodity: 'Wheat', variety: 'UP-2338', arrival_date: '11/08/2026', min_price: '2280', max_price: '2550', modal_price: '2420' },
  { state: 'Uttarakhand', district: 'Haridwar', market: 'Haridwar Krishi Mandi', commodity: 'Sugarcane', variety: 'CoS 8436', arrival_date: '11/08/2026', min_price: '340', max_price: '400', modal_price: '375' },
];

export const INDIAN_CITIES: Record<string, Array<{ city: string; lat: number; lng: number }>> = {
  'Punjab': [
    { city: 'Amritsar', lat: 31.63, lng: 74.87 }, { city: 'Ludhiana', lat: 30.90, lng: 75.85 },
    { city: 'Bathinda', lat: 30.21, lng: 74.95 }, { city: 'Patiala', lat: 30.34, lng: 76.39 },
  ],
  'Haryana': [
    { city: 'Karnal', lat: 29.69, lng: 76.98 }, { city: 'Hisar', lat: 29.15, lng: 75.72 },
    { city: 'Sirsa', lat: 29.53, lng: 75.03 }, { city: 'Ambala', lat: 30.38, lng: 76.78 },
  ],
  'Uttar Pradesh': [
    { city: 'Lucknow', lat: 26.85, lng: 80.95 }, { city: 'Agra', lat: 27.18, lng: 78.02 },
    { city: 'Varanasi', lat: 25.32, lng: 82.99 }, { city: 'Kanpur', lat: 26.45, lng: 80.35 },
    { city: 'Muzaffarnagar', lat: 29.47, lng: 77.70 },
  ],
  'Maharashtra': [
    { city: 'Nashik', lat: 20.00, lng: 73.78 }, { city: 'Pune', lat: 18.52, lng: 73.86 },
    { city: 'Nagpur', lat: 21.15, lng: 79.09 }, { city: 'Latur', lat: 18.40, lng: 76.57 },
  ],
  'Rajasthan': [
    { city: 'Jaipur', lat: 26.92, lng: 75.79 }, { city: 'Jodhpur', lat: 26.24, lng: 73.02 },
    { city: 'Udaipur', lat: 24.59, lng: 73.71 }, { city: 'Kota', lat: 25.18, lng: 75.83 },
  ],
  'Gujarat': [
    { city: 'Ahmedabad', lat: 23.02, lng: 72.57 }, { city: 'Rajkot', lat: 22.30, lng: 70.80 },
    { city: 'Junagadh', lat: 21.52, lng: 70.46 }, { city: 'Surat', lat: 21.17, lng: 72.83 },
  ],
  'Madhya Pradesh': [
    { city: 'Indore', lat: 22.72, lng: 75.86 }, { city: 'Bhopal', lat: 23.26, lng: 77.41 },
    { city: 'Ujjain', lat: 23.18, lng: 75.77 }, { city: 'Chhindwara', lat: 22.06, lng: 78.94 },
  ],
  'Karnataka': [
    { city: 'Bengaluru', lat: 12.97, lng: 77.59 }, { city: 'Kolar', lat: 13.14, lng: 78.13 },
    { city: 'Davangere', lat: 14.47, lng: 75.92 }, { city: 'Mysuru', lat: 12.30, lng: 76.66 },
  ],
  'Tamil Nadu': [
    { city: 'Chennai', lat: 13.08, lng: 80.27 }, { city: 'Thanjavur', lat: 10.79, lng: 79.14 },
    { city: 'Erode', lat: 11.34, lng: 77.73 }, { city: 'Coimbatore', lat: 11.00, lng: 76.96 },
  ],
  'Andhra Pradesh': [
    { city: 'Guntur', lat: 16.31, lng: 80.44 }, { city: 'Kurnool', lat: 15.83, lng: 78.04 },
    { city: 'Vijayawada', lat: 16.51, lng: 80.65 },
  ],
  'Telangana': [
    { city: 'Hyderabad', lat: 17.39, lng: 78.49 }, { city: 'Nizamabad', lat: 18.67, lng: 78.09 },
    { city: 'Warangal', lat: 17.98, lng: 79.60 },
  ],
  'Bihar': [
    { city: 'Patna', lat: 25.61, lng: 85.14 }, { city: 'Muzaffarpur', lat: 26.12, lng: 85.39 },
    { city: 'Bhagalpur', lat: 25.24, lng: 86.97 },
  ],
  'West Bengal': [
    { city: 'Kolkata', lat: 22.57, lng: 88.36 }, { city: 'Malda', lat: 25.01, lng: 88.14 },
    { city: 'Hooghly', lat: 22.91, lng: 88.39 },
  ],
  'Odisha': [
    { city: 'Bhubaneswar', lat: 20.30, lng: 85.82 }, { city: 'Sambalpur', lat: 21.47, lng: 83.97 },
  ],
  'Assam': [
    { city: 'Guwahati', lat: 26.14, lng: 91.74 }, { city: 'Jorhat', lat: 26.76, lng: 94.22 },
    { city: 'Nagaon', lat: 26.35, lng: 92.69 },
  ],
  'Kerala': [
    { city: 'Kochi', lat: 9.93, lng: 76.27 }, { city: 'Thrissur', lat: 10.53, lng: 76.21 },
    { city: 'Idukki', lat: 9.85, lng: 76.97 },
  ],
  'Himachal Pradesh': [
    { city: 'Shimla', lat: 31.10, lng: 77.17 }, { city: 'Kullu', lat: 31.96, lng: 77.11 },
  ],
  'Chhattisgarh': [
    { city: 'Raipur', lat: 21.25, lng: 81.63 }, { city: 'Durg', lat: 21.19, lng: 81.28 },
  ],
  'Jharkhand': [
    { city: 'Ranchi', lat: 23.34, lng: 85.31 }, { city: 'Dumka', lat: 24.27, lng: 87.25 },
  ],
  'Uttarakhand': [
    { city: 'Dehradun', lat: 30.32, lng: 78.03 }, { city: 'Haridwar', lat: 29.95, lng: 78.16 },
  ],
};

export function weatherCodeToDesc(code: number): { desc: string; icon: string } {
  if (code === 0) return { desc: 'Clear Sky', icon: '☀️' };
  if (code <= 3) return { desc: 'Partly Cloudy', icon: '⛅' };
  if (code <= 48) return { desc: 'Fog / Mist', icon: '🌫️' };
  if (code <= 57) return { desc: 'Drizzle', icon: '🌦️' };
  if (code <= 67) return { desc: 'Rain', icon: '🌧️' };
  if (code <= 77) return { desc: 'Snow', icon: '❄️' };
  if (code <= 82) return { desc: 'Heavy Rain Showers', icon: '⛈️' };
  if (code <= 86) return { desc: 'Snow Showers', icon: '🌨️' };
  if (code <= 99) return { desc: 'Thunderstorm', icon: '⛈️' };
  return { desc: 'Unknown', icon: '🌡️' };
}

export function generateFarmAlerts(current: any, daily: any): Array<{ level: 'HIGH' | 'MEDIUM' | 'LOW'; type: string; title: string; advice: string }> {
  const alerts: Array<{ level: 'HIGH' | 'MEDIUM' | 'LOW'; type: string; title: string; advice: string }> = [];
  const temp = current.temperature_2m;
  const humidity = current.relative_humidity_2m;
  const wind = current.wind_speed_10m;
  const rain = current.rain || 0;
  const weatherCode = current.weather_code || 0;

  if (temp >= 42) {
    alerts.push({ level: 'HIGH', type: 'HEATWAVE', title: `Extreme Heatwave Alert — ${temp}°C`, advice: 'Provide shade nets for vegetable crops. Irrigate during early morning (5-7 AM) and evening. Avoid mid-day field work to prevent heat stroke.' });
  } else if (temp >= 38) {
    alerts.push({ level: 'MEDIUM', type: 'HEAT', title: `High Temperature Warning — ${temp}°C`, advice: 'Apply mulch around crop bases to retain soil moisture. Increase irrigation frequency. Spray anti-transpirant on sensitive crops.' });
  }

  if (rain > 20 || weatherCode >= 80) {
    alerts.push({ level: 'HIGH', type: 'HEAVY_RAIN', title: `Heavy Rainfall Alert — ${rain.toFixed(1)} mm`, advice: 'Cover harvested grains with tarpaulin. Ensure field drainage channels are clear. Delay pesticide spraying for 48 hours after heavy rain.' });
  } else if (rain > 5) {
    alerts.push({ level: 'MEDIUM', type: 'RAIN', title: `Moderate Rainfall — ${rain.toFixed(1)} mm`, advice: 'Good conditions for sowing. Delay fertilizer top-dressing by 24 hours. Check for waterlogging in low-lying fields.' });
  }

  if (temp <= 4) {
    alerts.push({ level: 'HIGH', type: 'FROST', title: `Frost Warning — Temperature ${temp}°C`, advice: 'Provide light night irrigation to protect crops from frost damage. Cover nursery beds with polythene sheets. Apply smoke during pre-dawn hours.' });
  } else if (temp <= 10) {
    alerts.push({ level: 'LOW', type: 'COLD', title: `Low Temperature Advisory — ${temp}°C`, advice: 'Monitor wheat and mustard crops for cold stress symptoms. Ensure proper drainage to prevent frost pockets.' });
  }

  if (wind >= 40) {
    alerts.push({ level: 'HIGH', type: 'WIND', title: `Strong Wind Warning — ${wind.toFixed(0)} km/h`, advice: 'Secure crop support structures and trellis systems. Delay pesticide/fungicide spraying. Protect young transplants and nurseries.' });
  } else if (wind >= 25) {
    alerts.push({ level: 'MEDIUM', type: 'WIND', title: `Gusty Wind Advisory — ${wind.toFixed(0)} km/h`, advice: 'Avoid aerial spraying operations. Stake tall crops like sugarcane and maize to prevent lodging.' });
  }

  if (humidity >= 85 && temp >= 25) {
    alerts.push({ level: 'MEDIUM', type: 'DISEASE_RISK', title: `High Humidity Disease Risk — ${humidity}%`, advice: 'High fungal infection risk. Apply preventive copper-based fungicide. Monitor for Late Blight in potato/tomato and Blast in paddy.' });
  }

  if (rain === 0 && humidity < 30 && temp > 35) {
    alerts.push({ level: 'MEDIUM', type: 'DROUGHT', title: 'Dry Spell Warning — No Rainfall', advice: 'Conserve soil moisture with mulching. Consider drip irrigation for water efficiency. Prioritize irrigation for flowering-stage crops.' });
  }

  if (alerts.length === 0) {
    alerts.push({ level: 'LOW', type: 'FAVORABLE', title: `Favorable Weather — ${temp}°C, ${humidity}% Humidity`, advice: `Good conditions for field operations. Wind at ${wind.toFixed(0)} km/h is suitable for spraying. Plan outdoor activities freely.` });
  }

  return alerts;
}
