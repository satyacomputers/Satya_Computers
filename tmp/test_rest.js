const dotenv = require("dotenv");
dotenv.config();

async function testAll() {
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-1.0-pro",
    "gemini-pro",
    "gemini-pro-vision",
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash-lite-preview-02-05"
  ];

  const API_KEY = process.env.GEMINI_API_KEY;
  console.log("Using API KEY:", API_KEY);

  for (const m of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${API_KEY}`;
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
      });
      const data = await resp.json();
      if (resp.ok) {
        console.log(`[SUCCESS] ${m}`);
      } else {
        console.log(`[FAIL] ${m}: ${data.error?.message || "Unknown error"}`);
      }
    } catch (e) {
      console.log(`[ERROR] ${m}: ${e.message}`);
    }
  }
}
testAll();
