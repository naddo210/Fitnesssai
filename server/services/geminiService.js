import dotenv from 'dotenv';
dotenv.config();

// Fast, verified free models on OpenRouter (2025/2026)
// Prioritizes sub-2-second flash models with automatic fallback
const FREE_MODELS = [
    "inclusionai/ling-3.0-flash-fin:free",
    "stepfun/step-3.5-flash:free",
    "google/gemma-3n-e2b-it:free",
    "cohere/north-mini-code:free",
    "z-ai/glm-4.5-air:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "meta-llama/llama-3.2-3b-instruct:free"
];

// Simple in-memory response cache for frequent prompts (5 minute TTL)
const responseCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

const generateContent = async (prompt) => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey || apiKey.includes("YOUR_")) {
        console.error("Missing OPENROUTER_API_KEY — serving high quality fallback data.");
        return fallbackMock(prompt);
    }

    // Check cache
    const cacheKey = prompt.trim().toLowerCase();
    const cached = responseCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
        console.log("⚡ Cache hit for prompt");
        return cached.content;
    }

    const appUrl = process.env.SERVER_URL || process.env.RENDER_EXTERNAL_URL || "https://fitnesssai.onrender.com";

    for (const model of FREE_MODELS) {
        try {
            console.log(`Trying model: ${model}`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout for fast failover

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": appUrl,
                    "X-Title": "FitnessAI GymGenius",
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7,
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.status === 429 || response.status === 503 || response.status === 404) {
                console.warn(`Skipping ${model} (HTTP ${response.status})`);
                continue;
            }

            const data = await response.json();

            if (!response.ok) {
                console.error(`Error ${response.status} for ${model}:`, data?.error?.message);
                continue;
            }

            if (data.choices?.[0]?.message?.content) {
                const content = data.choices[0].message.content;
                console.log(`✅ Success with model: ${model}`);
                // Save to cache
                responseCache.set(cacheKey, { content, timestamp: Date.now() });
                return content;
            }

        } catch (err) {
            console.error(`Error with (${model}):`, err.name === 'AbortError' ? 'Request timed out (7s)' : err.message);
        }
    }

    console.warn("All AI models busy or timed out — serving smart fallback data.");
    return fallbackMock(prompt);
};

const fallbackMock = (prompt) => {
    const p = prompt.toLowerCase();
    if (p.includes("workout")) return getMockWorkout();
    if (p.includes("meal")) return getMockMeal();
    if (p.includes("exercises") || p.includes("exercise") || p.includes("bodypart")) return getMockExercise();
    if (p.includes("height")) return getMockHeight();
    return "## AI Recommendation\nFocus on progressive overload, sleep 8+ hours, and maintain a caloric intake aligned with your goal.";
};

const getMockWorkout = () => `## 7-Day Precision Workout Split\n| Day | Focus | Core Exercises | Sets & Reps |\n|---|---|---|---|\n| Mon | Chest & Triceps | Flat Barbell Bench Press, Incline Dumbbell Press, Dips | 3x8-12 |\n| Tue | Back & Biceps | Pull-Ups, Barbell Bent-Over Row, Bicep Curls | 3x8-12 |\n| Wed | Active Recovery | Mobility flow, light 20m incline walk | 20 mins |\n| Thu | Quads & Core | Barbell Back Squat, Leg Press, Hanging Knee Raises | 4x8-10 |\n| Fri | Shoulders & Arms | Overhead Military Press, Lateral Raises, Skullcrushers | 3x12-15 |\n| Sat | Hamstrings & Posterior | Romanian Deadlift, Hamstring Curls, Farmer's Walk | 3x10-12 |\n| Sun | Full Rest | Rest & recovery hydration | - |\n`;
const getMockMeal = () => `## Precision Nutrition Plan\n- **Breakfast (7:30 AM):** 3 whole eggs + 2 egg whites, 80g oats with berries & chia seeds (520 cal, 38g protein)\n- **Lunch (12:30 PM):** 200g grilled chicken breast, 150g sweet potato or brown rice, steamed broccoli with olive oil (650 cal, 52g protein)\n- **Pre-Workout Fuel (4:00 PM):** 1 banana with 1 tbsp peanut butter, black coffee or green tea (210 cal)\n- **Post-Workout Dinner (7:30 PM):** 200g baked salmon fillet, quinoa, asparagus, mixed green salad (580 cal, 46g protein)\n`;
const getMockExercise = () => `[{"name":"Barbell Bench Press","formCues":"Retract scapulae, feet flat on the floor, grip slightly wider than shoulders, bar touches mid-chest","commonMistakes":"Elbows flaring 90 degrees, bouncing bar off ribs, lifting hips off bench","injuryRisks":"Rotator cuff strain, pectoral muscle tear"},{"name":"Barbell Back Squat","formCues":"Feet shoulder-width apart, chest upright, push knees out in line with toes, break parallel","commonMistakes":"Knees caving inwards (valgus), rounding lower back, heels leaving floor","injuryRisks":"Patellar tendon stress, lumbar spine compression"},{"name":"Romanian Deadlift","formCues":"Slight knee bend, hinge at hips, keep bar glued to shins, squeeze glutes at the top","commonMistakes":"Rounding thoracic spine, turning it into a squat, hyperextending at lockout","injuryRisks":"Lower back strain, hamstring tear"}]`;
const getMockHeight = () => `## Natural Height & Posture Optimization\n1. **Deep Sleep Hormonal Surge:** Aim for 8.5 to 9.5 hours. 75% of Human Growth Hormone (HGH) is released in Stage 3 & 4 slow-wave sleep.\n2. **Decompress the Spine:** Perform 3 sets of 45-second dead hangs on a pull-up bar daily to rehydrate spinal discs.\n3. **Fix Postural Shortening:** Eliminate Anterior Pelvic Tilt (APT) by foam rolling hip flexors and strengthening glutes.\n4. **Micronutrient Optimization:** Daily Vitamin D3 (2000-5000 IU) + K2, Zinc, and 1200mg elemental calcium.\n`;

export { generateContent };
