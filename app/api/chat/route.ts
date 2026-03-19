import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are an intelligent customer support assistant for Satya Computers, a trusted bulk laptop reseller based in Hyderabad, India.

ABOUT SATYA COMPUTERS:
- Specialized in bulk laptop supply to IT companies, corporates, and businesses
- Based in Hyderabad, Telangana, India
- Known for competitive bulk pricing and reliable stock availability
- Serving clients across India with enterprise-grade hardware solutions

YOUR ROLE:
- Answer ONLY questions related to Satya Computers, its products, services, pricing, and policies
- Be professional, friendly, and concise
- If a question is outside Satya Computers' scope, politely say: "I can only assist with Satya Computers related queries. Please contact us directly for other questions."
- Never make up prices, specifications, or policies that are not provided
- Always encourage the customer to place an order or contact the team for custom requirements

PRODUCTS WE OFFER:
- Laptops from brands: Dell, HP, Lenovo, Asus, Acer, Apple, Microsoft
- Categories: Business Laptops, Gaming Laptops, Student Laptops, Workstations
- All laptops come with valid warranty
- Stock availability: updated regularly

BULK PRICING TIERS:
- 1–4 units: Standard retail price
- 5–10 units: Bulk Tier 1 — discounted price
- 11–25 units: Bulk Tier 2 — better discount
- 26+ units: Bulk Tier 3 — best pricing, contact sales team directly

ORDERING PROCESS:
1. Browse products on the website
2. Select quantity and submit an order inquiry form
3. Our team reviews and sends a custom quotation within 24 hours
4. Payment and delivery terms are confirmed
5. Delivery arranged across India

PAYMENT & DELIVERY:
- Payment modes: Bank Transfer, UPI, Cheque for bulk orders
- Delivery: Pan India shipping available
- Lead time: 3–7 business days depending on order size and location

WARRANTY & SUPPORT:
- All products carry manufacturer warranty
- On-site support available for large orders in Hyderabad
- Post-sale support provided for bulk clients

CONTACT:
- Location: Hyderabad, Telangana, India
- Inquiries: via website contact form or WhatsApp
- Response time: within 24 business hours

FREQUENTLY ASKED QUESTIONS:
Q: What is the minimum order quantity?
A: Minimum order is 1 unit, but bulk pricing starts from 5 units.

Q: Do you offer EMI or credit terms?
A: Credit terms are available for verified corporate clients. Contact our sales team.

Q: Can we get a custom configuration?
A: Yes, we can source laptops with custom RAM, storage, and OS configurations for bulk orders.

Q: Do you supply outside Hyderabad?
A: Yes, we deliver Pan India.

Q: Can we inspect before buying?
A: Yes, clients in Hyderabad can visit for physical inspection. Contact us to schedule.

Q: Do you provide GST invoice?
A: Yes, GST invoices are provided for all orders.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ text: "No messages provided." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("DEBUG: GEMINI_API_KEY is TOTALLY MISSING from process.env");
      throw new Error("GEMINI_API_KEY is missing. Check your .env file.");
    } else {
      console.log(`DEBUG: Using Gemini API Key starting with: ${process.env.GEMINI_API_KEY.substring(0, 8)}...`);
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    
    // Convert history to REST API format
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // REST API call to v1beta (Required for systemInstruction)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
        const errorDetail = await response.json();
        const err = new Error(errorDetail?.error?.message || "API Error");
        // @ts-ignore
        err.status = response.status;
        throw err;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("Empty response from AI engine.");
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    // CRITICAL: Log the full error to a file for persistent diagnostics
    const errorData = `
--- GEMINI ERROR (${new Date().toISOString()}) ---
Status: ${error?.status}
Message: ${error?.message}
Stack: ${error?.stack}
-----------------------------------------------
`;
    try {
      require('fs').appendFileSync('gemini_error.txt', errorData);
    } catch (e) {}

    console.error("--- GEMINI ERROR DETECTED ---");
    console.error("Status:", error?.status);
    console.error("Message:", error?.message);

    let friendlyMsg = "I'm having a little trouble connecting right now. Please try again in a moment.";

    const msg = error?.message?.toLowerCase() || "";
    const status = error?.status;

    if (
      msg.includes("quota") ||
      msg.includes("too many requests") ||
      msg.includes("429") ||
      msg.includes("resource_exhausted") ||
      status === 429
    ) {
      friendlyMsg =
        "Service is slightly overloaded. Please wait a few seconds and try again. 🙏";
    } else if (
      msg.includes("api key") ||
      msg.includes("invalid key") ||
      status === 401 ||
      status === 403
    ) {
      friendlyMsg =
        "AI authentication issues. Please check the GEMINI_API_KEY in .env.";
    } else if (msg.includes("not found") || status === 404) {
      friendlyMsg =
        "Model not found. Try a different model like gemini-1.5-flash.";
    } else if (status === 400) {
      friendlyMsg =
        "I couldn't process this request (400 Bad Request). This might be due to safety filters or malformed input.";
    }

    return NextResponse.json({ text: friendlyMsg }, { status: 200 });
  }
}
