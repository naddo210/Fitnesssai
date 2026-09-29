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
    if (p.includes("challenge") || p.includes("fat loss") || p.includes("ramadan") || p.includes("summer shred") || p.includes("saiyan")) return getMockChallenge(p);
    if (p.includes("workout")) return getMockWorkout();
    if (p.includes("meal")) return getMockMeal();
    if (p.includes("exercises") || p.includes("exercise") || p.includes("bodypart")) return getMockExercise();
    if (p.includes("height")) return getMockHeight();
    return "## AI Recommendation\nFocus on progressive overload, sleep 8+ hours, and maintain a caloric intake aligned with your goal.";
};

const getMockChallenge = (p) => {
    if (p.includes("ramadan")) {
        return `# 🌙 RAMADAN FITNESS & STRENGTH PROTOCOL

> **COACH'S CORE PHILOSOPHY:** Ramadan is not a month of losing gains—it is a masterclass in discipline, mental fortitude, and cellular autophagy.

---

## 🎯 4 NON-NEGOTIABLE PROTOCOL RULES
1. **Electrolyte Super-Hydration:** Drink minimum 2.5L to 3L water between Iftar and Suhoor with pink Himalayan salt.
2. **Training Window Optimization:** Workout either **45 mins before Iftar** (light hypertrophy/mobility) OR **90 mins after Iftar** (heavy strength).
3. **Protein Preservation:** Hit at least 1.6g to 2.0g protein per kg of bodyweight across Suhoor, Iftar, and post-Taraweeh.
4. **Volume Management:** Reduce set volume by 25-30% while maintaining high mechanical tension (intensity over endless sets).

---

## 🗓️ WEEKLY RAMADAN TRAINING SCHEDULE

| Day | Focus | Primary Exercises | Target Sets & Reps | Optimal Timing |
|---|---|---|---|---|
| **Day 1** | Push Hypertrophy | Barbell Bench Press, Incline DB Press, Overhead Press, Lateral Raises | 3 sets x 8-10 reps | Post-Iftar (8:30 PM) |
| **Day 2** | Pull & Posterior Chain | Weighted Pull-ups, Barbell Rows, Facepulls, Incline Dumbbell Curls | 3 sets x 8-12 reps | Post-Iftar (8:30 PM) |
| **Day 3** | Active Recovery & Mobility | Hip flexor flow, spinal decompression, light 20m stroll | 20-30 mins easy | 45m Before Iftar |
| **Day 4** | Quad & Glute Strength | Front Squats, Bulgarian Split Squats, Romanian Deadlifts | 3 sets x 6-10 reps | Post-Iftar (8:30 PM) |
| **Day 5** | Functional Arms & Core | Close-Grip Bench, Hammer Curls, Hanging Leg Raises, Plank | 3 sets x 12-15 reps | Post-Iftar (8:30 PM) |
| **Day 6 & 7**| Complete Rest & Reflection | Hydration focus, family time, deep restorative sleep | Rest & Refuel | All Day |

---

## 🥗 NUTRITION & FUELING BLUEPRINT

### 🌅 Suhoor (Pre-Dawn Meal)
- **Slow-Digesting Carbohydrates:** 80g Rolled oats with chia seeds, cinnamon, and 1 sliced banana.
- **Sustained Protein:** 3 whole eggs + 2 egg whites cooked in extra virgin olive oil.
- **Micronutrient & Fluid Lock:** 1 large glass water with electrolytes + 1 cucumber (96% water content).

### 🌇 Iftar (Sunset Break Fast)
- **Immediate Rehydration:** 3 organic dates with 500ml water and a pinch of salt.
- **Main Plate:** 200g grilled chicken breast or white fish, 150g sweet potato or basmati rice, steamed asparagus.

---

> **COACH'S FINAL CHARGE:** "Your body will follow wherever your mind commands it to go. Rise above excuses and emerge sharper, stronger, and more disciplined."`;
    }

    if (p.includes("saiyan") || p.includes("goku")) {
        return `# ⚡ SAIYAN PHYSIOLOGY: UNLIMITED POWER PROTOCOL

> **WARNING:** This protocol is engineered strictly for advanced athletes seeking extreme conditioning, raw power, and relentless stamina.

---

## 🎯 THE 5 SAIYAN COMMANDMENTS
1. **Train Past Failure:** On your final set of compound lifts, utilize rest-pause drop sets.
2. **Callisthenics Mastery:** 100 explosive pushups, 50 pullups, and 100 air squats daily before touching weights.
3. **Caloric Overdrive:** Fuel the metabolic engine with high complex carbs and 2.2g protein per kg.
4. **Zero Wasted Time:** Maximum 60 seconds rest between working sets. Keep heart rate elevated.

---

## 🗓️ 4-WEEK INTENSITY CALENDAR

| Phase | Training Focus | Core Movements | Rep Scheme & Intensity |
|---|---|---|---|
| **Phase 1 (Mon)** | Explosive Upper Body | Weighted Dips, Plyo Pushups, Barbell Snatch, Barbell Row | 5 sets x 5 explosive reps |
| **Phase 2 (Tue)** | Heavy Lower Chain | Zercher Squat, Trap Bar Deadlift, Walking Lunges | 4 sets x 6-8 reps (heavy) |
| **Phase 3 (Wed)** | Gravity Chamber Conditioning | 400m Sprints x 8 rounds, Kettlebell Swings, Battle Ropes | 25 mins HIIT |
| **Phase 4 (Thu)** | Brutal Shoulders & Back | Behind Neck Press, Chin-ups, Lu Raises, Farmer's Walks | 4 sets x 10-12 reps |
| **Phase 5 (Fri)** | Full Body Hybrid Annihilation | Clean & Jerk, Thrusters, Toes to Bar, Assault Bike | 5 rounds for time |
| **Weekend** | Active Hyperbolic Chamber | Deep foam rolling, cold immersion, 10,000 steps walk | Active Restoration |

---

## 🥗 FUELING PROTOCOL: HYPER METABOLISM
- **Target Calories:** Caloric Surplus (+400-500 kcal above maintenance).
- **Power Smoothie:** 2 scoops whey isolate, 100g oats, 2 tbsp peanut butter, 1 cup blueberries, 5g creatine monohydrate.
- **Sleep:** 9 hours mandatory for CNS neuro-muscular regeneration.

---

> **COACH'S FINAL CHARGE:** "Push through the burn. The only limit that exists is the one you accept in your own mind. Break your limits!"`;
    }

    return `# 🔥 30-DAY FAT LOSS & METABOLIC SHRED PROTOCOL

> **COACH'S DIRECTIVE:** Fat loss is math and consistency. Follow this blueprint for 30 consecutive days and transform your physique.

---

## 🎯 4 CORE RULES FOR THE 30 DAYS
1. **Deficit Discipline:** Strictly consume 400-500 calories below your Total Daily Energy Expenditure (TDEE).
2. **Daily 10,000 Steps (NEAT):** Non-Exercise Activity Thermogenesis burns more fat over 30 days than cardio machines.
3. **High Protein Anchor:** 2.0g protein per kg of bodyweight to preserve lean muscle while burning adipose tissue.
4. **Hydration Engine:** Drink minimum 3.5 liters of clean water daily. Zero liquid calories or sodas.

---

## 🗓️ 30-DAY PROGRESSIVE TRAINING SCHEDULE

| Split Day | Focus | Primary Exercises | Volume & Reps | Cardio Finisher |
|---|---|---|---|---|
| **Monday** | Chest & Delts Hypertrophy | Incline Dumbbell Press, Cable Flyes, Lateral Raises | 4 sets x 10-12 reps | 12 mins Incline Treadmill (12-3-30) |
| **Tuesday** | Back & Core Sculpt | Lat Pulldowns, Seated Cable Rows, Hanging Knee Raises | 4 sets x 10-12 reps | 10 mins Rowing Machine HIIT |
| **Wednesday**| Quads & Calves (High Volume) | Leg Press, Goblet Squats, Walking Dumbbell Lunges | 4 sets x 12-15 reps | 15 mins Stairmaster |
| **Thursday** | Active Rest / Zone 2 Cardio | Fast-paced outdoor walk, foam rolling, dynamic stretch | 45-60 mins steady | Low intensity heart rate |
| **Friday** | Hamstrings, Glutes & Posterior | Romanian Deadlift, Lying Leg Curls, Hip Thrusts | 4 sets x 10-12 reps | 10 mins Assault Bike Intervals |
| **Saturday** | Arms & Metabolic Circuit | Bicep Curls, Skull Crushers, Burpees, Mountain Climbers | 3 circuits x 45s work | Full metabolic burnout |
| **Sunday** | Full Mental & Physical Reset | Hydration replenishment, meal prep for the week ahead | Rest & Recover | Total Rest |

---

## 🥗 30-DAY METABOLIC MEAL BLUEPRINT
- **Meal 1 (Post-Fast / 11 AM):** 3 scrambled eggs, 1/2 avocado, spinach, 1 slice sourdough (420 kcal, 26g protein)
- **Meal 2 (3 PM):** 200g grilled lean turkey breast or chicken, 120g jasmine rice, steamed broccoli (480 kcal, 48g protein)
- **Meal 3 (7 PM):** 200g baked white fish or tofu, massive garden salad with 1 tbsp olive oil and balsamic (380 kcal, 42g protein)
- **Total Daily Deficit:** ~1,700-1,900 kcal • 150-180g Protein • High fiber & micronutrients

---

> **COACH'S FINAL CHARGE:** "Consistency turns average effort into extraordinary results. Show up every day for the next 30 days—your future self is watching."`;
};

