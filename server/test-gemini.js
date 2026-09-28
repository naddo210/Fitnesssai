import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    try {
        console.log("Testing Gemini API with Key: " + process.env.GEMINI_API_KEY?.substring(0, 10) + "...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // For listing models, we might need to use the model manager if available in this SDK version
        // or just try to generate content with a known model to see if it works.

        // Attempting to use the model that was failing to see specific error or if it works in isolation
        const modelName = "gemini-1.5-flash";
        console.log(`Attempting to generate content with ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, can you hear me?");
        console.log("Success! Response: ", result.response.text());
    } catch (error) {
        console.error("Error with gemini-1.5-flash:", error.message);

        try {
            console.log("Attempting fallback to gemini-pro...");
            const genAI2 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model2 = genAI2.getGenerativeModel({ model: "gemini-pro" });
            const result2 = await model2.generateContent("Hello?");
            console.log("Success with gemini-pro! Response: ", result2.response.text());
        } catch (error2) {
            console.error("Error with gemini-pro:", error2.message);
        }
    }
};

run();
