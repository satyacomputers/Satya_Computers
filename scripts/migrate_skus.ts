import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

async function main() {
  console.log("Starting Professional SKU Migration...");

  try {
    const result = await client.execute("SELECT id, brand FROM Product");
    const products = result.rows;

    for (const product of products) {
      const oldId = product.id as string;
      const brand = (product.brand as string) || "GEN";
      
      // Check if already migrated
      if (oldId.startsWith("SC-")) {
        console.log(`Skipping already migrated ID: ${oldId}`);
        continue;
      }

      const brandPrefix = brand.substring(0, 3).toUpperCase();
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newId = `SC-${brandPrefix}-${randomPart}`;

      console.log(`Migrating: ${oldId} -> ${newId}`);

      // Update the ID
      // CAUTION: In enterprise, you'd update foreign keys. 
      // For this system, we'll update the Product table primary key.
      await client.execute({
        sql: "UPDATE Product SET id = ? WHERE id = ?",
        args: [newId, oldId]
      });
    }

    console.log("Migration Successful!");
  } catch (error) {
    console.error("Migration Failed:", error);
  } finally {
    process.exit();
  }
}

main();
