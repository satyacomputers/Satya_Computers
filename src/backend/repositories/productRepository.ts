import prisma, { libsql as client } from '@/lib/prisma';

export class ProductRepository {
  /**
   * Fetches the current live inventory for AI analysis.
   */
  public async getInventoryContext(): Promise<string> {
    try {
      const dbProducts = await prisma.product.findMany({ 
        where: { 
          stock: { gt: 0 },
          stockStatus: 'In Stock'
        },
        take: 100, 
        orderBy: { price: 'asc' } 
      });
      
      if (dbProducts.length === 0) return "No products in inventory.";
      
      return dbProducts.map(p =>
        `ID: ${p.id} | Name: ${p.name} | Brand: ${p.brand} | CPU: ${p.processor} | RAM: ${p.ram} | Storage: ${p.storage} | Price: ₹${p.price}`
      ).join("\n");
    } catch (e) {
      return "Inventory unavailable.";
    }
  }

  /**
   * Resolves list of IDs into professional product objects.
   */
  public async resolveProducts(ids: string[]) {
    if (ids.length === 0) return [];
    try {
      const result = await client.execute({
        sql: `SELECT * FROM "Product" WHERE id IN (${ids.map(() => '?').join(',')})`,
        args: ids
      });
      
      return result.rows.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image: p.image || '/products/dell_laptop_premium.png',
        link: `/products/${p.id}`,
        shortSpecs: `${p.processor} | ${p.ram} | ${p.storage}`
      }));
    } catch (e) {
      return [];
    }
  }

  /**
   * Simple heuristic fallback when AI is unavailable.
   */
  public async getKeywordFallback(profession: string, budget: number) {
    try {
      const result = await client.execute({ 
        sql: "SELECT * FROM \"Product\" WHERE stock > 0 AND stockStatus = 'In Stock' ORDER BY price ASC", 
        args: [] 
      });
      
      let products: any[] = result.rows;
      
      // Filter by budget tolerance (up to 20% over)
      products = products.filter((p: any) => Number(p.price) <= budget * 1.2);
      
      // Simple heuristic sorts for profession
      if (['design', 'dev', 'power'].includes(profession)) {
        products.sort((a, b) => Number(b.price) - Number(a.price)); 
      }
      
      return products.slice(-3).reverse().map((p: any) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image: p.image || '/products/dell_laptop_premium.png',
        link: `/products/${p.id}`,
        shortSpecs: `${p.processor} | ${p.ram} | ${p.storage}`
      }));
    } catch (err) {
      return [];
    }
  }
}

export const productRepository = new ProductRepository();
