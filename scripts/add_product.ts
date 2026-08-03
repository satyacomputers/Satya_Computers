import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

async function main() {
  const name = "HP PRODESK 260 G3 tiny cpu";
  const brand = "HP";
  const processor = "Intel Core i5 7th Generation";
  const ram = "8GB";
  const storage = "256GB SSD";
  const price = 13500;
  const stock = 200;
  
  // Calculate math based on user rule: Price = base + 18%gst + 900
  // Reverse: base = (price - 900) / 1.18
  const basePrice = Math.round((price - 900) / 1.18);
  const mrp = price + 2000;
  
  const id = "hp-prodesk-260-g3-" + Math.random().toString(36).substring(7);

  try {
    await client.execute({
      sql: `INSERT INTO Product (id, name, brand, category, processor, ram, storage, price, basePrice, mrp, stock, stockStatus, description, isFeatured, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        name,
        brand,
        "CPU",
        processor,
        ram,
        storage,
        price,
        basePrice,
        mrp,
        stock,
        "In Stock",
        "Compact enterprise-grade tiny CPU. HP ProDesk 260 G3 with powerful 7th Gen i5 performance.",
        true,
        new Date().toISOString(),
        new Date().toISOString()
      ]
    });
    console.log("Product added successfully:", id);
  } catch (error) {
    console.error("Error adding product:", error);
  } finally {
    process.exit();
  }
}

main();