const getMockWorkout = () => `## 7-Day Precision Workout Split\n| Day | Focus | Core Exercises | Sets & Reps |\n|---|---|---|---|\n| Mon | Chest & Triceps | Flat Barbell Bench Press, Incline Dumbbell Press, Dips | 3x8-12 |\n| Tue | Back & Biceps | Pull-Ups, Barbell Bent-Over Row, Bicep Curls | 3x8-12 |\n| Wed | Active Recovery | Mobility flow, light 20m incline walk | 20 mins |\n| Thu | Quads & Core | Barbell Back Squat, Leg Press, Hanging Knee Raises | 4x8-10 |\n| Fri | Shoulders & Arms | Overhead Military Press, Lateral Raises, Skullcrushers | 3x12-15 |\n| Sat | Hamstrings & Posterior | Romanian Deadlift, Hamstring Curls, Farmer's Walk | 3x10-12 |\n| Sun | Full Rest | Rest & recovery hydration | - |\n`;
const getMockMeal = () => `## Precision Nutrition Plan\n- **Breakfast (7:30 AM):** 3 whole eggs + 2 egg whites, 80g oats with berries & chia seeds (520 cal, 38g protein)\n- **Lunch (12:30 PM):** 200g grilled chicken breast, 150g sweet potato or brown rice, steamed broccoli with olive oil (650 cal, 52g protein)\n- **Pre-Workout Fuel (4:00 PM):** 1 banana with 1 tbsp peanut butter, black coffee or green tea (210 cal)\n- **Post-Workout Dinner (7:30 PM):** 200g baked salmon fillet, quinoa, asparagus, mixed green salad (580 cal, 46g protein)\n`;
const getMockExercise = () => `[{"name":"Barbell Bench Press","formCues":"Retract scapulae, feet flat on the floor, grip slightly wider than shoulders, bar touches mid-chest","commonMistakes":"Elbows flaring 90 degrees, bouncing bar off ribs, lifting hips off bench","injuryRisks":"Rotator cuff strain, pectoral muscle tear"},{"name":"Barbell Back Squat","formCues":"Feet shoulder-width apart, chest upright, push knees out in line with toes, break parallel","commonMistakes":"Knees caving inwards (valgus), rounding lower back, heels leaving floor","injuryRisks":"Patellar tendon stress, lumbar spine compression"},{"name":"Romanian Deadlift","formCues":"Slight knee bend, hinge at hips, keep bar glued to shins, squeeze glutes at the top","commonMistakes":"Rounding thoracic spine, turning it into a squat, hyperextending at lockout","injuryRisks":"Lower back strain, hamstring tear"}]`;
const getMockHeight = () => `## Natural Height & Posture Optimization\n1. **Deep Sleep Hormonal Surge:** Aim for 8.5 to 9.5 hours. 75% of Human Growth Hormone (HGH) is released in Stage 3 & 4 slow-wave sleep.\n2. **Decompress the Spine:** Perform 3 sets of 45-second dead hangs on a pull-up bar daily to rehydrate spinal discs.\n3. **Fix Postural Shortening:** Eliminate Anterior Pelvic Tilt (APT) by foam rolling hip flexors and strengthening glutes.\n4. **Micronutrient Optimization:** Daily Vitamin D3 (2000-5000 IU) + K2, Zinc, and 1200mg elemental calcium.\n`;

export { generateContent };
