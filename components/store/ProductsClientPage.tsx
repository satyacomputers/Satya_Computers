'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/store/ProductCard';
import type { Product } from '@/data/products';
import { Filter, X, ArrowRight, Table } from 'lucide-react';

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

  // Advanced Specs Filters
  const [selectedProcessor, setSelectedProcessor] = useState<string | null>(null);
  const [selectedRam, setSelectedRam] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);

  // Comparison State
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<Product[]>([]);

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

  // Compute Spec Counts
  const processorCounts = useMemo(() => {
    return products.reduce((acc, p) => {
      const proc = p.specs.processor.split(' ')[0]; // Group by i5, i7, etc.
      acc[proc] = (acc[proc] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const processors = useMemo(() => Object.entries(processorCounts).sort((a, b) => b[1] - a[1]), [processorCounts]);

  const ramCounts = useMemo(() => {
    return products.reduce((acc, p) => {
      acc[p.specs.ram] = (acc[p.specs.ram] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const rams = useMemo(() => Object.entries(ramCounts).sort((a, b) => parseInt(a[0]) - parseInt(b[0])), [ramCounts]);

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

    // Specs Filters
    if (selectedProcessor) {
      result = result.filter(p => p.specs.processor.startsWith(selectedProcessor));
    }
    if (selectedRam) {
      result = result.filter(p => p.specs.ram === selectedRam);
    }
    if (selectedStorage) {
      result = result.filter(p => p.specs.storage.includes(selectedStorage));
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
    selectedProcessor || selectedRam || selectedStorage ||
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
             {selectedProcessor && (
               <button onClick={() => setSelectedProcessor(null)} className="border border-black px-2 py-1 font-heading text-[10px] flex items-center gap-2 hover:bg-[var(--color-brand-primary)] hover:text-white hover:border-transparent rounded">
                  CPU: {selectedProcessor} <span>×</span>
               </button>
             )}
             {selectedRam && (
               <button onClick={() => setSelectedRam(null)} className="border border-black px-2 py-1 font-heading text-[10px] flex items-center gap-2 hover:bg-[var(--color-brand-primary)] hover:text-white hover:border-transparent rounded">
                  RAM: {selectedRam} <span>×</span>
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

            {/* Processor Filter */}
            <div className="space-y-4 pt-4 border-t border-black/5">
              <h4 className="font-heading text-sm tracking-[0.2em] text-black uppercase">ARCHITECTURE</h4>
              <div className="flex flex-wrap gap-2">
                {processors.map(([proc, count]) => (
                  <button
                    key={proc}
                    onClick={() => setSelectedProcessor(selectedProcessor === proc ? null : proc)}
                    className={`px-3 py-1.5 font-heading text-[10px] tracking-widest transition-all border uppercase ${
                      selectedProcessor === proc 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-brand-text border-black/10 hover:border-black shadow-sm'
                    }`}
                  >
                    {proc} <span className="opacity-40 ml-1">{count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* RAM Filter */}
            <div className="space-y-4 pt-4 border-t border-black/5">
              <h4 className="font-heading text-sm tracking-[0.2em] text-black uppercase">MEMORY</h4>
              <div className="flex flex-wrap gap-2">
                {rams.map(([ram, count]) => (
                  <button
                    key={ram}
                    onClick={() => setSelectedRam(selectedRam === ram ? null : ram)}
                    className={`px-3 py-1.5 font-heading text-[10px] tracking-widest transition-all border uppercase ${
                      selectedRam === ram 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-brand-text border-black/10 hover:border-black shadow-sm'
                    }`}
                  >
                    {ram} <span className="opacity-40 ml-1">{count}</span>
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
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isComparing={compareList.some(p => p.id === product.id)}
                  onCompareToggle={() => {
                    if (compareList.some(p => p.id === product.id)) {
                      setCompareList(compareList.filter(p => p.id !== product.id));
                    } else if (compareList.length < 4) {
                      setCompareList([...compareList, product]);
                    } else {
                      alert("Maximum 4 products can be compared at once.");
                    }
                  }}
                />
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

      {/* Comparison Tray */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[100] bg-black text-white p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex-shrink-0">
                   <p className="font-heading text-xs tracking-widest text-[#F97316]">COMPARISON MODULE</p>
                   <p className="font-body text-[10px] text-white/50">{compareList.length}/4 Selected</p>
                </div>
                <div className="flex gap-3">
                   {compareList.map(p => (
                     <div key={p.id} className="relative group/tray bg-white/10 p-1 flex items-center gap-2 border border-white/5 min-w-[120px]">
                       <img src={p.image} className="w-8 h-8 object-contain bg-white/10" alt="" />
                       <span className="font-heading text-[9px] tracking-wider truncate max-w-[80px]">{p.name}</span>
                       <button 
                         onClick={() => setCompareList(compareList.filter(x => x.id !== p.id))}
                         title={`Remove ${p.name} from comparison`}
                         aria-label={`Remove ${p.name} from comparison`}
                         className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/tray:opacity-100 transition-opacity"
                       >
                         <X size={8} />
                       </button>
                     </div>
                   ))}
                   {compareList.length < 4 && (
                     <div className="border border-dashed border-white/20 p-1 flex items-center justify-center min-w-[120px] text-white/20 font-heading text-[8px] uppercase tracking-widest">
                       Add to Compare
                     </div>
                   )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCompareList([])}
                  className="font-heading text-[10px] tracking-widest text-white/40 hover:text-white uppercase transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setCompareMode(true)}
                  disabled={compareList.length < 2}
                  className={`flex items-center gap-2 px-6 py-2 font-heading text-xs tracking-widest uppercase transition-all ${compareList.length < 2 ? 'bg-white/10 text-white/20 cursor-not-allowed' : 'bg-[#F97316] text-white hover:bg-[#EA580C] hover:scale-105 active:scale-95'}`}
                >
                  Launch Comparison <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal Overlay */}
      <AnimatePresence>
        {compareMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl p-4 md:p-8 flex items-center justify-center"
          >
             <div className="bg-white w-full max-w-6xl h-full max-h-[85vh] overflow-hidden flex flex-col relative border-4 border-black">
               {/* Header */}
               <div className="bg-black text-white p-6 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <Table className="text-[#F97316]" size={24} />
                   <h2 className="font-heading text-3xl tracking-tighter uppercase">TECHNICAL COMPARISON MATRIX</h2>
                 </div>
                 <button 
                   onClick={() => setCompareMode(false)}
                   title="Close comparison matrix"
                   aria-label="Close comparison matrix"
                   className="hover:rotate-90 transition-transform p-1"
                 >
                   <X size={32} />
                 </button>
               </div>

               {/* Content */}
               <div className="flex-1 overflow-auto p-6">
                 <div className="grid grid-cols-5 gap-0 border-t border-l border-black/10">
                   {/* Labels Column */}
                   <div className="col-span-1 bg-gray-50 border-r border-b border-black/10 p-4 pt-[180px] space-y-12">
                     <div className="font-heading text-xs tracking-[0.2em] text-black/40 uppercase">ARCHITECTURE</div>
                     <div className="font-heading text-xs tracking-[0.2em] text-black/40 uppercase">MEMORY_POOL</div>
                     <div className="font-heading text-xs tracking-[0.2em] text-black/40 uppercase">DATA_STORAGE</div>
                     <div className="font-heading text-xs tracking-[0.2em] text-black/40 uppercase">VISUAL_UNIT</div>
                     <div className="font-heading text-xs tracking-[0.2em] text-black/40 uppercase">MARKET_COST</div>
                   </div>

                   {/* Products Columns */}
                   {compareList.map(p => (
                     <div key={p.id} className="col-span-1 border-r border-b border-black/10 flex flex-col">
                       {/* Image & Name */}
                       <div className="p-4 text-center border-b border-black/5 h-[180px] flex flex-col items-center justify-center bg-white">
                         <img src={p.image} className="h-24 object-contain mb-4" alt="" />
                         <h4 className="font-heading text-sm text-black uppercase tracking-wider line-clamp-1">{p.name}</h4>
                       </div>
                       
                       {/* Specs */}
                       <div className="p-4 h-[65px] flex items-center justify-center text-center border-b border-black/5">
                         <span className="font-body text-xs font-bold text-black uppercase">{p.specs.processor}</span>
                       </div>
                       <div className="p-4 h-[65px] flex items-center justify-center text-center border-b border-black/5">
                         <span className="font-body text-xs font-bold text-black uppercase">{p.specs.ram}</span>
                       </div>
                       <div className="p-4 h-[65px] flex items-center justify-center text-center border-b border-black/5">
                         <span className="font-body text-xs font-bold text-black uppercase">{p.specs.storage}</span>
                       </div>
                       <div className="p-4 h-[65px] flex items-center justify-center text-center border-b border-black/5">
                         <span className="font-body text-xs font-bold text-black uppercase">{p.specs.screen}</span>
                       </div>
                       <div className="p-4 h-[65px] flex flex-col items-center justify-center text-center bg-gray-50 border-b border-black/5">
                         <span className="font-body text-lg font-black text-[#F97316]">₹{p.price.toLocaleString('en-IN')}</span>
                       </div>
                       
                       <div className="p-4 h-[65px] flex items-center justify-center">
                         <Link 
                           href={`/products/${p.slug}`}
                           className="bg-black text-white px-4 py-2 font-heading text-[10px] tracking-widest uppercase hover:bg-[#F97316] transition-colors w-full text-center"
                         >
                           View Specs
                         </Link>
                       </div>
                     </div>
                   ))}
                   
                   {/* Fill empty slots */}
                   {[...Array(4 - compareList.length)].map((_, i) => (
                     <div key={i} className="col-span-1 border-r border-b border-black/10 bg-gray-200/20 flex flex-col" />
                   ))}
                 </div>
               </div>

               <div className="p-6 bg-gray-50 border-t border-black text-right">
                 <p className="font-body text-[11px] text-black/40 italic">Technical parameters verified by Satya Computers Q&A Lab.</p>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
