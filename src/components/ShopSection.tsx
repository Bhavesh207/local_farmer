import React, { useState } from 'react';
import { Search, ShoppingBag, Star, Plus, Check, Filter, Sprout, ShieldCheck, Sparkles } from 'lucide-react';
import { PRODUCTS_DATA } from '../constants/data';
import { ProductItem } from '../types';

interface ShopSectionProps {
  onAddToCart: (product: ProductItem) => void;
  cartItemIds: string[];
}

export const ShopSection: React.FC<ShopSectionProps> = ({ onAddToCart, cartItemIds }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'fertilizer', label: '🌿 Bio-Fertilizers' },
    { id: 'pest_control', label: '🛡️ Bio-Pest Control' },
    { id: 'plant_growth', label: '⚡ Growth Boosters' },
    { id: 'soil', label: '🪵 Bio-Soil & Compost' },
    { id: 'seeds', label: '🌱 Seed Starters' },
    { id: 'vegetables', label: '🥕 Fresh Veggies' },
    { id: 'dairy', label: '🥛 Pasture Dairy' },
    { id: 'fruits', label: '🍓 Farm Fruits' },
  ];

  const filteredProducts = PRODUCTS_DATA.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (product: ProductItem) => {
    onAddToCart(product);
    setAddedAnimationId(product.id);
    setTimeout(() => {
      setAddedAnimationId(null);
    }, 1200);
  };

  return (
    <section id="plant-shop-section" className="py-16 sm:py-20 bg-slate-100 text-[#0e2913] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-emerald-800/30 bg-emerald-200/50 text-[#0e2913] font-bold text-xs sm:text-sm mb-3">
            <Sprout className="w-4 h-4 text-emerald-800" />
            <span>Organic Agriculture & Plant Care Store</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0e2913] tracking-tight mb-4">
            Plant Helping Products & Bio-Fertilizers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Explore 100% certified organic plant nutrients, neem oil bio-pesticides, seaweed growth boosters, mycorrhizal root fungi, and bio-compost to naturally double crop and garden yield.
          </p>
        </div>

        {/* Highlight Banner for Plant Helping Products */}
        <div className="mb-10 bg-gradient-to-r from-[#0e2913] via-[#168038] to-[#0e2913] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-700/50">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plant Nutrition Specialist Selection</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Organic Soil & Crop Care Formulas
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Zero toxic chemicals. Certified non-gmo, eco-friendly plant boosters formulated by senior agronomists for high yield and root vitality.
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
              <span className="block text-2xl font-black text-amber-300">100%</span>
              <span className="text-[11px] text-emerald-100 font-semibold uppercase tracking-wider">Organic</span>
            </div>
            <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
              <span className="block text-2xl font-black text-amber-300">Fast</span>
              <span className="text-[11px] text-emerald-100 font-semibold uppercase tracking-wider">Farm Delivery</span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          
          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#168038] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search bio-fertilizers, neem oil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#168038]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isAdded = cartItemIds.includes(product.id);
            const isAnimating = addedAnimationId === product.id;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl transition duration-300 border border-slate-200 flex flex-col justify-between group transform hover:-translate-y-1"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-52 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#0e2913]/90 backdrop-blur-md text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>{product.rating}</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Organic</span>
                    </div>
                  </div>

                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                    {product.category.replace('_', ' ')}
                  </div>

                  <h3 className="text-lg font-extrabold text-[#0e2913] mb-1.5 group-hover:text-[#168038] transition">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-[#168038]">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 ml-1">
                      / {product.unit}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdd(product)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition active:scale-95 ${
                      isAnimating || isAdded
                        ? 'bg-emerald-800 text-amber-300 shadow-md'
                        : 'bg-[#168038] hover:bg-[#136e30] text-white shadow-sm'
                    }`}
                  >
                    {isAnimating ? (
                      <>
                        <Check className="w-4 h-4 text-amber-300" />
                        <span>Added!</span>
                      </>
                    ) : isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-amber-300" />
                        <span>In Cart</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
