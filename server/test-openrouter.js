import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Testing OpenRouter with Key: " + (apiKey ? apiKey.substring(0, 10) + "..." : "NONE"));

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "Gym Genius Test",
            },
            body: JSON.stringify({
                "model": "google/gemini-1.5-flash",
                "messages": [
                    { "role": "user", "content": "Hello, are you working?" }
                ]
            })
        });

        if (!response.ok) {
            const text = await response.text();
            console.error(`Error ${response.status}: ${text}`);
        } else {
            const data = await response.json();
            console.log("Success:", data);
        }
    } catch (e) {
        console.error("Fetch Error:", e);
    }
};

run();
