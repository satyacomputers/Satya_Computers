import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function main() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "CustomerOrder" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "orderId" TEXT NOT NULL,
      "customerName" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "address" TEXT NOT NULL,
      "city" TEXT,
      "state" TEXT,
      "pincode" TEXT,
      "products" TEXT NOT NULL,
      "totalAmount" REAL NOT NULL,
      "paymentMethod" TEXT NOT NULL,
      "paymentStatus" TEXT NOT NULL DEFAULT 'Pending',
      "orderStatus" TEXT NOT NULL DEFAULT 'Processing',
      "notes" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  await client.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS "CustomerOrder_orderId_key" ON "CustomerOrder"("orderId");
  `);
  
  console.log("Successfully created CustomerOrder table and index");
}

main().catch(console.error);
