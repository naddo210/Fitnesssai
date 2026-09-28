import dotenv from 'dotenv';
dotenv.config();

// Free models confirmed available on OpenRouter (2025)
// Rotates automatically if one is rate-limited or down
const FREE_MODELS = [
    "qwen/qwen3.6-plus:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "google/gemma-3-27b-it:free",
    "z-ai/glm-4.5-air:free",
    "stepfun/step-3.5-flash:free",
    "google/gemma-3n-e2b-it:free",
];

const generateContent = async (prompt) => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey || apiKey.includes("YOUR_")) {
        console.error("Missing OPENROUTER_API_KEY — serving mock data.");
        return fallbackMock(prompt);
    }

    for (const model of FREE_MODELS) {
        try {
            console.log(`Trying: ${model}`);
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "FitnessAI",
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: "user", content: prompt }]
                })
            });

            const data = await response.json();

            if (response.status === 429 || response.status === 503 || response.status === 404) {
                console.warn(`Skipping ${model} (${response.status})`);
                continue;
            }

            if (!response.ok) {
                console.error(`Error ${response.status} for ${model}:`, data?.error?.message);
                continue;
            }

            if (data.choices?.[0]?.message?.content) {
                console.log(`✅ Success: ${model}`);
                return data.choices[0].message.content;
            }

        } catch (err) {
            console.error(`Network error (${model}):`, err.message);
        }
    }

    console.warn("All models failed — returning mock data.");
    return fallbackMock(prompt);
};

const fallbackMock = (prompt) => {
    const p = prompt.toLowerCase();
    if (p.includes("workout")) return getMockWorkout();
    if (p.includes("meal")) return getMockMeal();
    if (p.includes("exercises") && p.includes("json")) return getMockExercise();
    if (p.includes("height")) return getMockHeight();
    return "AI temporarily unavailable. Please try again.";
};

const getMockWorkout = () => `## 7-Day Workout Split\n| Day | Focus | Exercises |\n|---|---|---|\n| Mon | Chest & Triceps | Bench Press (3x10), Incline Press (3x12), Dips (3x15) |\n| Tue | Back & Biceps | Pull-Ups (3x8), Rows (3x10), Curls (3x12) |\n| Wed | Rest | Light walk or yoga |\n| Thu | Legs & Core | Squats (3x8), Deadlifts (3x10), Plank (3x60s) |\n| Fri | Shoulders | OHP (3x10), Lateral Raises (3x15) |\n| Sat | HIIT | Burpees, Mountain Climbers (4 rounds) |\n| Sun | Rest | Full recovery |\n`;
const getMockMeal = () => `## Daily Meal Plan\n- **Breakfast:** Oatmeal + protein powder + berries (500 cal)\n- **Lunch:** Chicken breast + quinoa + vegetables (600 cal)\n- **Snack:** Greek yogurt + honey (200 cal)\n- **Dinner:** Salmon + sweet potato + broccoli (500 cal)\n`;
const getMockExercise = () => `[{"name":"Push-Up","formCues":"Straight body, chest to floor, elbows 45°","commonMistakes":"Sagging hips, flaring elbows"},{"name":"Squat","formCues":"Feet shoulder-width, chest up, knees out","commonMistakes":"Knees caving, rounding back"},{"name":"Plank","formCues":"Forearms down, core tight, neutral neck","commonMistakes":"Hips too high or sagging"}]`;
const getMockHeight = () => `## Height Guide\n1. **Sleep:** 8-10 hrs (HGH released during deep sleep)\n2. **Nutrition:** Protein, Calcium, Vitamin D\n3. **Posture:** Fix pelvic tilt to look taller\n4. **Stretch:** Bar hangs 2 min/day to decompress spine\n`;

export { generateContent };
