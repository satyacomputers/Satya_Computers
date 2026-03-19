const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from project root
dotenv.config({ path: "d:/Satya_Computers/.env" });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No GEMINI_API_KEY found in .env");
        process.exit(1);
    }
    console.log("Testing with API Key: " + apiKey.substring(0, 8) + "...");

    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-2.0-flash"];

    for (const modelName of modelsToTry) {
        console.log(`\n--- Trying model: ${modelName} ---`);
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello?");
            const response = await result.response;
            console.log(`SUCCESS with ${modelName}! Bot says: ` + response.text());
            return; // Exit if success
        } catch (error) {
            console.error(`ERROR with ${modelName}: Status ${error.status}`);
        }
    }
}

testGemini();
