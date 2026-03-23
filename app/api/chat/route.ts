import { NextResponse } from "next/server";
import prisma, { libsql as client } from "@/lib/prisma";
import { storeInfo } from "@/data/store-info";

// FETCH CONTEXT DATA (Terms, Policies, Store Info)
const POLICIES_CONTEXT = `
TERMS & POLICIES SUMMARY:
- PRIVACY: Committed to safeguarding personal info. Consent to collection/use as per Privacy Policy.
- ACCOUNTS: Must be 18+. Responsible for credentials. Notify immediately for unauthorized access.
- PRODUCTS: Accuracy aimed for, but descriptions/images not guaranteed always error-free. Right to correct inaccuracies without notice.
- USE: Products for personal/professional use only; NO RESALE for commercial purposes.
- PRICING: Right to cancel orders for pricing errors. Refunds provided. Prices/Availability subject to change.

STORE DETAILS:
- Name: ${storeInfo.name}
- Email: ${storeInfo.email}
- Phone: +91 ${storeInfo.phone}
- WhatsApp: +91 ${storeInfo.phone}
- Address: ${storeInfo.address}
- Mission: ${storeInfo.mission}
- Services: ${storeInfo.services.join(", ")}
`;

async function getSystemPrompt() {
  // Fetch products from database
  let productsSummary = "";
  
  // 1. Read from CSV (Source of Truth)
  try {
    const fs = require('fs');
    const path = require('path');
    const csvPath = path.join(process.cwd(), 'public', 'products', 'products.csv');
    if (fs.existsSync(csvPath)) {
      const csvData = fs.readFileSync(csvPath, 'utf8');
      const lines = csvData.split('\n').filter((line: string) => line.trim() !== '');
      const csvProducts = lines.slice(1).map((line: string, index: number) => {
        const parts = line.split(',');
        if (parts.length < 8) return null;
        const id = parts[0].trim(); // Using S.No from CSV as ID
        return `- [PRODUCT_ID:${id}] ${parts[1]} (${parts[2]}): ${parts[3]} RAM, ${parts[4]} Storage, ₹${parts[7].trim()}.`;
      }).filter(Boolean).join('\n');
      
      if (csvProducts) {
        productsSummary += "OFFICIAL WEBSITE STOCK (USE THESE IDs):\n" + csvProducts + "\n\n";
      }
    }
  } catch (err) {
    console.error("Error reading products.csv:", err);
  }

  // 2. Database Sync
  try {
    const dbProducts = await prisma.product.findMany({
        take: 30, 
        orderBy: { updatedAt: 'desc' }
    });
    
    if (dbProducts.length > 0) {
      productsSummary += "LIVE INVENTORY (DB):\n" + dbProducts.map(p => 
        `- [PRODUCT_ID:${p.id}] ${p.name} (${p.brand}): ${p.processor}, ₹${p.price}.`
      ).join("\n");
    }
  } catch (error) {
    console.error("Error fetching products from DB for chat:", error);
  }

  if (!productsSummary) {
    productsSummary = "General business IT services. Contact sales for availability.";
  }

  return `
You are the Official AI Sales Assistant for ${storeInfo.name}. 

${POLICIES_CONTEXT}

AVAILABLE PRODUCTS:
${productsSummary}

CRITICAL INSTRUCTIONS:
1. TAGGING: For EVERY product you mention or recommend, you MUST append its ID in brackets at the end of the sentence like this: [PX:id] 
   - Use PX followed by the PRODUCT_ID from the list above. Example: "The HP EliteBook [PX:24] is perfect for you."
2. ACCURACY: Only recommend products from the list above. If a user asks for Dell, list the Dell models and their IDs.
3. CONCISENESS: No need to list all specs if you mention IDs; the system will show rich cards.
4. OUT OF SCOPE: Decline off-topic questions.

RESPONSE FORMAT:
- Focus on professional advice.
- Always include the [PX:id] tags so the user sees interactive product cards.
`;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ text: "No messages provided." }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in environment variables.");
    }

    const systemPrompt = await getSystemPrompt();
    
    // Convert history to REST API format
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // HYBRID FALLBACK STRATEGY: 
    // 1. Try Gemini 2.5 Flash (User has 5 RPM quota)
    // 2. Try Gemini 1.5 Flash (Standard fallback)
    // 3. Try Gemini 2.0 Flash 
    // 4. If still fails, use a "Smart Static Fallback" based on context.

    const MODELS = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];
    let lastError: any = null;
    let finalOutput = "";

    for (const modelName of MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              maxOutputTokens: 2048,
              temperature: 0.1,
              topP: 0.95,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          finalOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (finalOutput) break; // Success!
        } else {
          lastError = await response.json();
          console.warn(`Model ${modelName} failed with status ${response.status}. Trying next...`);
          // Continue loop to next model if it's a rate limit or "not found"
          if (response.status !== 429 && response.status !== 404 && response.status !== 503) {
            break; // Stop for other fatal errors (like 400 Bad Request)
          }
        }
      } catch (err) {
        lastError = err;
        console.error(`Fetch error with ${modelName}:`, err);
      }
    }

    if (finalOutput) {
       // --- DYNAMIC PRODUCT RESOLUTION ---
       const productMatches = finalOutput.match(/\[PX:([^\]]+)\]/g) || [];
       const productIds = Array.from(new Set(productMatches.map(m => m.replace('[PX:', '').replace(']', ''))));
       
       let resolvedProducts: any[] = [];
       
       if (productIds.length > 0) {
         try {
           // 1. Fetch from DB
           const result = await client.execute({
             sql: 'SELECT * FROM "Product" WHERE id IN ('+ productIds.map(() => '?').join(',') +')',
             args: productIds
           });
           
           resolvedProducts = result.rows.map((p: any) => ({
             id: p.id,
             name: p.name,
             price: `₹${Number(p.price).toLocaleString()}`,
             image: p.image || '/products/dell_laptop_premium.png',
             link: `/products/${p.id}`
           }));

           // 2. Supplement from CSV if some are missing
           if (resolvedProducts.length < productIds.length) {
               const fs = require('fs');
               const path = require('path');
               const csvPath = path.join(process.cwd(), 'public', 'products', 'products.csv');
               if (fs.existsSync(csvPath)) {
                   const csvData = fs.readFileSync(csvPath, 'utf8');
                   const lines = csvData.split('\n').filter((l: string) => l.trim() !== '');
                   productIds.forEach(id => {
                       const row = lines.find((l: string) => l.startsWith(id + ','));
                       if (row && !resolvedProducts.find(rp => rp.id === id)) {
                           const parts = row.split(',');
                           resolvedProducts.push({
                               id: id,
                               name: parts[1],
                               price: `₹${parts[7].trim()}`,
                               shortSpecs: parts[2],
                               image: '/products/dell_laptop_premium.png',
                               link: `/products/${id}`
                           });
                       }
                   });
               }
           }
         } catch (err) {
           console.error("Error resolving products for chat:", err);
         }
       }

       return NextResponse.json({ 
         text: finalOutput.replace(/\[PX:[^\]]+\]/g, '').trim(), 
         products: resolvedProducts 
       });
    }

    // STATIC FALLBACK: If all AI models fail, provide a smart information-rich response.
    // This uses the current system prompt context to build a manual response.
    const staticMessage = `
I'm currently moving through some technical traffic, but I can still help you! 

I'm the AI Sales Assistant for **${storeInfo.name}**. 
We specialize in bulk laptops (Dell, HP, Lenovo, Asus, Apple) for businesses and individuals across India.

**Quick Info for you:**
- **Location:** ${storeInfo.address}
- **Bulk Inquiry:** You can WhatsApp us at +91 ${storeInfo.phone} for the best pricing on 10+ units.
- **Inventory:** We have a wide range of Workstations and Business Laptops in stock.
- **Shipping:** Pan-India delivery available within 3-7 days.

Is there a specific model (like an HP EliteBook or Dell Latitude) you're looking for? Feel free to contact us at **${storeInfo.email}** or call **+91 ${storeInfo.phone}** for an immediate quote!
`;

    return NextResponse.json({ text: staticMessage.trim() });

  } catch (error: any) {
    console.error("Critical Chat API Error:", error);
    return NextResponse.json({ 
        text: "I'm having a little trouble connecting to my brain right now. Please reach out to our team at " + storeInfo.email + " or call +91 " + storeInfo.phone + " for immediate assistance! 🙏" 
    }, { status: 200 });
  }
}


