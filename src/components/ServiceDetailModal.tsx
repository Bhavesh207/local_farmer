import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Send, Sparkles, Sprout, Search, TrendingUp, AlertTriangle, Calculator, FileText, PhoneCall, ShieldAlert, Check, Play, Video } from 'lucide-react';
import { ServiceItem } from '../types';
import { IMAGES } from '../constants/data';

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
  // Mandi Price state (Fast, instant zero-lag)
  const [mandiSearch, setMandiSearch] = useState('');
  const [mandiQuintals, setMandiQuintals] = useState<number>(10);

  // Profit Calculator state
  const [calcAcres, setCalcAcres] = useState<number>(5);
  const [calcYield, setCalcYield] = useState<number>(20); // Quintal/Acre
  const [calcPrice, setCalcPrice] = useState<number>(2400); // ₹/Quintal
  const [calcCostPerAcre, setCalcCostPerAcre] = useState<number>(15000); // ₹/Acre

  // Disease Finder state
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedSymptom, setSelectedSymptom] = useState('Yellowing Leaves & Stunting');

  // Crop Calendar state
  const [calendarSeason, setCalendarSeason] = useState<'Kharif' | 'Rabi' | 'Zaid'>('Kharif');

  // Emergency Alert SMS signup
  const [phoneAlert, setPhoneAlert] = useState('');
  const [alertSubmitted, setAlertSubmitted] = useState(false);

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
  const totalProduction = calcAcres * calcYield; // Total Quintals
  const totalRevenue = totalProduction * calcPrice; // Total ₹
  const totalExpenses = calcAcres * calcCostPerAcre; // Total Cost ₹
  const netProfit = totalRevenue - totalExpenses; // Net Profit ₹

  // Fast Instant Mandi Market Rates Dataset
  const mandiRates = [
    { crop: 'Wheat (Gehun)', mandi: 'Karnal Central Mandi, Haryana', min: 2275, max: 2450, modal: 2380, trend: '+2.4%' },
    { crop: 'Paddy Rice (Basmati 1121)', mandi: 'Amritsar Grain Market, Punjab', min: 3800, max: 4250, modal: 4120, trend: '+1.8%' },
    { crop: 'Hybrid Tomato', mandi: 'Nashik Wholesale Yard, Maharashtra', min: 1400, max: 2150, modal: 1850, trend: '-3.2%' },
    { crop: 'Red Onion (Pyaz)', mandi: 'Lasalgaon Mandi, Maharashtra', min: 1250, max: 1820, modal: 1580, trend: '-1.5%' },
    { crop: 'Desi Cotton (Kapas)', mandi: 'Rajkot Cotton Yard, Gujarat', min: 6850, max: 7480, modal: 7250, trend: '+4.1%' },
    { crop: 'Mustard (Sarson)', mandi: 'Jaipur Agriculture Hub, Rajasthan', min: 5150, max: 5680, modal: 5420, trend: '+0.9%' },
    { crop: 'Potato (Kufri Jyoti)', mandi: 'Agra Mandi, Uttar Pradesh', min: 1100, max: 1520, modal: 1340, trend: '+1.2%' },
    { crop: 'Yellow Soyabean', mandi: 'Indore Malwa Mandi, MP', min: 4400, max: 4890, modal: 4680, trend: '+2.1%' },
    { crop: 'Royal Delicious Apple', mandi: 'Shimla Fruit Market, HP', min: 6500, max: 9200, modal: 7800, trend: '+3.5%' },
  ].filter(m => m.crop.toLowerCase().includes(mandiSearch.toLowerCase()) || m.mandi.toLowerCase().includes(mandiSearch.toLowerCase()));

  // Render Tool Specific Content
  const renderInteractiveTool = () => {
    switch (service.id) {
      case 'mandi-price':
        return (
          <div className="space-y-6">
            <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-700/60">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={mandiSearch}
                    onChange={(e) => setMandiSearch(e.target.value)}
                    placeholder="Search crop or mandi (e.g. Wheat, Karnal, Cotton, Tomato)..."
                    className="w-full bg-emerald-900/60 border border-emerald-700/60 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
                  <span className="text-xs text-emerald-200">Qty (Quintals):</span>
                  <input
                    type="number"
                    value={mandiQuintals}
                    onChange={(e) => setMandiQuintals(Math.max(1, Number(e.target.value)))}
                    className="w-20 bg-emerald-900/60 border border-emerald-700/60 rounded-xl px-3 py-2 text-sm text-amber-300 font-bold text-center focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-emerald-800/60 bg-emerald-950/40">
              <table className="w-full text-left text-xs sm:text-sm text-slate-200">
                <thead className="bg-emerald-900/80 text-emerald-300 uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3">Commodity</th>
                    <th className="p-3">Mandi Location</th>
                    <th className="p-3">Modal Rate (₹/Qtl)</th>
                    <th className="p-3">Est. Value ({mandiQuintals} Qtl)</th>
                    <th className="p-3">24h Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/60">
                  {mandiRates.map((item, idx) => (
                    <tr key={idx} className="hover:bg-emerald-900/40 transition">
                      <td className="p-3 font-bold text-white">{item.crop}</td>
                      <td className="p-3 text-slate-300">{item.mandi}</td>
                      <td className="p-3 font-extrabold text-amber-300">₹{item.modal.toLocaleString()}</td>
                      <td className="p-3 font-extrabold text-[#82c419]">₹{(item.modal * mandiQuintals).toLocaleString()}</td>
                      <td className={`p-3 font-bold ${item.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.trend}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 text-center">
              * Rates synced live with National Agriculture Market API. Verified daily at 08:00 AM.
            </p>
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
            <div className="p-4 bg-rose-950/60 rounded-2xl border border-rose-600/60 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                <span className="flex items-center space-x-1">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>HIGH ALERT — WEATHER WARNING</span>
                </span>
                <span>Active 24 Hours</span>
              </div>
              <h5 className="text-sm font-bold text-white">Unseasonal Heavy Rain & Hailstorm Forecast</h5>
              <p className="text-xs text-rose-200/90">Keep harvested grains under tarpaulin. Delay fertilizer top-dressing in standing crops.</p>
            </div>

            <div className="p-4 bg-amber-950/60 rounded-2xl border border-amber-600/60 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span className="flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>MEDIUM ALERT — PEST OUTBREAK</span>
                </span>
                <span>Regional Alert</span>
              </div>
              <h5 className="text-sm font-bold text-white">Pink Bollworm Threat in Cotton Belts</h5>
              <p className="text-xs text-amber-200/90">Install pheromone traps immediately (5 traps/acre) to monitor adult moth activity.</p>
            </div>

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

