import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug, getRecommendedProducts, enrichProduct, type Product } from '@/data/products';
import GrainOverlay from '@/components/ui/GrainOverlay';
import ProductImageGallery from '@/components/store/ProductImageGallery';
import ProductCard from '@/components/store/ProductCard';
import { libsql as client } from '@/lib/prisma';
import AddToCartButton from '@/components/store/AddToCartButton';
import BuyNowButton from '@/components/store/BuyNowButton';
import TrustBadges from '@/components/store/TrustBadges';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 1. Fetch static fallback
  let staticRaw = getProductBySlug(slug);
  let raw: any = staticRaw;
  
  // 2. Fetch and merge DB data (DB takes precedence so admin updates work!)
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM "Product" WHERE id = ? LIMIT 1',
      args: [slug]
    });
    
    if (result.rows.length > 0) {
      const row: any = result.rows[0];
      const dbImage = (row.image && (row.image.startsWith('/') || row.image.startsWith('http') || row.image.startsWith('data:'))) 
        ? row.image 
        : (row.image ? `/uploads/${row.image}` : null);

      raw = {
        ...staticRaw, // keep static fallbacks (like highlights)
        id: row.id,
        name: row.name,
        slug: row.id,
        brand: row.brand,
        price: row.price,
        originalPrice: staticRaw && staticRaw.originalPrice ? staticRaw.originalPrice : row.price * 1.2,
        image: dbImage || (staticRaw ? staticRaw.image : '/products/dell_laptop_premium.png'),
        description: row.description || (staticRaw ? staticRaw.description : 'Professional workstation optimized for enterprise performance.'),
        badge: row.isFeatured ? 'HOT' : (staticRaw ? staticRaw.badge : undefined),
        stock: row.stock ?? 0,
        stockStatus: row.stockStatus || 'In Stock',
        specs: {
          ...(staticRaw ? staticRaw.specs : {}),
          processor: row.processor || (staticRaw ? staticRaw.specs.processor : 'Intel Core i5'),
          ram: row.ram || (staticRaw ? staticRaw.specs.ram : '8GB'),
          storage: row.storage || (staticRaw ? staticRaw.specs.storage : '256GB SSD'),
          screen: row.display || (staticRaw ? staticRaw.specs.screen : '14" FHD')
        }
      };

      // Merge image gallery: Prioritize the 'gallery' array from DB
      if (row.gallery) {
        try {
          const parsedGallery = JSON.parse(row.gallery);
          if (Array.isArray(parsedGallery) && parsedGallery.length > 0) {
            raw.images = parsedGallery;
          } else if (dbImage) {
            raw.images = [dbImage];
          } else if (staticRaw?.images && staticRaw.images.length > 0) {
            raw.images = staticRaw.images;
          }
        } catch (e) {
          console.error('Gallery parse error:', e);
          if (dbImage) {
            raw.images = [dbImage];
          } else if (staticRaw?.images && staticRaw.images.length > 0) {
            raw.images = staticRaw.images;
          }
        }
      } else if (dbImage) {
        raw.images = [dbImage];
      } else if (staticRaw?.images && staticRaw.images.length > 0) {
        raw.images = staticRaw.images;
      }
      
      // Safety layer
      if (!raw.images || raw.images.length === 0) {
        raw.images = [raw.image || '/products/dell_laptop_premium.png'];
      }
    }
  } catch (e) {
    console.error('DB Product Fetch Error:', e);
  }

  if (!raw) notFound();

  const product = enrichProduct(raw);
  
  // Fetch recommended products from DB
  let recommended: Product[] = [];
  try {
    const recResult = await client.execute({
      sql: 'SELECT * FROM "Product" WHERE id != ? AND (brand = ? OR category = ?) AND stock > 0 LIMIT 4',
      args: [raw.id, raw.brand, raw.category]
    });
    recommended = recResult.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.id,
      brand: row.brand,
      category: row.category,
      price: row.price,
      originalPrice: row.price * 1.2,
      image: (row.image && (row.image.startsWith('/') || row.image.startsWith('http') || row.image.startsWith('data:'))) 
        ? row.image 
        : (row.image ? `/uploads/${row.image}` : '/products/dell_laptop_premium.png'),
      description: row.description || 'Professional workstation optimized for enterprise performance.',
      badge: row.isFeatured ? 'HOT' : undefined,
      stock: row.stock ?? 0,
      stockStatus: row.stockStatus || 'In Stock',
      specs: {
        processor: row.processor || 'Intel Core i5',
        ram: row.ram || '8GB',
        storage: row.storage || '256GB SSD',
        screen: row.display || '14" FHD'
      }
    }));
  } catch (e) {
    console.error('Failed to fetch recommended products:', e);
    recommended = getRecommendedProducts(raw, 4); // Fallback
  }

  const savings = product.originalPrice - product.price;
  const savingsPct = Math.round((savings / product.originalPrice) * 100);

  return (
    <main className="min-h-screen bg-white relative pb-24">
      <GrainOverlay opacity={15} />

      {/* ── BREADCRUMB ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        <nav className="flex items-center gap-2 text-xs font-body text-brand-text/40 mb-8">
          <Link href="/" className="hover:text-[var(--color-brand-primary)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[var(--color-brand-primary)] transition-colors">Products</Link>
          <span>/</span>
          <span className="text-brand-text/70 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* ── PRODUCT HERO ── */}
        <div className="flex flex-col lg:flex-row gap-14 mb-20">

          {/* Image Gallery */}
          <div className="w-full lg:w-1/2">
            <ProductImageGallery 
              images={product.images} 
              name={product.name} 
              badge={product.badge} 
            />
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {/* Brand */}
            <p className="font-heading text-sm text-[var(--color-brand-primary)] tracking-[0.2em] mb-2 uppercase">
              {product.brand}
              {product.category && (
                <span className="ml-3 text-brand-text/30">· {product.category}</span>
              )}
            </p>

            <h1 className="font-heading text-4xl md:text-5xl text-brand-text leading-tight mb-6 uppercase">
              {product.name}
            </h1>

            {/* Price row */}
            <div className="flex items-end gap-4 mb-2">
              <span className="font-body text-4xl text-[var(--color-brand-primary)] font-semibold">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {savings > 0 && (
                <span className="font-body text-xl text-brand-text/35 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-sm font-body text-green-600 mb-6">
                You save ₹{savings.toLocaleString('en-IN')} ({savingsPct}% off)
              </p>
            )}
            
            {/* Stock status display */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-heading tracking-widest uppercase border ${
                product.stockStatus === 'In Stock' 
                  ? 'bg-green-50 border-green-200 text-green-600' 
                  : (product.stockStatus === 'Waitlist' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-red-50 border-red-200 text-red-600')
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  product.stockStatus === 'In Stock' ? 'bg-green-500' : (product.stockStatus === 'Waitlist' ? 'bg-amber-500' : 'bg-red-500')
                }`} />
                {product.stockStatus}
              </div>
              {product.stock && product.stock > 0 && (
                <span className="text-xs font-body text-brand-text/45">
                  ({product.stock} units available)
                </span>
              )}
            </div>

            {/* Short description */}
            <p className="font-body text-base text-brand-text/70 mb-8 leading-relaxed border-b border-black/8 pb-8">
              {product.description}
            </p>

            {/* Key specs grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-8">
              {[
                { label: 'PROCESSOR', value: product.specs.processor },
                { label: 'MEMORY', value: product.specs.ram },
                { label: 'STORAGE', value: product.specs.storage },
                { label: 'DISPLAY', value: product.specs.screen },
                ...(product.specs.gpu ? [{ label: 'GRAPHICS', value: product.specs.gpu }] : []),
                ...(product.specs.battery ? [{ label: 'BATTERY', value: product.specs.battery }] : []),
                ...(product.specs.weight ? [{ label: 'WEIGHT', value: product.specs.weight }] : []),
                ...(product.specs.os ? [{ label: 'OS', value: product.specs.os }] : []),
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-heading text-[10px] tracking-[0.2em] text-[var(--color-brand-primary)] mb-1">{label}</p>
                  <p className="font-body text-sm text-brand-text">{value}</p>
                </div>
              ))}
            </div>

            {/* Highlights */}
            {product.highlights.length > 0 && (
              <ul className="space-y-2 mb-8">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-sm text-brand-text/70">
                    <span className="text-[var(--color-brand-primary)] mt-0.5 flex-shrink-0">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 border-t border-black/8 pt-6 mt-auto">
              <AddToCartButton product={raw} />
              <BuyNowButton product={raw} />
            </div>

            {/* Trust badges */}
            <TrustBadges />
          </div>
        </div>

        {/* ── DETAILED DESCRIPTION + FULL SPEC TABLE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 border-t border-black/8 pt-16 mb-20">

          {/* Long description */}
          <div className="lg:col-span-3">
            <h2 className="font-heading text-3xl text-brand-text mb-6 uppercase">
              About this <span className="text-[var(--color-brand-primary)]">Product</span>
            </h2>
            <p className="font-body text-brand-text/70 leading-relaxed text-base whitespace-pre-line">
              {product.longDescription}
            </p>

            {/* Why buy at Satya Computers */}
            <div className="mt-10 border border-[var(--color-brand-primary)]/20 bg-[#FFFDF9] p-6">
              <h3 className="font-heading text-lg text-brand-text mb-3 uppercase tracking-wider">
                Why buy from Satya Computers?
              </h3>
              <ul className="space-y-2 font-body text-sm text-brand-text/70">
                <li>✓ Walk-in store at Ameerpet, Hyderabad — try before you buy</li>
                <li>✓ Every refurbished unit is cleaned, tested &amp; graded</li>
                <li>✓ EMI available on select products</li>
                <li>✓ In-store repair &amp; IT support services</li>
                <li>✓ WhatsApp support — get answers instantly</li>
              </ul>
            </div>
          </div>

          {/* Full spec table */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-3xl text-brand-text mb-6 uppercase">
              Full <span className="text-[var(--color-brand-primary)]">Specifications</span>
            </h2>
            <table className="w-full font-body text-sm border-collapse">
              <tbody>
                {[
                  { label: 'Brand', value: product.brand },
                  { label: 'Processor', value: product.specs.processor },
                  { label: 'RAM', value: product.specs.ram },
                  { label: 'Storage', value: product.specs.storage },
                  { label: 'Display', value: product.specs.screen },
                  ...(product.specs.gpu ? [{ label: 'GPU', value: product.specs.gpu }] : []),
                  ...(product.specs.battery ? [{ label: 'Battery', value: product.specs.battery }] : []),
                  ...(product.specs.weight ? [{ label: 'Weight', value: product.specs.weight }] : []),
                  ...(product.specs.os ? [{ label: 'Operating System', value: product.specs.os }] : []),
                  ...(product.specs.ports ? [{ label: 'Ports', value: product.specs.ports }] : []),
                  ...(product.specs.camera ? [{ label: 'Camera', value: product.specs.camera }] : []),
                  { label: 'Condition', value: product.badge === 'SALE' ? 'Certified Refurbished' : 'Refurbished laptop' },
                  { label: 'Warranty', value: '6 Months (Satya Computers)' },
                ].map(({ label, value }, i) => (
                  <tr key={label} className={i % 2 === 0 ? 'bg-[#F7F7F5]' : 'bg-white'}>
                    <td className="px-4 py-3 text-brand-text/50 font-medium w-[45%]">{label}</td>
                    <td className="px-4 py-3 text-brand-text">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── RECOMMENDED PRODUCTS ── */}
        {recommended.length > 0 && (
          <section className="border-t border-black/8 pt-16">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-heading text-3xl text-brand-text uppercase">
                You may also <span className="text-[var(--color-brand-primary)]">like</span>
              </h2>
              <Link
                href="/products"
                className="font-heading text-xs tracking-widest text-[var(--color-brand-primary)] hover:underline"
              >
                VIEW ALL →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommended.map((rec) => {
                // Ensure recommended products have access to the unified card component
                return (
                  <div key={rec.id} className="w-full">
                    <ProductCard product={rec} />
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
