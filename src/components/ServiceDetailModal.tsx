import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle2, Calendar, Send, Sparkles, Sprout, Search, TrendingUp, AlertTriangle, Calculator, FileText, PhoneCall, ShieldAlert, Check, Play, Video, MapPin, Loader2, Award, ChevronDown, ChevronUp, Zap, Target, Info } from 'lucide-react';
import { ServiceItem } from '../types';
import { IMAGES } from '../constants/data';

// Fallback lists — will be replaced by dynamic fetch from /api/mandi-options
const DEFAULT_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const DEFAULT_CROPS = [
  'Apple', 'Arhar', 'Bajra', 'Banana', 'Bengal Gram', 'Chilli', 'Cotton',
  'Garlic', 'Green Peas', 'Groundnut', 'Jowar', 'Maize', 'Mango', 'Moong',
  'Mustard', 'Onion', 'Paddy (Basmati)', 'Potato', 'Soyabean', 'Sugarcane',
  'Tomato', 'Turmeric', 'Urad', 'Wheat',
];

// Type for mandi record from API
interface MandiRecord {
  id: number;
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrivalDate: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  pricePerKg: string;
  trend: string;
}

// Type for AI insights from API
interface AiInsights {
  recommendation: string;
  recommendationLabel: string;
  marketOverview: string;
  priceSpread: string;
  bestMandis: Array<{ name: string; location: string; expectedRate: string; reason: string }>;
  actionableTips: string[];
}

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onOpenVideoModal?: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onOpenVideoModal,
}) => {
  const [requested, setRequested] = useState(false);
  const [farmSize, setFarmSize] = useState('10-50 acres');

  // Tool specific state
  // Mandi Price state — API-connected live search
  const [mandiState, setMandiState] = useState('');
  const [mandiCrop, setMandiCrop] = useState('');
  const [mandiQuintals, setMandiQuintals] = useState<number>(10);
  const [mandiResults, setMandiResults] = useState<MandiRecord[]>([]);
  const [mandiLoading, setMandiLoading] = useState(false);
  const [mandiError, setMandiError] = useState('');
  const [apiSource, setApiSource] = useState('');
  const [aiInsights, setAiInsights] = useState<AiInsights | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [bestPriceIndex, setBestPriceIndex] = useState(-1);

  // Dynamic dropdown options fetched from /api/mandi-options
  const [availableStates, setAvailableStates] = useState<string[]>(DEFAULT_STATES);
  const [availableCrops, setAvailableCrops] = useState<string[]>(DEFAULT_CROPS);
  const [stateCommodityMap, setStateCommodityMap] = useState<Record<string, string[]>>({});

  // Fetch dynamic dropdown options on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/mandi-options');
        const data = await res.json();
        if (data.success) {
          if (data.states?.length) setAvailableStates(data.states);
          if (data.commodities?.length) setAvailableCrops(data.commodities);
          if (data.stateCommodityMap) setStateCommodityMap(data.stateCommodityMap);
        }
      } catch {
        // Silently fall back to defaults
      }
    })();
  }, []);

  // Crops filtered by selected state (if map available)
  const cropsForState = mandiState && stateCommodityMap[mandiState]
    ? stateCommodityMap[mandiState]
    : availableCrops;

  // Fetch mandi prices from backend API
  const fetchMandiPrices = useCallback(async (state: string, crop: string) => {
    setMandiLoading(true);
    setMandiError('');
    setMandiResults([]);
    setBestPriceIndex(-1);
    setAiInsights(null);

    try {
      const params = new URLSearchParams();
      if (state) params.set('state', state);
      if (crop) params.set('commodity', crop);
      params.set('limit', '50');

      const response = await fetch(`/api/mandi-prices?${params.toString()}`);
      const data = await response.json();

      if (data.success && data.records && data.records.length > 0) {
        setMandiResults(data.records);
        setApiSource(data.source || 'data.gov.in');

        // Find best price (highest modal price)
        let maxIdx = 0;
        for (let i = 1; i < data.records.length; i++) {
          if (data.records[i].modalPrice > data.records[maxIdx].modalPrice) {
            maxIdx = i;
          }
        }
        setBestPriceIndex(maxIdx);

        // Fetch AI insights in background
        fetchAiInsights(crop || data.records[0]?.commodity, state || data.records[0]?.state);
      } else {
        setMandiError('No mandi records found for this State & Crop combination. Try a different selection.');
      }
    } catch (err) {
      setMandiError('Unable to connect to the Mandi price server. Please ensure the backend is running.');
    } finally {
      setMandiLoading(false);
    }
  }, []);

  // Fetch AI market advisory
  const fetchAiInsights = async (product: string, area: string) => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai-mandi-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, area }),
      });
      const data = await response.json();
      if (data.success && data.aiInsights) {
        setAiInsights(data.aiInsights);
      }
    } catch {
      // AI insights are optional — silently fail
    } finally {
      setAiLoading(false);
    }
  };

  // Auto-trigger search when both State and Crop are selected
  useEffect(() => {
    if (mandiState && mandiCrop) {
      fetchMandiPrices(mandiState, mandiCrop);
    }
  }, [mandiState, mandiCrop, fetchMandiPrices]);

  // Profit Calculator state
  const [calcAcres, setCalcAcres] = useState<number>(5);
  const [calcYield, setCalcYield] = useState<number>(20);
  const [calcPrice, setCalcPrice] = useState<number>(2400);
  const [calcCostPerAcre, setCalcCostPerAcre] = useState<number>(15000);

  // Disease Finder state
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedSymptom, setSelectedSymptom] = useState('Yellowing Leaves & Stunting');

  // Crop Calendar state
  const [calendarSeason, setCalendarSeason] = useState<'Kharif' | 'Rabi' | 'Zaid'>('Kharif');

  // Emergency Alert SMS signup
  const [phoneAlert, setPhoneAlert] = useState('');
  const [alertSubmitted, setAlertSubmitted] = useState(false);

  // Weather state for emergency-alerts
  const [weatherState, setWeatherState] = useState('');
  const [weatherCity, setWeatherCity] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');
  const [weatherStates, setWeatherStates] = useState<string[]>([]);
  const [weatherCityMap, setWeatherCityMap] = useState<Record<string, string[]>>({});

  // Fetch weather city options on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/weather-cities');
        const data = await res.json();
        if (data.success) {
          setWeatherStates(data.states || []);
          setWeatherCityMap(data.stateCityMap || {});
        }
      } catch { /* fallback to empty */ }
    })();
  }, []);

  // Auto-fetch weather when both state and city are selected
  useEffect(() => {
    if (!weatherState || !weatherCity) return;
    (async () => {
      setWeatherLoading(true);
      setWeatherError('');
      setWeatherData(null);
      try {
        const res = await fetch(`/api/weather?state=${encodeURIComponent(weatherState)}&city=${encodeURIComponent(weatherCity)}`);
        const data = await res.json();
        if (data.success) {
          setWeatherData(data);
        } else {
          setWeatherError(data.error || 'Failed to fetch weather data.');
        }
      } catch {
        setWeatherError('Unable to connect to weather server.');
      } finally {
        setWeatherLoading(false);
      }
    })();
  }, [weatherState, weatherCity]);

  if (!service) return null;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setRequested(true);
    setTimeout(() => {
      setRequested(false);
      onClose();
    }, 2000);
  };

  // Calculations for Profit Calculator
  const totalProduction = calcAcres * calcYield;
  const totalRevenue = totalProduction * calcPrice;
  const totalExpenses = calcAcres * calcCostPerAcre;
  const netProfit = totalRevenue - totalExpenses;

  // Render Tool Specific Content
  const renderInteractiveTool = () => {
    switch (service.id) {
      case 'mandi-price':
        return (
          <div className="space-y-5">
            {/* State & Crop Selector */}
            <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-700/60 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-300 mb-1.5 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Select State</span>
                  </label>
                  <select
                    value={mandiState}
                    onChange={(e) => { setMandiState(e.target.value); setMandiCrop(''); }}
                    className="w-full bg-emerald-900/60 border border-emerald-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                  >
                    <option value="">— Choose Your State —</option>
                    {availableStates.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-300 mb-1.5 flex items-center space-x-1">
                    <Sprout className="w-3.5 h-3.5" />
                    <span>Select Crop / Commodity</span>
                  </label>
                  <select
                    value={mandiCrop}
                    onChange={(e) => setMandiCrop(e.target.value)}
                    className="w-full bg-emerald-900/60 border border-emerald-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                  >
                    <option value="">— Choose Crop —</option>
                    {cropsForState.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-emerald-200 font-semibold">Qty for value estimation:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-emerald-400">Quintals:</span>
                  <input
                    type="number"
                    value={mandiQuintals}
                    onChange={(e) => setMandiQuintals(Math.max(1, Number(e.target.value)))}
                    className="w-20 bg-emerald-900/60 border border-emerald-700/60 rounded-xl px-3 py-1.5 text-sm text-amber-300 font-bold text-center focus:outline-none"
                  />
                </div>
              </div>

              {/* Auto-trigger hint */}
              {(!mandiState || !mandiCrop) && (
                <p className="text-xs text-emerald-400/70 text-center italic flex items-center justify-center space-x-1">
                  <Info className="w-3 h-3" />
                  <span>Select both State and Crop to auto-fetch live mandi prices</span>
                </p>
              )}
            </div>

            {/* Loading Spinner */}
            {mandiLoading && (
              <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                <p className="text-sm text-emerald-200 animate-pulse">Fetching live mandi rates from data.gov.in...</p>
              </div>
            )}

            {/* Error State */}
            {mandiError && !mandiLoading && (
              <div className="p-4 bg-rose-950/50 rounded-2xl border border-rose-700/50 text-center space-y-2">
                <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto" />
                <p className="text-sm text-rose-200">{mandiError}</p>
              </div>
            )}

            {/* Results Table */}
            {mandiResults.length > 0 && !mandiLoading && (
              <>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-300 font-semibold">
                    {mandiResults.length} market{mandiResults.length > 1 ? 's' : ''} found — {mandiState} · {mandiCrop}
                  </span>
                  <span className="text-slate-400 truncate ml-2">Source: {apiSource}</span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-emerald-800/60 bg-emerald-950/40">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-200">
                    <thead className="bg-emerald-900/80 text-emerald-300 uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="p-3">Commodity</th>
                        <th className="p-3">Mandi / Market</th>
                        <th className="p-3">District</th>
                        <th className="p-3">Min ₹</th>
                        <th className="p-3">Max ₹</th>
                        <th className="p-3">Modal ₹/Qtl</th>
                        <th className="p-3">Est. Value ({mandiQuintals} Qtl)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-900/60">
                      {mandiResults.map((item, idx) => (
                        <tr
                          key={item.id}
                          className={`transition ${
                            idx === bestPriceIndex
                              ? 'bg-amber-900/30 border-l-4 border-l-amber-400'
                              : 'hover:bg-emerald-900/40'
                          }`}
                        >
                          <td className="p-3 font-bold text-white">
                            <div className="flex items-center space-x-1.5">
                              {idx === bestPriceIndex && (
                                <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 bg-amber-400/20 border border-amber-400/40 rounded-full text-[10px] text-amber-300 font-bold shrink-0">
                                  <Award className="w-3 h-3" />
                                  <span>Best</span>
                                </span>
                              )}
                              <span>{item.commodity}</span>
                            </div>
                            {item.variety !== 'Standard' && (
                              <span className="text-[10px] text-slate-400 block">{item.variety}</span>
                            )}
                          </td>
                          <td className="p-3 text-slate-300">{item.market}</td>
                          <td className="p-3 text-slate-400">{item.district}</td>
                          <td className="p-3 text-slate-300">₹{item.minPrice.toLocaleString()}</td>
                          <td className="p-3 text-slate-300">₹{item.maxPrice.toLocaleString()}</td>
                          <td className="p-3 font-extrabold text-amber-300">₹{item.modalPrice.toLocaleString()}</td>
                          <td className="p-3 font-extrabold text-[#82c419]">₹{(item.modalPrice * mandiQuintals).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Best Price Highlight Card */}
                {bestPriceIndex >= 0 && mandiResults[bestPriceIndex] && (
                  <div className="p-4 bg-gradient-to-r from-amber-950/60 to-emerald-950/60 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center space-x-2 shrink-0">
                      <Award className="w-6 h-6 text-amber-400" />
                      <span className="text-sm font-bold text-amber-300">Best Price Found</span>
                    </div>
                    <div className="flex-1 text-sm text-white">
                      <strong className="text-amber-200">{mandiResults[bestPriceIndex].market}</strong>, {mandiResults[bestPriceIndex].district} —
                      <span className="text-[#82c419] font-extrabold ml-1">₹{mandiResults[bestPriceIndex].modalPrice.toLocaleString()}/Qtl</span>
                      <span className="text-slate-400 ml-2 text-xs">
                        (₹{(mandiResults[bestPriceIndex].modalPrice * mandiQuintals).toLocaleString()} for {mandiQuintals} Qtl)
                      </span>
                    </div>
                  </div>
                )}

                {/* AI Market Intelligence Panel */}
                <div className="rounded-2xl border border-emerald-700/50 overflow-hidden">
                  <button
                    onClick={() => setShowAiPanel(!showAiPanel)}
                    className="w-full flex items-center justify-between p-3 bg-emerald-900/60 hover:bg-emerald-900/80 transition text-left"
                  >
                    <span className="flex items-center space-x-2 text-sm font-bold text-emerald-200">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>AI Market Intelligence</span>
                      {aiLoading && <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin ml-1" />}
                    </span>
                    {showAiPanel ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {showAiPanel && aiInsights && (
                    <div className="p-4 space-y-4 bg-emerald-950/50">
                      {/* Recommendation Badge */}
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                          aiInsights.recommendation === 'SELL_TODAY'
                            ? 'bg-emerald-900/80 text-[#82c419] border-emerald-500/50'
                            : aiInsights.recommendation === 'HOLD_48_HOURS'
                            ? 'bg-amber-900/80 text-amber-300 border-amber-500/50'
                            : 'bg-sky-900/80 text-sky-300 border-sky-500/50'
                        }`}>
                          {aiInsights.recommendation === 'SELL_TODAY' ? '🟢 SELL TODAY' :
                           aiInsights.recommendation === 'HOLD_48_HOURS' ? '🟡 HOLD 48 HRS' :
                           '🔵 EXPLORE MANDIS'}
                        </span>
                        <span className="text-sm font-semibold text-white">{aiInsights.recommendationLabel}</span>
                      </div>

                      {/* Market Overview */}
                      <p className="text-xs text-slate-300 leading-relaxed">{aiInsights.marketOverview}</p>

                      {/* Price Spread */}
                      {aiInsights.priceSpread && (
                        <p className="text-xs text-emerald-300/80 italic">{aiInsights.priceSpread}</p>
                      )}

                      {/* Best Mandis */}
                      {aiInsights.bestMandis && aiInsights.bestMandis.length > 0 && (
                        <div className="space-y-2">
                          <h6 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1">
                            <Target className="w-3 h-3" />
                            <span>Recommended Mandis</span>
                          </h6>
                          {aiInsights.bestMandis.map((m, i) => (
                            <div key={i} className="flex items-start space-x-2 p-2.5 bg-emerald-900/40 rounded-xl border border-emerald-800/40">
                              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <div className="text-xs">
                                <span className="font-bold text-white">{m.name}</span>
                                <span className="text-slate-400 ml-1">({m.location})</span>
                                <span className="text-amber-300 font-bold ml-2">{m.expectedRate}</span>
                                <p className="text-slate-400 mt-0.5">{m.reason}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actionable Tips */}
                      {aiInsights.actionableTips && aiInsights.actionableTips.length > 0 && (
                        <div className="space-y-1.5">
                          <h6 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">💡 Actionable Tips</h6>
                          {aiInsights.actionableTips.map((tip, i) => (
                            <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#82c419] shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {showAiPanel && aiLoading && !aiInsights && (
                    <div className="p-6 flex items-center justify-center space-x-2 bg-emerald-950/50">
                      <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                      <span className="text-xs text-emerald-300">Analyzing market with Gemini AI...</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-400 text-center">
                  * Rates synced with data.gov.in National Agriculture Market API. Last updated: {mandiResults[0]?.arrivalDate || 'Today'}
                </p>
              </>
            )}
          </div>
        );

      case 'crop-calendar':
        return (
          <div className="space-y-6">
            <div className="flex justify-center space-x-2 bg-emerald-950/80 p-1.5 rounded-2xl border border-emerald-800">
              {(['Kharif', 'Rabi', 'Zaid'] as const).map((season) => (
                <button
                  key={season}
                  onClick={() => setCalendarSeason(season)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    calendarSeason === season
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                  }`}
                >
                  {season} Season
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {calendarSeason === 'Kharif' && (
                <>
                  <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-800/60 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-amber-300">
                      <span>JUNE - JULY (Sowing Phase)</span>
                      <span className="bg-emerald-900 px-2.5 py-1 rounded-full text-emerald-200">Monsoon Onset</span>
                    </div>
                    <h5 className="font-bold text-white text-base">Paddy Rice & Cotton Sowing</h5>
                    <p className="text-xs text-slate-300">Deep plowing with organic compost. Seed treatment with Trichoderma & Azotobacter before nursery bed preparation.</p>
                  </div>
                  <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-800/60 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-amber-300">
                      <span>AUGUST - SEPTEMBER (Vegetative & Protection)</span>
                      <span className="bg-emerald-900 px-2.5 py-1 rounded-full text-emerald-200">Active Growth</span>
                    </div>
                    <h5 className="font-bold text-white text-base">Nutrient Top-Dressing & Pest Monitoring</h5>
                    <p className="text-xs text-slate-300">Apply neem cake fertilizer and monitor stem borer attacks using pheromone traps.</p>
                  </div>
                  <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-800/60 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-amber-300">
                      <span>OCTOBER - NOVEMBER (Harvest)</span>
                      <span className="bg-emerald-900 px-2.5 py-1 rounded-full text-emerald-200">Peak Market Sale</span>
                    </div>
                    <h5 className="font-bold text-white text-base">Threshing & Storage</h5>
                    <p className="text-xs text-slate-300">Ensure grain moisture level below 12% before mandi transport to prevent fungal spoilage.</p>
                  </div>
                </>
              )}

              {calendarSeason === 'Rabi' && (
                <>
                  <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-800/60 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-amber-300">
                      <span>NOVEMBER - DECEMBER (Sowing)</span>
                      <span className="bg-emerald-900 px-2.5 py-1 rounded-full text-emerald-200">Winter Onset</span>
                    </div>
                    <h5 className="font-bold text-white text-base">Wheat, Mustard & Chickpea Sowing</h5>
                    <p className="text-xs text-slate-300">Sow HD-3086 or PBW-725 wheat varieties. Apply primary phosphorus & organic bio-fertilizers.</p>
                  </div>
                  <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-800/60 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-amber-300">
                      <span>JANUARY - FEBRUARY (Flowering & Frost Defense)</span>
                      <span className="bg-emerald-900 px-2.5 py-1 rounded-full text-emerald-200">Frost Guard</span>
                    </div>
                    <h5 className="font-bold text-white text-base">Crown Root Irrigation & Light Spray</h5>
                    <p className="text-xs text-slate-300">Provide light night irrigation during freeze warnings to protect wheat ears from cold injury.</p>
                  </div>
                  <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-800/60 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-amber-300">
                      <span>MARCH - APRIL (Golden Harvest)</span>
                      <span className="bg-emerald-900 px-2.5 py-1 rounded-full text-emerald-200">Harvest Season</span>
                    </div>
                    <h5 className="font-bold text-white text-base">Combine Harvesting & Mandi Dispatch</h5>
                    <p className="text-xs text-slate-300">Harvest mustard and wheat as crop turns golden yellow. Check daily Mandi index for peak rates.</p>
                  </div>
                </>
              )}

              {calendarSeason === 'Zaid' && (
                <>
                  <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-800/60 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-amber-300">
                      <span>MARCH - JUNE (Summer Cash Crops)</span>
                      <span className="bg-emerald-900 px-2.5 py-1 rounded-full text-emerald-200">Summer Harvest</span>
                    </div>
                    <h5 className="font-bold text-white text-base">Watermelon, Cucumber & Moong Dal</h5>
                    <p className="text-xs text-slate-300">Short duration 60-day cash crops utilizing drip irrigation for high summer profitability.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'crop-disease':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-950/80 p-4 rounded-2xl border border-emerald-700/60">
              <div>
                <label className="block text-xs font-bold text-emerald-300 mb-1">Select Crop Type:</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full bg-emerald-900/60 border border-emerald-700/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Tomato">Tomato (Tamatar)</option>
                  <option value="Wheat">Wheat (Gehun)</option>
                  <option value="Cotton">Cotton (Kapas)</option>
                  <option value="Paddy">Paddy / Rice (Dhan)</option>
                  <option value="Chilli">Chilli (Mirchi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-300 mb-1">Observed Symptom:</label>
                <select
                  value={selectedSymptom}
                  onChange={(e) => setSelectedSymptom(e.target.value)}
                  className="w-full bg-emerald-900/60 border border-emerald-700/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Yellowing Leaves & Stunting">Yellowing Leaves & Leaf Curling</option>
                  <option value="Brown Spots on Leaves & Fruits">Concentric Brown Spots / Blight</option>
                  <option value="White Powdery Coating">White Powdery Layer on Stem</option>
                  <option value="Wilting Stems & Root Rot">Sudden Daytime Wilting</option>
                </select>
              </div>
            </div>

            <div className="bg-emerald-900/60 p-5 rounded-2xl border border-amber-400/40 space-y-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-amber-300 shrink-0" />
                <div>
                  <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Diagnostic Result</span>
                  <h5 className="text-lg font-bold text-white">
                    {selectedCrop} — {selectedSymptom.includes('Yellowing') ? 'Yellow Mosaic Viral Disease' : selectedSymptom.includes('Brown') ? 'Early Blight (Alternaria Solani)' : selectedSymptom.includes('White') ? 'Powdery Mildew Fungal Infection' : 'Bacterial Vascular Wilt'}
                  </h5>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-950 p-3 rounded-xl border border-emerald-800">
                  <span className="font-bold text-[#82c419] block mb-1">🌿 Organic Biological Cure:</span>
                  <p className="text-slate-300">
                    Spray Cold-pressed Neem Oil (10,000 PPM) at 5ml/Liter + Sour Butter Milk solution every 7 days.
                  </p>
                </div>
                <div className="bg-emerald-950 p-3 rounded-xl border border-emerald-800">
                  <span className="font-bold text-amber-300 block mb-1">🧪 Targeted Emergency Cure:</span>
                  <p className="text-slate-300">
                    Apply Copper Oxychloride 50% WP @ 2.5g/L water along with Streptocycline 1g per 10 Liters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profit-calculator':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-950/80 p-4 rounded-2xl border border-emerald-700/60">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-emerald-200">
                  <span>Farm Land Area:</span>
                  <span className="text-amber-300">{calcAcres} Acres</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={calcAcres}
                  onChange={(e) => setCalcAcres(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-emerald-200">
                  <span>Expected Yield / Acre:</span>
                  <span className="text-amber-300">{calcYield} Quintals</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={calcYield}
                  onChange={(e) => setCalcYield(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-emerald-200">
                  <span>Expected Mandi Rate:</span>
                  <span className="text-amber-300">₹{calcPrice} / Qtl</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="100"
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-emerald-200">
                  <span>Input & Labor Cost / Acre:</span>
                  <span className="text-amber-300">₹{calcCostPerAcre} / Acre</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="1000"
                  value={calcCostPerAcre}
                  onChange={(e) => setCalcCostPerAcre(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-emerald-950 p-4 rounded-2xl border border-emerald-800">
                <span className="text-xs text-slate-400 font-semibold block">Total Expected Revenue</span>
                <span className="text-xl font-extrabold text-white">₹{totalRevenue.toLocaleString()}</span>
              </div>
              <div className="bg-emerald-950 p-4 rounded-2xl border border-emerald-800">
                <span className="text-xs text-slate-400 font-semibold block">Total Estimated Expenses</span>
                <span className="text-xl font-extrabold text-rose-400">₹{totalExpenses.toLocaleString()}</span>
              </div>
              <div className="bg-emerald-900/90 p-4 rounded-2xl border border-emerald-500/50">
                <span className="text-xs text-amber-300 font-bold block">Estimated Net Profit</span>
                <span className="text-2xl font-black text-[#82c419]">₹{netProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );

      case 'government-schemes':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/30">Direct Cash Benefit</span>
                <span className="text-xs text-emerald-300 font-bold">100% Subsidized</span>
              </div>
              <h5 className="text-base font-bold text-white">PM-KISAN Samman Nidhi Yojna</h5>
              <p className="text-xs text-slate-300">₹6,000 per year directly transferred to bank account in 3 equal installments of ₹2,000 for small and marginal farmers.</p>
            </div>

            <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/30">Crop Loss Insurance</span>
                <span className="text-xs text-emerald-300 font-bold">Low 1.5% Premium</span>
              </div>
              <h5 className="text-base font-bold text-white">Pradhan Mantri Fasal Bima Yojana (PMFBY)</h5>
              <p className="text-xs text-slate-300">Comprehensive risk coverage against drought, flood, hailstorms, and post-harvest unseasonal rain damages.</p>
            </div>

            <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/30">Solar Pump Subsidy</span>
                <span className="text-xs text-emerald-300 font-bold">Up to 60% Govt Subsidy</span>
              </div>
              <h5 className="text-base font-bold text-white">PM-KUSUM Solar Agriculture Pumps</h5>
              <p className="text-xs text-slate-300">Install off-grid solar water pumps for continuous day irrigation without electricity bills.</p>
            </div>
          </div>
        );

      case 'human-expertise':
        return (
          <div className="space-y-4">
            {/* Video Consultation Thumbnail matching requested element */}
            <div className="p-4 bg-emerald-950/90 rounded-2xl border border-amber-400/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1">
                  <Video className="w-3.5 h-3.5" />
                  <span>Live Expert Video Advisory</span>
                </span>
                <h5 className="text-sm font-bold text-white">Watch Fresh Product & Farm Consultation Video</h5>
                <p className="text-xs text-slate-300">
                  See how our agronomists perform live field diagnostics and virtual crop advice sessions.
                </p>
              </div>

              {/* Video Thumbnail with Play Button */}
              <div
                onClick={onOpenVideoModal}
                className="relative w-full sm:w-36 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-500/50 group cursor-pointer shrink-0 bg-amber-500/10"
              >
                <img
                  src={IMAGES.humanExpertise}
                  alt="Fresh product video thumbnail"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-amber-500/20 group-hover:bg-amber-500/10 transition" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#168038] hover:bg-[#136e30] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition border border-white/20">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-800/60 flex items-center space-x-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Expert" className="w-12 h-12 rounded-full object-cover border-2 border-amber-400" />
                <div>
                  <h5 className="text-sm font-bold text-white">Dr. Aris Thorne, PhD</h5>
                  <span className="text-xs text-emerald-300 block">Senior Soil Microbiologist</span>
                  <span className="text-[11px] text-amber-300 font-semibold">14+ Yrs Exp • 4.9 ★</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-800/60 flex items-center space-x-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Expert" className="w-12 h-12 rounded-full object-cover border-2 border-amber-400" />
                <div>
                  <h5 className="text-sm font-bold text-white">Prof. Rajesh Sharma</h5>
                  <span className="text-xs text-emerald-300 block">Plant Pathology Expert</span>
                  <span className="text-[11px] text-amber-300 font-semibold">18+ Yrs Exp • 5.0 ★</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'emergency-alerts':
        return (
          <div className="space-y-4">
            {/* State & City Selector */}
            <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-700/60 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-300 mb-1.5 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Select State</span>
                  </label>
                  <select
                    value={weatherState}
                    onChange={(e) => { setWeatherState(e.target.value); setWeatherCity(''); }}
                    className="w-full bg-emerald-900/60 border border-emerald-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                  >
                    <option value="">— Choose State —</option>
                    {weatherStates.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-300 mb-1.5 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Select City</span>
                  </label>
                  <select
                    value={weatherCity}
                    onChange={(e) => setWeatherCity(e.target.value)}
                    className="w-full bg-emerald-900/60 border border-emerald-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                    disabled={!weatherState}
                  >
                    <option value="">{weatherState ? '— Choose City —' : '— Select State First —'}</option>
                    {(weatherCityMap[weatherState] || []).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              {(!weatherState || !weatherCity) && (
                <p className="text-xs text-emerald-400/70 text-center italic flex items-center justify-center space-x-1">
                  <Info className="w-3 h-3" />
                  <span>Select State and City to see live weather & farming alerts</span>
                </p>
              )}
            </div>

            {/* Loading */}
            {weatherLoading && (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                <p className="text-sm text-emerald-200 animate-pulse">Fetching live weather from Open-Meteo...</p>
              </div>
            )}

            {/* Error */}
            {weatherError && !weatherLoading && (
              <div className="p-4 bg-rose-950/50 rounded-2xl border border-rose-700/50 text-center space-y-2">
                <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto" />
                <p className="text-sm text-rose-200">{weatherError}</p>
              </div>
            )}

            {/* Weather Data Display */}
            {weatherData && !weatherLoading && (
              <>
                {/* Current Weather Card */}
                <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-800/60">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                        {weatherCity}, {weatherState} — Live Weather
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-3xl">{weatherData.current.weatherIcon}</span>
                        <span className="text-3xl font-black text-white">{weatherData.current.temperature}°C</span>
                        <span className="text-sm text-slate-300 ml-2">{weatherData.current.weatherDesc}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{weatherData.source}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-emerald-900/50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Feels Like</span>
                      <span className="text-sm font-bold text-amber-300">{weatherData.current.feelsLike}°C</span>
                    </div>
                    <div className="bg-emerald-900/50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Humidity</span>
                      <span className="text-sm font-bold text-sky-300">{weatherData.current.humidity}%</span>
                    </div>
                    <div className="bg-emerald-900/50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Wind</span>
                      <span className="text-sm font-bold text-emerald-300">{weatherData.current.windSpeed} km/h</span>
                    </div>
                    <div className="bg-emerald-900/50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Rain</span>
                      <span className="text-sm font-bold text-sky-400">{weatherData.current.rain} mm</span>
                    </div>
                  </div>
                </div>

                {/* 3-Day Forecast */}
                {weatherData.forecast && weatherData.forecast.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {weatherData.forecast.map((day: any, i: number) => (
                      <div key={i} className="p-3 bg-emerald-950/60 rounded-2xl border border-emerald-800/40 text-center space-y-1">
                        <span className="text-[10px] text-emerald-300 font-bold uppercase">{day.date}</span>
                        <div className="text-xl">{day.weatherIcon}</div>
                        <div className="text-xs text-white font-bold">{day.maxTemp}° / {day.minTemp}°</div>
                        <div className="text-[10px] text-slate-400">{day.precipitation} mm rain</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Farm Alerts Based on Weather */}
                {weatherData.farmAlerts && weatherData.farmAlerts.map((alert: any, i: number) => (
                  <div key={i} className={`p-4 rounded-2xl border space-y-1 ${
                    alert.level === 'HIGH'
                      ? 'bg-rose-950/60 border-rose-600/60'
                      : alert.level === 'MEDIUM'
                      ? 'bg-amber-950/60 border-amber-600/60'
                      : 'bg-emerald-950/60 border-emerald-600/60'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={`flex items-center space-x-1 ${
                        alert.level === 'HIGH' ? 'text-rose-300' : alert.level === 'MEDIUM' ? 'text-amber-300' : 'text-emerald-300'
                      }`}>
                        {alert.level === 'HIGH' ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : alert.level === 'MEDIUM' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        <span>{alert.level} ALERT — {alert.type.replace(/_/g, ' ')}</span>
                      </span>
                      <span className={alert.level === 'HIGH' ? 'text-rose-300' : alert.level === 'MEDIUM' ? 'text-amber-300' : 'text-emerald-300'}>
                        {alert.level === 'LOW' ? 'All Clear' : 'Active Now'}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white">{alert.title}</h5>
                    <p className={`text-xs ${
                      alert.level === 'HIGH' ? 'text-rose-200/90' : alert.level === 'MEDIUM' ? 'text-amber-200/90' : 'text-emerald-200/90'
                    }`}>{alert.advice}</p>
                  </div>
                ))}
              </>
            )}

            {/* Instant SMS Alert Signup */}
            <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-800 space-y-2">
              <h5 className="text-xs font-bold text-emerald-300">Subscribe to Free Instant SMS Emergency Bulletins:</h5>
              {alertSubmitted ? (
                <div className="p-2.5 bg-emerald-900/80 rounded-xl text-xs text-emerald-200 text-center font-bold flex items-center justify-center space-x-1.5">
                  <Check className="w-4 h-4 text-[#82c419]" />
                  <span>Subscribed! Emergency SMS alerts will be sent to your mobile.</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (phoneAlert.trim()) setAlertSubmitted(true);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="tel"
                    required
                    value={phoneAlert}
                    onChange={(e) => setPhoneAlert(e.target.value)}
                    placeholder="Enter mobile number..."
                    className="flex-1 bg-emerald-900/60 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button type="submit" className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition">
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e2913] text-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-700/50 max-h-[90vh] flex flex-col">
        
        {/* Header Image */}
        <div className="relative h-52 sm:h-60 w-full shrink-0">
          <img
            src={service.image}
            alt={service.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e2913] via-transparent to-black/40" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition border border-white/20 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-3 py-1 bg-[#82c419] text-[#0e2913] text-xs font-bold rounded-full mb-2 inline-block">
              {service.tag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {service.title}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {requested ? (
            <div className="py-12 text-center space-y-3 bg-emerald-900/40 rounded-2xl border border-emerald-600/50 p-6">
              <Sparkles className="w-12 h-12 text-amber-300 mx-auto animate-bounce" />
              <h4 className="text-2xl font-bold text-white">Request Received!</h4>
              <p className="text-sm text-emerald-200">
                An agronomist or service advisor will contact you shortly regarding {service.title}.
              </p>
            </div>
          ) : (
            <>
              <div>
                <h4 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-2">
                  Program & Service Overview
                </h4>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {service.fullDetails?.overview || service.description}
                </p>
              </div>

              {/* Render Specialized Interactive Tool if available */}
              {renderInteractiveTool()}

              {service.fullDetails?.features && (
                <div>
                  <h4 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-3">
                    Key Features & Coverage
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-200">
                    {service.fullDetails.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center space-x-2 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/40">
                        <CheckCircle2 className="w-4 h-4 text-[#82c419] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Consultation / Assessment Form */}
              <form onSubmit={handleBook} className="pt-4 border-t border-emerald-800/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-amber-300" />
                    <span>Request Expert Advisory</span>
                  </h4>
                  <span className="text-xs text-amber-300 font-bold bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
                    {service.fullDetails?.pricing || 'Free Tool'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name / Farm Name"
                    className="w-full bg-emerald-950/80 border border-emerald-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-emerald-400/60 focus:outline-none focus:border-amber-400"
                  />
                  <select
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    className="w-full bg-emerald-950/80 border border-emerald-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="1-10 acres">1 - 10 Acres</option>
                    <option value="10-50 acres">10 - 50 Acres</option>
                    <option value="50-200 acres">50 - 200 Acres</option>
                    <option value="200+ acres">200+ Commercial Acres</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#168038] hover:bg-[#136e30] text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

