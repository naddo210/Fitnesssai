import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    const apiKey = process.env.GEMINI_API_KEY; // Using the key from .env (OpenRouter Key)
    console.log("Diagnosing OpenRouter...");
    console.log(`Key present: ${!!apiKey} (Length: ${apiKey?.length})`);

    // 1. Check Models
    try {
        console.log("Fetching available models...");
        const modelsParams = {
            method: "GET",
            headers: { "Authorization": `Bearer ${apiKey}` }
        };
        const modelsRes = await fetch("https://openrouter.ai/api/v1/models", modelsParams);

        if (modelsRes.ok) {
            const modelsData = await modelsRes.json();
            console.log(`Success! Found ${modelsData.data.length} models.`);
            // Check if our desired models exist
            const googleModels = modelsData.data.filter(m => m.id.includes("google/gemini"));
            console.log("Google Gemini Models available:", googleModels.map(m => m.id).slice(0, 5));
        } else {
            console.error(`Failed to list models: ${modelsRes.status}`);
            console.error(await modelsRes.text());
            return; // Stop if key is bad
        }
    } catch (e) {
        console.error("Network error listing models:", e.message);
    }

    // 2. Test Generation
    const testModel = "google/gemini-1.5-flash"; // Common ID
    console.log(`Testing generation with ${testModel}...`);

    try {
        const genRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "Gym Genius Debug",
            },
            body: JSON.stringify({
                "model": testModel,
                "messages": [{ "role": "user", "content": "Hi" }]
            })
        });

        if (genRes.ok) {
            const data = await genRes.json();
            console.log("Top Success! Reply:", data.choices[0].message.content);
        } else {
            console.error(`Generation Failed: ${genRes.status}`);
            console.error(await genRes.text());
        }
    } catch (e) {
        console.error("Generation error:", e.message);
    }
};

run();
