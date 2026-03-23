import { NextResponse } from "next/server";
import prisma, { libsql as client } from "@/lib/prisma";
import { storeInfo } from "@/data/store-info";

// ── Build compact system prompt ────────────────────────────────────────────
async function getSystemPrompt() {
  let productList = "";
  try {
    const dbProducts = await prisma.product.findMany({ take: 50, orderBy: { price: 'asc' } });
    if (dbProducts.length > 0) {
      productList = dbProducts.map(p =>
        `[PX:${p.id}] ${p.name} | ${p.brand} | ${p.processor} | ${p.ram} | ${p.storage} | ₹${p.price}`
      ).join("\n");
    }
  } catch (e) { /* no-op */ }

  return `You are the AI Sales Assistant for ${storeInfo.name}, a laptop store in Hyderabad.
Contact: +91 ${storeInfo.phone} | ${storeInfo.email}

PRODUCTS (format: [PX:ID] Name | Brand | CPU | RAM | Storage | Price):
${productList || "Contact us for stock."}

RULES:
1. Tag EVERY product you mention with [PX:id] - e.g. "Dell Latitude 7490 [PX:6]"
2. Only recommend products from the list. Use exact IDs.
3. For brand queries (Dell/HP/Lenovo/Apple), list matching models with their [PX:id] tags.
4. Keep responses concise and professional.`;
}

// ── Smart keyword fallback (works without AI) ───────────────────────────────
async function smartFallback(userMessage: string) {
  const msg = userMessage.toLowerCase();
  
  // Determine brand/keyword
  let brandFilter: string | null = null;
  if (msg.includes('dell')) brandFilter = 'Dell';
  else if (msg.includes('lenovo') || msg.includes('thinkpad')) brandFilter = 'Lenovo';
  else if (msg.includes('hp') || msg.includes('elitebook')) brandFilter = 'HP';
  else if (msg.includes('apple') || msg.includes('macbook')) brandFilter = 'Apple';

  // Budget detection
  let maxPrice: number | null = null;
  const budgetMatch = msg.match(/(\d+)[k\s]*(?:thousand|k\b)/i);
  if (budgetMatch) maxPrice = parseInt(budgetMatch[1]) * 1000;
  const priceMatch = msg.match(/(?:under|below|budget|less than)\s*[₹rs]?\s*(\d{4,6})/i);
  if (priceMatch) maxPrice = parseInt(priceMatch[1]);

  try {
    const result = await client.execute({ sql: 'SELECT * FROM "Product" ORDER BY price ASC', args: [] });
    let products: any[] = result.rows;

    if (brandFilter) products = products.filter((p: any) => p.brand === brandFilter);
    if (maxPrice) products = products.filter((p: any) => Number(p.price) <= maxPrice!);

    // General laptop/show all query
    const isGeneralQuery = !brandFilter && !maxPrice && (
      msg.includes('laptop') || msg.includes('show') || msg.includes('available') ||
      msg.includes('stock') || msg.includes('what') || msg.includes('list') || msg.includes('all')
    );

    const matched = isGeneralQuery ? products : (brandFilter || maxPrice ? products : []);
    const displayProducts = matched.slice(0, 6);

    if (displayProducts.length > 0) {
      const brandText = brandFilter ? ` ${brandFilter}` : '';
      const budgetText = maxPrice ? ` under ₹${maxPrice.toLocaleString('en-IN')}` : '';
      const text = `Here are the${brandText} laptops${budgetText} we have in stock:\n\n` +
        displayProducts.map((p: any) =>
          `• **${p.name}** (${p.brand}) — ${p.processor}, ${p.ram} RAM, ${p.storage} — ₹${Number(p.price).toLocaleString('en-IN')}`
        ).join('\n') +
        `\n\nFor bulk pricing or more info, WhatsApp us at +91 ${storeInfo.phone}!`;

      const cards = displayProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: `₹${Number(p.price).toLocaleString('en-IN')}`,
        image: p.image || '/products/dell_laptop_premium.png',
        link: `/products/${p.id}`,
        shortSpecs: `${p.processor} | ${p.ram} | ${p.storage}`
      }));

      return { text, products: cards };
    }
  } catch (e) {
    console.error("Smart fallback error:", e);
  }

  // Generic fallback
  return {
    text: `Hi! I'm the Satya Computers Assistant 👋\n\nWe stock **Dell, Lenovo, HP, and Apple** laptops — all refurbished, tested, and ready to ship across India.\n\nTry asking:\n- "Show Dell laptops"\n- "Laptops under 20000"\n- "HP EliteBook"\n\nOr contact us directly:\n📱 +91 ${storeInfo.phone}\n📧 ${storeInfo.email}`,
    products: []
  };
}

// ── Resolve product IDs from DB ────────────────────────────────────────────
async function resolveProducts(ids: string[]) {
  if (ids.length === 0) return [];
  try {
    const result = await client.execute({
      sql: `SELECT * FROM "Product" WHERE id IN (${ids.map(() => '?').join(',')})`,
      args: ids
    });
    return result.rows.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: `₹${Number(p.price).toLocaleString('en-IN')}`,
      image: p.image || '/products/dell_laptop_premium.png',
      link: `/products/${p.id}`,
      shortSpecs: `${p.processor} | ${p.ram} | ${p.storage}`
    }));
  } catch (e) {
    return [];
  }
}

// ── Main POST handler ──────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ text: "No messages provided." }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    const userMessage = messages[messages.length - 1]?.content || '';

    // ── Try Gemini AI ──
    if (API_KEY) {
      const systemPrompt = await getSystemPrompt();
      const contents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      for (const modelName of ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite"]) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: systemPrompt }] },
              generationConfig: { maxOutputTokens: 1024, temperature: 0.2 }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const finalOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (finalOutput) {
              // Extract product IDs
              const matches = finalOutput.match(/\[PX:([^\]]+)\]/g) || [];
              const ids = Array.from(new Set(matches.map((m: string) => m.replace('[PX:', '').replace(']', '')))) as string[];
              const products = await resolveProducts(ids);

              return NextResponse.json({
                text: finalOutput.replace(/\[PX:[^\]]+\]/g, '').trim(),
                products
              });
            }
          } else {
            const errData = await response.json();
            const isQuotaError = response.status === 429 || errData?.error?.status === 'RESOURCE_EXHAUSTED';
            if (!isQuotaError) break; // Only skip to fallback for quota errors; break on others
          }
        } catch (err) {
          console.error(`Error with model ${modelName}:`, err);
        }
      }
    }

    // ── Smart Keyword Fallback (no AI needed) ──
    const fallback = await smartFallback(userMessage);
    return NextResponse.json(fallback);

  } catch (error: any) {
    console.error("Critical Chat API Error:", error);
    return NextResponse.json({
      text: `I'm having trouble right now. Please contact us at ${storeInfo.email} or call +91 ${storeInfo.phone} 🙏`
    }, { status: 200 });
  }
}
