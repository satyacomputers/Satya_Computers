'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Laptop,
  ChevronLeft,
  ChevronRight,
  Database,
  Cpu,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const specs = `${p.processor || ''} ${p.ram || ''} ${p.storage || ''} ${p.gpu || ''}`.toLowerCase();
    
    const matchesSearch = 
      p.name?.toLowerCase().includes(searchLower) ||
      p.brand?.toLowerCase().includes(searchLower) ||
      specs.includes(searchLower);
    
    const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
    
    return matchesSearch && matchesBrand;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Abort this asset record? Purge protocol is irreversible.')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
        alert('Asset Purge Successful');
      } else {
        const data = await res.json();
        alert(`Protocol Failure: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network Protocol Interrupted');
    }
  };

  return (
    <div className="space-y-10 p-4 lg:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-heading font-black text-[#0A1628] uppercase tracking-tighter">GLOBAL <span className="text-gray-300">/ INVENTORY</span></h1>
          <p className="text-gray-500 font-medium mt-1">Monitored technical hardware assets and corporate infrastructure units.</p>
        </div>
        <Link 
          href="/admin/products/add"
          title="Administrative Asset Provisioning"
          className="bg-[#0A1628] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-[#F97316] transition-all shadow-xl shadow-navy-900/10 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> ADD PRODUCT
        </Link>
      </div>

      {/* Strategic Filters */}
      <div className="bg-white p-6 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col md:flex-row gap-6 items-stretch md:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F97316] transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Search by identity, specification, or OEM..."
            className="w-full pl-16 pr-8 py-5 rounded-[2rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all text-sm font-bold text-[#0A1628] shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <select 
              title="OEM Filtration Directive"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="appearance-none px-8 pr-14 py-5 rounded-[2rem] border border-transparent bg-gray-50 text-[#0A1628] font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer focus:border-[#F97316] shadow-inner hover:bg-white transition-all min-w-[200px]"
            >
              <option value="All">All OEM Models</option>
              {Array.from(new Set(products.map(p => p.brand))).filter(Boolean).map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Matrix */}
      <div className="bg-white rounded-[3.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden pb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Asset Identity</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Architecture</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Valuation</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Logistics</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Lifecycle</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-14 h-14 border-[5px] border-gray-100 border-t-[#F97316] rounded-full animate-spin" />
                        <p className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-400">Accessing Technical Inventory...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product, idx) => (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50/80 transition-all group"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-[2rem] bg-white border border-gray-100 flex items-center justify-center text-gray-400 overflow-hidden relative shadow-xl shadow-orange-950/5 p-1">
                            {product.image ? (
                              <img 
                                src={product.image.startsWith('/') || product.image.startsWith('http') || product.image.startsWith('data:') ? product.image : `/uploads/${product.image}`} 
                                alt={product.name} 
                                className="w-full h-full object-cover rounded-[1.8rem] group-hover:scale-110 transition-transform duration-700" 
                              />
                            ) : (
                              <Monitor size={32} className="opacity-10" />
                            )}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div>
                            <h4 className="font-heading font-black text-[#0A1628] leading-tight text-lg group-hover:text-[#F97316] transition-colors">{product.name}</h4>
                            <p className="text-[10px] font-black text-[#F97316] tracking-[0.3em] uppercase mt-1 opacity-60 group-hover:opacity-100 transition-opacity">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-1.5">
                           <div className="flex items-center gap-2 text-xs font-black text-[#0A1628] uppercase tracking-tighter opacity-80">
                              <Cpu size={12} className="text-[#F97316]" />
                              {product.processor || 'Standard Specification'}
                           </div>
                           <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-widest">{product.ram || '8GB RAM'}</span>
                              <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-widest">{product.storage || '256GB SSD'}</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                           <span className={`text-xl font-heading font-black ${ (product.stock || 0) > 0 ? 'text-[#0A1628]' : 'text-red-600'}`}>
                             {(product.stock || 0)} UNITS
                           </span>
                           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Available Stock</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center md:text-left">
                        <div className="flex flex-col">
                           <span className="text-2xl font-heading font-black text-[#0A1628]">₹{(product.price || 0).toLocaleString()}</span>
                           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Base Valuation</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                          (product.stockStatus === 'In Stock' || (product.stock && (product.stock as number) > 0)) ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${ (product.stockStatus === 'In Stock' || (product.stock && (product.stock as number) > 0)) ? 'bg-emerald-600' : 'bg-red-600'} animate-pulse`} />
                          { (product.stockStatus === 'In Stock' || (product.stock && (product.stock as number) > 0)) ? 'Active' : 'Depleted'}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            title="Modify Technical Specification"
                            className="w-12 h-12 rounded-2xl bg-white text-gray-400 hover:text-blue-600 border border-transparent hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all flex items-center justify-center active:scale-90 shadow-sm"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            title="Execute Asset Purge Protocol"
                            className="w-12 h-12 rounded-2xl bg-white text-gray-400 hover:text-red-500 border border-transparent hover:border-red-100 hover:shadow-xl hover:shadow-red-500/10 transition-all flex items-center justify-center active:scale-90 shadow-sm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-10 py-32 text-center text-gray-300 uppercase tracking-[0.5em] font-black text-xs">Zero Assets Identified</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Telemetry */}
          <div className="mt-8 flex justify-between items-center px-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
              <Database size={14} className="text-[#F97316]" /> {paginatedProducts.length} Assets Synchronized
            </p>
            <div className="flex gap-4">
              <button 
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(prev => prev - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                title="Rollback Paginated Data"
                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-[#0A1628] hover:border-[#F97316] transition-all disabled:opacity-20 flex items-center justify-center shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2 px-6 rounded-2xl bg-gray-50 text-[10px] font-black text-[#0A1628] uppercase tracking-widest border border-gray-100">
                 Page {currentPage} <span className="text-gray-300">/</span> {totalPages || 1}
              </div>
              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => {
                  setCurrentPage(prev => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                title="Advance Paginated Data"
                className="w-12 h-12 rounded-2xl bg-[#0A1628] text-white hover:bg-[#F97316] transition-all disabled:opacity-20 flex items-center justify-center shadow-xl shadow-navy-950/10"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}
