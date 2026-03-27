'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Save, 
  X,
  Upload,
  Info,
  Loader2,
  Database,
  Cpu,
  Layers,
  Plus,
  Copy,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddProduct() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    brand: 'Dell',
    price: '',
    description: '',
    processor: '',
    ram: '8GB',
    storage: '256GB SSD',
    display: '',
    image: '',
    gallery: [] as string[],
    bulkPrice5_10: '',
    bulkPrice11_25: '',
    bulkPrice26Plus: '',
    stockStatus: 'In Stock',
    stock: 0,
    isFeatured: false,
    minOrderQty: 1
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setFormData(prev => ({ ...prev, image: data.url }));
      setImagePreview(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formData.gallery.length + files.length > 10) {
      setError('Maximum 10 images allowed in gallery');
      return;
    }

    setGalleryUploading(true);
    setError('');

    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) continue;

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        const data = await res.json();
        if (res.ok) {
          newImages.push(data.url);
        }
      }

      setFormData(prev => ({ 
        ...prev, 
        gallery: [...prev.gallery, ...newImages] 
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to initialize product record');
      }

      alert('Asset Successfully Initialized in Registry');
      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/products"
            title="Return to Inventory Ledger"
            className="w-14 h-14 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-white hover:text-[#F97316] hover:shadow-xl hover:shadow-orange-950/5 transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-black text-[#0A1628] uppercase tracking-tighter">PROVISION <span className="text-gray-300">/ ASSET</span></h1>
            <p className="text-gray-500 font-medium">Initializing new technical hardware record into the global registry.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-8 py-4 rounded-2xl border border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 hover:text-red-500 transition-all active:scale-95"
          >
            ABORT SESSION
          </button>
          <button 
            form="product-form"
            type="submit"
            disabled={loading}
            title="Commit changes to database"
            className="px-8 py-4 rounded-2xl bg-[#0A1628] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#F97316] shadow-xl shadow-navy-900/10 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {loading ? 'SYNCHRONIZING...' : 'COMMIT PROVISION'}
          </button>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100 flex items-center gap-4 text-xs font-black uppercase tracking-widest"
        >
           <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <X size={20} />
           </div>
           {error}
        </motion.div>
      )}

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
               <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F97316]">
                  <Database size={24} />
               </div>
               <h3 className="font-heading font-black text-xl uppercase tracking-tight text-[#0A1628]">Asset nomenclature</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Hardware Identity *</label>
                <input 
                  id="name"
                  name="name"
                  type="text" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dell Latitude 5540 Professional"
                  className="w-full px-6 py-4 rounded-[1.5rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all font-bold text-[#0A1628] shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label htmlFor="brand" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">OEM / Manufacturer *</label>
                  <select 
                    id="brand"
                    name="brand"
                    title="Select OEM Manufacturer"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-[1.5rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all font-black text-sm text-[#0A1628] shadow-inner"
                  >
                    <option value="Dell">Dell (Corporate)</option>
                    <option value="HP">HP (Enterprise)</option>
                    <option value="Lenovo">Lenovo (ThinkLine)</option>
                    <option value="Asus">Asus (ROG/TUF)</option>
                    <option value="Acer">Acer (Nitro/Swift)</option>
                    <option value="Apple">Apple (Silicon)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="price" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Market Valuation (₹) *</label>
                  <input 
                    id="price"
                    name="price"
                    type="number" 
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="25000"
                    className="w-full px-6 py-4 rounded-[1.5rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all font-black text-sm text-[#0A1628] shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Technical Specification Dossier</label>
                <textarea 
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the asset architecture, cooling performance, and multi-threaded capabilities..."
                  className="w-full px-6 py-4 rounded-[2rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all resize-none font-medium text-sm leading-relaxed text-[#0A1628] shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
               <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Cpu size={24} />
               </div>
               <h3 className="font-heading font-black text-xl uppercase tracking-tight text-[#0A1628]">Infrastructure configuration</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="processor" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 ml-1">Logic Processor (CPU) *</label>
                <input 
                  id="processor"
                  name="processor"
                  type="text" 
                  value={formData.processor}
                  onChange={handleChange}
                  placeholder="e.g. Intel Core i9-13980HX" 
                  className="w-full px-6 py-4 rounded-[1.5rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all font-bold text-[#0A1628] shadow-inner" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="ram" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 ml-1">Memory Buffer (RAM) *</label>
                <select 
                  id="ram"
                  name="ram"
                  title="RAM Capacity Selection"
                  value={formData.ram}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-[1.5rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all font-black text-sm text-[#0A1628] shadow-inner"
                >
                  <option value="8GB">8GB DDR5X</option>
                  <option value="16GB">16GB DDR5X</option>
                  <option value="32GB">32GB DDR5X</option>
                  <option value="64GB">64GB DDR5X</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="storage" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 ml-1">Persistent Storage (SSD) *</label>
                <select 
                  id="storage"
                  name="storage"
                  title="Storage Capacity Selection"
                  value={formData.storage}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-[1.5rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all font-black text-sm text-[#0A1628] shadow-inner"
                >
                  <option value="256GB SSD">256GB NVMe G4</option>
                  <option value="512GB SSD">512GB NVMe G4</option>
                  <option value="1TB SSD">1TB NVMe G4</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="display" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 ml-1">Visual Matrix (Panel)</label>
                <input 
                  id="display"
                  name="display"
                  type="text" 
                  value={formData.display}
                  onChange={handleChange}
                  placeholder="e.g. 16:10 4K OLED 120Hz" 
                  className="w-full px-6 py-4 rounded-[1.5rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all font-bold text-[#0A1628] shadow-inner" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Upload size={24} />
               </div>
               <h3 className="font-heading font-black text-xl uppercase tracking-tight text-[#0A1628]">Asset Gallery Portfolio</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {formData.gallery.map((img, idx) => (
                <div key={idx} className="relative group aspect-square rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-[8px] font-black text-white uppercase tracking-widest truncate">{img.split('/').pop()}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        type="button"
                        title="Copy Asset URL"
                        onClick={() => {
                          navigator.clipboard.writeText(img);
                          alert('Asset URL copied to clipboard for description use.');
                        }}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-md text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        type="button"
                        title="Remove Image"
                        onClick={() => removeGalleryImage(idx)}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-md text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                  </div>
                </div>
              ))}
              {formData.gallery.length < 10 && (
                <div 
                  onClick={() => document.getElementById('gallery-upload')?.click()}
                  className="aspect-square rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-[#F97316] hover:bg-orange-50/30 transition-all text-gray-400 hover:text-[#F97316]"
                >
                  {galleryUploading ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                  <span className="text-[10px] font-black uppercase tracking-widest mt-2">{galleryUploading ? 'Uploading...' : 'Add Image'}</span>
                  <input 
                    id="gallery-upload"
                    type="file" 
                    multiple
                    title="Gallery Images"
                    className="hidden" 
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    disabled={galleryUploading}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#0A1628] p-10 rounded-[3.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
            <h3 className="font-heading font-black text-lg uppercase tracking-widest text-white relative z-10">Asset visual protocol</h3>
            <div 
              onClick={() => document.getElementById('image-upload')?.click()}
              className="aspect-square rounded-[2.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center group/uploader hover:border-[#F97316] transition-all cursor-pointer relative overflow-hidden bg-white/5 z-10"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-[2rem]" />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/uploader:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <p className="text-white font-black text-[10px] tracking-widest uppercase">Modify provisioned visual</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-[1.5rem] bg-white text-[#0A1628] flex items-center justify-center group-hover/uploader:bg-[#F97316] group-hover/uploader:text-white transition-all mb-6 shadow-2xl">
                    {uploading ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
                  </div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">{uploading ? 'TRANSMITTING...' : 'Upload Asset Frame'}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-2">Maximum Payload: 5MB</p>
                </>
              )}
              <input 
                id="image-upload"
                type="file" 
                title="Product Image Input"
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </div>
            
            <div className="relative z-10 space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <Info size={14} className="text-gray-400" />
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Or Use Remote Identity Link</p>
                </div>
                <input 
                  type="text"
                  name="image"
                  placeholder="https://example.com/image.png"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, image: e.target.value }));
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-6 py-4 rounded-[1.5rem] border border-white/10 bg-white/5 text-white outline-none focus:border-[#F97316] transition-all text-xs font-medium"
                />
            </div>
            {/* Aesthetic Glow */}
            <div className="absolute top-0 right-0 p-12 opacity-10 blur-[80px] pointer-events-none">
               <div className="w-48 h-48 rounded-full bg-[#F97316]" />
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                 <Layers size={24} />
              </div>
              <h3 className="font-heading font-black text-lg uppercase tracking-tight text-[#0A1628]">Logic & Lifecycle</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="stockStatus" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Availability Directive</label>
                <select 
                  id="stockStatus"
                  name="stockStatus"
                  title="Operational Availability Directive"
                  value={formData.stockStatus}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-[1.5rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all font-black text-sm text-[#0A1628] shadow-inner"
                >
                  <option value="In Stock">In Stock (Active)</option>
                  <option value="Out of Stock">Out of Stock (Depleted)</option>
                  <option value="Coming Soon">Coming Soon (Provisioning)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="stock" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 ml-1">Current Stock Inventory *</label>
                <input 
                  id="stock"
                  name="stock"
                  type="number" 
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-6 py-4 rounded-[1.5rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all font-bold text-[#0A1628] shadow-inner" 
                />
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100 group hover:border-[#F97316]/20 transition-all">
                <div>
                  <p className="text-xs font-black text-[#0A1628] uppercase tracking-widest">Featured directive</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Direct to Global Showcase</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    name="isFeatured"
                    title="Toggle Featured Status"
                    type="checkbox" 
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="sr-only peer" 
                  />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#F97316]"></div>
                </label>
              </div>

              <div className="space-y-2">
                <label htmlFor="minOrderQty" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 ml-1">Minimum Order Multiplier (MOQ)</label>
                <input 
                  id="minOrderQty"
                  name="minOrderQty"
                  type="number" 
                  value={formData.minOrderQty}
                  onChange={handleChange}
                  placeholder="1"
                  className="w-full px-6 py-4 rounded-[1.5rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all font-bold text-[#0A1628] shadow-inner" 
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
