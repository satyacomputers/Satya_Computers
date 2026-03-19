const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There isn't a direct listModels in the simple SDK, 
    // but we can try common ones and see which one doesn't 404.
    const models = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
      "gemini-1.5-pro",
      "gemini-1.0-pro",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite-preview-02-05"
    ];
    
    console.log("Testing models for API Key:", process.env.GEMINI_API_KEY.substring(0, 10) + "...");
    
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        await model.generateContent("test");
        console.log(`[SUCCESS] ${m} is working!`);
      } catch (e) {
        console.log(`[FAILED] ${m}: ${e.message.split('\n')[0]}`);
      }
    }
  } catch (err) {
    console.error("General Error:", err);
  }
}

listModels();
