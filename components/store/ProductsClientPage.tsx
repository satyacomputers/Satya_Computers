'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/store/ProductCard';
import type { Product } from '@/data/products';
import { Filter } from 'lucide-react';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const SliderTrack = ({ min, max, val0, val1 }: { min: number; max: number; val0: number; val1: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      if (max === min) {
        ref.current.style.left = '0%';
        ref.current.style.right = '0%';
        return;
      }
      ref.current.style.left = `${((val0 - min) / (max - min)) * 100}%`;
      ref.current.style.right = `${100 - ((val1 - min) / (max - min)) * 100}%`;
    }
  }, [min, max, val0, val1]);
  
  return <div ref={ref} className="absolute h-full bg-[var(--color-brand-primary)] transition-all duration-300" />;
};

interface ProductsClientPageProps {
  products: Product[];
}

export default function ProductsClientPage({ products }: ProductsClientPageProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize from search params
  useEffect(() => {
    setMounted(true);
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    
    const brand = searchParams.get('brand');
    if (brand) setSelectedBrand(brand);

    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Compute price bounds from all products
  const priceBounds = useMemo(() => {
    const prices = products.map(p => p.price);
    if (prices.length === 0) return { min: 0, max: 1000000 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  // Initialize price range on mount
  useEffect(() => {
    setPriceRange([priceBounds.min, priceBounds.max]);
  }, [priceBounds]);

  // Compute brand counts from ALL products (not filtered)
  const brandCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const brands = useMemo(() => {
    return Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);
  }, [brandCounts]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      const cat = product.category || 'other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const categories = useMemo(() => {
    return Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  }, [categoryCounts]);

  // Compute badge counts
  const badgeCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      if (product.badge) {
        acc[product.badge] = (acc[product.badge] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const badges = useMemo(() => {
    return Object.entries(badgeCounts).sort((a, b) => b[1] - a[1]);
  }, [badgeCounts]);

  // Filter + sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.specs.processor.toLowerCase().includes(q) ||
        p.specs.ram.toLowerCase().includes(q) ||
        p.specs.storage.toLowerCase().includes(q) ||
        p.specs.screen.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (selectedBrand) {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Badge filter
    if (selectedBadge) {
      result = result.filter(p => p.badge === selectedBadge);
    }

    // Price range filter
    if (priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max) {
      result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    }

    // Sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, selectedBrand, selectedCategory, selectedBadge, sortOption, priceRange, priceBounds]);

  // Search suggestions (shown when focused & typing)
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase().trim();
    return products
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchQuery, products]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedBrand(null);
    setSelectedCategory(null);
    setSelectedBadge(null);
    setSortOption('featured');
    setPriceRange([priceBounds.min, priceBounds.max]);
  };

  const hasActiveFilters = searchQuery || selectedBrand || selectedBadge || 
    priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max;

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  if (!mounted) return <></>;

  return (
    <>
      {/* Search Bar / Top Controls - Bulletproof FIXED styling for "No Movement" experience */}
      <div className="fixed-search-wrapper z-[90] bg-white border-b border-black/10 shadow-sm pt-4 pb-4">
        <style dangerouslySetInnerHTML={{__html: `
          .fixed-search-wrapper { position: fixed; top: 140px; left: 0; right: 0; }
          @media (min-width: 768px) { .fixed-search-wrapper { top: 124px; } }
          .sticky-configurator { position: sticky; top: 204px; }
        `}} />
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            {/* Search Input */}
            <div className={`relative flex-1 flex items-center bg-white border-2 transition-all duration-300 shadow-sm ${
              isSearchFocused 
                ? 'border-[var(--color-brand-primary)] shadow-[0_0_0_4px_rgba(var(--color-brand-primary-rgb,209,88,0),0.1)]' 
                : 'border-black/10 hover:border-black/20'
            }`}>
              {/* Search Icon */}
              <div className="pl-5 pr-2 text-brand-text-muted">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <input
                ref={searchInputRef}
                id="product-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search laptops by name, brand, specs..."
                className="flex-1 py-3 px-3 font-body text-sm md:text-base text-brand-text placeholder:text-brand-text-muted/60 focus:outline-none bg-transparent"
                aria-label="Search products"
                suppressHydrationWarning
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                  className="px-4 text-brand-text-muted hover:text-brand-text transition-colors"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter / Sort Right Side */}
            <div className="flex items-center justify-between lg:justify-end gap-3 flex-wrap lg:flex-nowrap">
              <div className="flex flex-col hidden sm:flex">
                <span className="font-body text-xs text-brand-text/50 uppercase tracking-wider">
                  Found <strong className="text-[var(--color-brand-primary)] font-bold">{filteredProducts.length}</strong> modules
                </span>
              </div>
              
              <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <span className="hidden sm:inline font-heading text-xs tracking-widest text-black/40 uppercase">ORDER BY:</span>
                <select
                  aria-label="Sort products"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  suppressHydrationWarning
                  className="bg-white border-2 border-black text-brand-text py-2.5 px-3 focus:outline-none focus:bg-black focus:text-white transition-all font-heading text-[10px] sm:text-xs uppercase tracking-widest cursor-pointer flex-1 sm:flex-none min-w-[140px]"
                >
                  <option value="featured">RANK: FEATURED</option>
                  <option value="price-asc">COST: ASC</option>
                  <option value="price-desc">COST: DESC</option>
                  <option value="name-asc">A - Z</option>
                  <option value="name-desc">Z - A</option>
                </select>
                <button 
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  aria-label="Toggle filters"
                  className={`md:hidden p-2.5 border-2 transition-colors flex items-center justify-center ${mobileFiltersOpen ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-gray-50'}`}
                >
                  <Filter size={18} />
                </button>
              </div>
            </div>
            
            {/* Search Suggestions Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-auto lg:w-[400px] mt-2 bg-white border border-black/10 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-black/5">
                  <span className="font-body text-xs text-brand-text-muted tracking-wider uppercase">Quick Results</span>
                </div>
                {searchSuggestions.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-black/5 last:border-none group"
                  >
                    <div className="w-12 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm text-brand-text group-hover:text-[var(--color-brand-primary)] transition-colors truncate">{product.name}</p>
                      <p className="font-body text-xs text-brand-text-muted">{product.brand} · {product.specs.processor}</p>
                    </div>
                    <span className="font-body text-sm font-semibold text-[var(--color-brand-primary)] flex-shrink-0">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Spacer to prevent product grid from sliding under the FIXED search bar */}
      <div className="h-[140px] md:h-[84px]" aria-hidden="true" />

        {/* Search results count when searching (Active Filters Strip) */}
      {(hasActiveFilters || sortOption !== 'featured') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="flex flex-wrap items-center gap-2 py-2">
             <span className="font-heading text-[10px] tracking-widest text-brand-text-muted">ACTIVE FILTERS:</span>
             {searchQuery && (
               <button onClick={() => setSearchQuery('')} className="bg-black text-white px-2 py-1 font-heading text-[10px] flex items-center gap-2 hover:bg-[var(--color-brand-primary)] rounded">
                 SEARCH: {searchQuery} <span>×</span>
               </button>
             )}
             {selectedBrand && (
               <button onClick={() => setSelectedBrand(null)} className="border border-black px-2 py-1 font-heading text-[10px] flex items-center gap-2 hover:bg-[var(--color-brand-primary)] hover:text-white hover:border-transparent rounded">
                 BRAND: {selectedBrand} <span>×</span>
               </button>
             )}
             {selectedBadge && (
               <button onClick={() => setSelectedBadge(null)} className="border border-black px-2 py-1 font-heading text-[10px] flex items-center gap-2 hover:bg-[var(--color-brand-primary)] hover:text-white hover:border-transparent rounded">
                 STATUS: {selectedBadge} <span>×</span>
               </button>
             )}
             {selectedCategory && (
               <button onClick={() => setSelectedCategory(null)} className="border border-black px-2 py-1 font-heading text-[10px] flex items-center gap-2 hover:bg-[var(--color-brand-primary)] hover:text-white hover:border-transparent rounded">
                 CLASS: {selectedCategory} <span>×</span>
               </button>
             )}
             {(priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max) && (
               <button onClick={() => setPriceRange([priceBounds.min, priceBounds.max])} className="border border-black px-2 py-1 font-heading text-[10px] flex items-center gap-2 hover:bg-[var(--color-brand-primary)] hover:text-white hover:border-transparent rounded">
                 PRICE: {formatPrice(priceRange[0])}-{formatPrice(priceRange[1])} <span>×</span>
               </button>
             )}
             <button onClick={clearAllFilters} className="font-heading text-[10px] text-[var(--color-brand-primary)] ml-auto hover:underline uppercase tracking-widest">
               RESET ALL
             </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-10 relative z-10">
        
        {/* Sidebar Filters - Technical Card Style */}
        <aside className={`w-full md:w-72 flex-shrink-0 ${mobileFiltersOpen ? 'block mb-8' : 'hidden md:block'}`}>
          <div 
            className="sticky-configurator bg-white border-2 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,0.05)] space-y-10 group/sidebar transition-shadow hover:shadow-[12px_12px_0_rgba(0,0,0,0.08)] overflow-y-auto custom-scrollbar z-30"
          >
            
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-heading text-2xl tracking-widest text-[#1a1a1a]">CONFIGURATOR</h3>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-black/10"></div>
              </div>
            </div>

            {/* Brands Filter */}
            <div className="space-y-4">
              <h4 className="font-heading text-sm tracking-[0.2em] text-black uppercase">Select Brand</h4>
              <div className="flex flex-col gap-1 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {brands.map(([brand, count]) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                    className={`flex items-center justify-between px-3 py-2.5 font-heading text-sm transition-all border ${
                      selectedBrand === brand 
                      ? 'bg-black text-white border-black scale-[1.02] shadow-lg translate-x-1' 
                      : 'bg-white text-brand-text border-black/5 hover:border-black/20 hover:bg-gray-50'
                    }`}
                  >
                    <span className="tracking-widest uppercase">{brand}</span>
                    <span className={`text-[10px] ${selectedBrand === brand ? 'text-white/50' : 'text-black/30'}`}>{count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-4 pt-4 border-t border-black/5">
              <h4 className="font-heading text-sm tracking-[0.2em] text-black uppercase">MODULE TYPE</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(([cat, count]) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`px-3 py-1.5 font-heading text-[10px] tracking-widest transition-all border uppercase ${
                      selectedCategory === cat 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-brand-text border-black/10 hover:border-black shadow-sm'
                    }`}
                  >
                    {cat} <span className="opacity-40 ml-1">{count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Labels Filter */}
            <div className="space-y-4 pt-4 border-t border-black/5">
              <h4 className="font-heading text-sm tracking-[0.2em] text-black">AVAILABILITY</h4>
              <div className="grid grid-cols-2 gap-2">
                {badges.map(([badge, count]) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedBadge(selectedBadge === badge ? null : badge);
                    }}
                    className={`px-3 py-2 font-heading text-xs tracking-widest transition-all border ${
                      selectedBadge === badge 
                      ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]' 
                      : 'bg-white text-brand-text border-black/10 hover:border-black'
                    }`}
                  >
                    {badge} <span className="opacity-40 ml-1">{count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range - More robust UI */}
            <div className="space-y-6 pt-4 border-t border-black/5">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-sm tracking-[0.2em] text-black uppercase">Market Range</h4>
                <span className="font-body text-[10px] text-black/40">INR</span>
              </div>
              
              <div className="space-y-8 px-1">
                <div className="relative pt-1">
                   <div className="flex items-center justify-between font-heading text-[11px] mb-4">
                      <div className="bg-black text-white px-2 py-0.5">{formatPrice(priceRange[0])}</div>
                      <div className="bg-black text-white px-2 py-0.5">{formatPrice(priceRange[1])}</div>
                   </div>
                   
                   {/* Dual Slider Simulation using multiple ranges */}
                   <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
                      <SliderTrack min={priceBounds.min} max={priceBounds.max} val0={priceRange[0]} val1={priceRange[1]} />
                   </div>

                   <div className="space-y-4">
                     <div className="flex flex-col gap-1">
                       <span className="font-heading text-[8px] tracking-widest text-black/40 uppercase">MIN LIMIT</span>
                       <input
                        type="range"
                        min={priceBounds.min}
                        max={priceBounds.max}
                        step={1000}
                        value={priceRange[0]}
                        onChange={(e) => {
                          const val = Math.max(priceBounds.min, Math.min(Number(e.target.value), priceRange[1] - 5000));
                          setPriceRange([val, priceRange[1]]);
                        }}
                        suppressHydrationWarning
                        className="w-full accent-black cursor-pointer"
                        aria-label="Min price"
                      />
                     </div>
                     <div className="flex flex-col gap-1">
                       <span className="font-heading text-[8px] tracking-widest text-black/40 uppercase">MAX LIMIT</span>
                       <input
                        type="range"
                        min={priceBounds.min}
                        max={priceBounds.max}
                        step={1000}
                        value={priceRange[1]}
                        onChange={(e) => {
                          const val = Math.min(priceBounds.max, Math.max(Number(e.target.value), priceRange[0] + 5000));
                          setPriceRange([priceRange[0], val]);
                        }}
                        suppressHydrationWarning
                        className="w-full accent-black cursor-pointer"
                        aria-label="Max price"
                      />
                     </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-auto">
               <div className="bg-gray-50 border border-black/5 p-3 font-body text-[10px] text-brand-text/40 leading-relaxed italic">
                 Configuring high-performance Refurbished Workstations since 2012. Ameerpet, HYD.
               </div>
            </div>

          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-h-[80vh]">
          {/* Mobile found stats inline with grid if needed */}
          <div className="mb-6 sm:hidden">
             <span className="font-body text-xs text-brand-text/50 uppercase tracking-wider">
               Found <strong className="text-[var(--color-brand-primary)] font-bold">{filteredProducts.length}</strong> modules
             </span>
             <div className="h-0.5 w-8 bg-[var(--color-brand-primary)] mt-1 animate-pulse"></div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-black/10">
              <div className="w-20 h-20 mb-8 opacity-10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              </div>
              <h3 className="font-heading text-4xl text-black/20 mb-4 tracking-tighter uppercase whitespace-nowrap">MODULE NOT FOUND</h3>
              <p className="font-body text-brand-text-muted/60 max-w-sm mb-10 text-sm">
                No matching hardware profile was found for the selected configuration criteria.
              </p>
              <button
                onClick={clearAllFilters}
                className="btn-brutal !h-12 !px-10"
              >
                CLEAR FILTER MATRIX
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
