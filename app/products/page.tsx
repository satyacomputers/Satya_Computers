import GrainOverlay from '@/components/ui/GrainOverlay';
import ProductsClientPage from '@/components/store/ProductsClientPage';
import { Product } from '@/data/products';
import { libsql as client } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  // 1. Get DB products
  let dbProducts: Product[] = [];
  try {
    const result = await client.execute('SELECT * FROM "Product" WHERE stock > 0 AND stockStatus = \'In Stock\' ORDER BY createdAt DESC');
    dbProducts = result.rows.map((row: any) => {
      let parsedImages = undefined;
      if (row.gallery) {
        try {
          const parsed = JSON.parse(row.gallery);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsedImages = parsed;
          }
        } catch (e) {
          // ignore
        }
      }

      return {
        id: row.id,
        name: row.name,
        slug: row.id, // Use ID as slug for DB products
        brand: row.brand,
        category: row.category,
        price: row.price,
        originalPrice: row.price * 1.2, // Mock original price
        image: (row.image && (row.image.startsWith('/') || row.image.startsWith('http') || row.image.startsWith('data:'))) 
          ? row.image 
          : (row.image ? `/uploads/${row.image}` : '/products/dell_laptop_premium.png'),
        images: parsedImages, // Pass along admin gallery images
        description: row.description || 'Professional workstation optimized for enterprise performance.',
        badge: row.isFeatured ? 'NEW' : undefined,
        specs: {
          processor: row.processor || 'Intel Core i5',
          ram: row.ram || '8GB',
          storage: row.storage || '256GB SSD',
          screen: row.display || '14" FHD'
        }
      };
    });
  } catch (error) {
    console.error('Failed to fetch DB products:', error);
  }

  // 3. Remove static products to hide "old images" and only show active DB products
  const allProducts = dbProducts;

  return (
    <main className="min-h-screen bg-white relative">
      <GrainOverlay opacity={10} />


      {/* Search + Filters + Grid (Client Component) */}
      <ProductsClientPage products={allProducts} />
    </main>
  );
}
