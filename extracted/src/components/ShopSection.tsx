import React, { useState } from 'react';
import { Search, ShoppingBag, Star, Plus, Check, Filter } from 'lucide-react';
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
    <section className="py-16 sm:py-20 bg-slate-100 text-[#0e2913] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-emerald-800/30 bg-emerald-200/50 text-[#0e2913] font-medium text-xs sm:text-sm mb-3">
            <ShoppingBag className="w-4 h-4 text-emerald-800" />
            <span>Farm Fresh Marketplace</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0e2913] tracking-tight mb-4">
            Direct Farm-to-Table Organic Store
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Order 100% certified organic vegetables, raw A2 pasture milk, and bio-active soil formulas harvested fresh daily.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          
          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            {['all', 'vegetables', 'dairy', 'soil', 'fruits'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-[#168038] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search produce, soil, milk..."
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
                className="bg-white rounded-3xl p-4 shadow-md hover:shadow-xl transition border border-slate-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#0e2913]/80 backdrop-blur-md text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#0e2913] mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-[#168038]">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">
                      / {product.unit}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdd(product)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                      isAnimating || isAdded
                        ? 'bg-emerald-700 text-white shadow-md'
                        : 'bg-[#168038] hover:bg-[#136e30] text-white shadow-sm'
                    }`}
                  >
                    {isAnimating ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added!</span>
                      </>
                    ) : isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
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
