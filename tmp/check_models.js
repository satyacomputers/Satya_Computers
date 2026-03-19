const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "d:/Satya_Computers/.env" });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ["gemini-1.5-flash", "gemini-pro", "gemini-2.0-flash-exp", "gemini-1.5-flash-latest"];

    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hi");
            console.log(`${m}: SUCCESS`);
        } catch (e) {
            console.log(`${m}: ERROR ${e.status || e.message}`);
        }
    }
}
testGemini();
