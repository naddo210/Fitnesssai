import { generateContent } from '../services/geminiService.js';

// @desc    Generate Workout Plan
// @route   POST /api/ai/workout-plan
// @access  Private
const generateWorkoutPlan = async (req, res) => {
    const { fitnessLevel, goals, pastHistory } = req.body;

    const prompt = `As an elite fitness trainer, create a detailed 7-day workout split for a ${fitnessLevel} level individual.
    
    ## User Profile
    - **Goals:** "${goals}"
    - **History:** ${pastHistory || "None provided"}
    - **Injuries/Pain:** ${req.body.injuries || "None"}
    
    ## Instructions
    0. **CRITICAL:** If there are injuries listed, you MUST modify the plan to specifically avoid aggravating them and include recovery tips. Mention this in the notes.
    1. Provide a structured plan with specific exercises, sets, reps, and rest times.
    2. Include a "Coach's Note" for each workout day explaining the focus.
    3. Use BOLD headers and lists for readability. 
    4. Make it visually appealing with clear formatting.`;

    try {
        const result = await generateContent(prompt);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Meal Plan
// @route   POST /api/ai/meal-plan
// @access  Private
const generateMealPlan = async (req, res) => {
    const { dietType, calories, preferences } = req.body;
    const prompt = `As a sports nutritionist, create a daily meal plan for a ${dietType} diet user targeting around ${calories} calories. Preferences: ${preferences}. Include Breakfast, Lunch, Dinner, Snack with ingredients and approximate macros. Use nice formatting.`;

    try {
        const result = await generateContent(prompt);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Find Exercise Info
// @route   POST /api/ai/exercise
// @access  Private
const generateExerciseGuide = async (req, res) => {
    const { bodyPart } = req.body;
    const prompt = `As an expert trainer, suggest 3 best exercises for ${bodyPart}. Return ONLY a JSON array of objects. Each object must have: "name", "formCues" (string), "commonMistakes" (string), "injuryRisks" (string - be specific about what body parts are at risk if done wrong). Do not include markdown formatting like \`\`\`json. Just the raw JSON.`;

    try {
        const text = await generateContent(prompt);
        console.log("AI Raw Output:", text); // Debugging

        // Robust parsing: extract content between [ and ]
        const jsonMatch = text.match(/\[([\s\S]*?)\]/);

        if (!jsonMatch) {
            throw new Error("No JSON array found in response");
        }

        const jsonStr = jsonMatch[0];
        const result = JSON.parse(jsonStr);
        res.status(200).json({ result });
    } catch (error) {
        console.error("AI Exercise Error:", error);
        // Fallback hardcoded if parsing fails completely, so UI doesn't break
        const fallback = [
            { name: "Error Parsing AI", formCues: "Try again", commonMistakes: "AI returned invalid format" }
        ];
        res.status(200).json({ result: fallback });
    }
};

// @desc    Height Maximization Advice
// @route   POST /api/ai/height
// @access  Private
const generateHeightGuidance = async (req, res) => {
    const { currentHeight, age, gender } = req.body;

    const prompt = `As a growth specialist, provide a scientific and holistic height maximization plan for a ${age}-year-old ${gender} who is currently ${currentHeight}.
    
    ## Requirements
    1. **Reality Check:** Be honest about genetic limits based on age (${age}).
    2. **Nutrition:** Specific nutrients to focus on for bone growth.
    3. **Sleep:** Optimal sleep schedule for HGH release.
    4. **Exercise:** Stretching and posture-correction exercises to maximize visible height.
    5. **Lifestyle:** Habits to avoid (smoking, caffeine, etc.).
    
    Format the output with clear headers, bullet points, and an encouraging but realistic tone.`;

    try {
        const result = await generateContent(prompt);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Daily Motivation
// @route   POST /api/ai/motivation
// @access  Private
const getMotivation = async (req, res) => {
    const { name } = req.body;
    const prompt = `Give a short, harsh but motivating gym quote for a user named "${name || 'Warrior'}". It should be unique, punchy, and make them want to workout immediately. Max 1 sentence.`;

    try {
        const result = await generateContent(prompt);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Viral Challenge Protocol
// @route   POST /api/ai/challenge
// @access  Private
const generateChallengeProtocol = async (req, res) => {
    const { challengeTitle, promptDirective, fitnessLevel } = req.body;

    const systemPrompt = `You are an elite, championship-level strength and conditioning director.
Create an epic, comprehensive, and highly motivating athletic blueprint for this viral fitness challenge:
CHALLENGE: "${challengeTitle || 'Fitness Challenge'}" (Target Level: ${fitnessLevel || 'Intermediate'})
SPECIFIC FOCUS: "${promptDirective || 'Comprehensive challenge protocol'}"

Format your response strictly using rich, clean GitHub Flavored Markdown with:
1. # 🔥 ${challengeTitle ? challengeTitle.toUpperCase() : 'CHALLENGE'} PROTOCOL
   A high-energy 2-sentence mission statement.

2. ## 🎯 THE 4 NON-NEGOTIABLE PROTOCOL RULES
   List 4 specific, actionable core habits (e.g. hydration, protein, training window, sleep).

3. ## 🗓️ STRUCTURED TRAINING SCHEDULE
   Use clean Markdown tables with columns:
   | Day / Phase | Workout Focus | Key Movements | Target Sets & Reps | Intensity / Timing |

4. ## 🥗 NUTRITION & FUELING BLUEPRINT
   - Exact daily dietary targets (calories, protein ratio, hydration).
   - Specific meal examples (Pre-workout, Post-workout, Main recovery meal).

5. ## ⚡ SECRET WEAPON & PROGRESSION
   - How to progressive overload and track progress week over week.
   - Rest & recovery protocol.

6. > **COACH'S FINAL CHARGE:** A gritty, inspiring quote to ignite the athlete's warrior spirit.

Make it clean, realistic, science-backed, and visually stunning with bolding, lists, and tables. Avoid generic filler.`;

    try {
        const result = await generateContent(systemPrompt);
        res.status(200).json({ result });
    } catch (error) {
        console.error('Challenge Generation Error:', error.message);
        res.status(500).json({ message: error.message || 'Error generating challenge protocol' });
    }
};

export { 
    generateWorkoutPlan, 
    generateMealPlan, 
    generateExerciseGuide, 
    generateHeightGuidance, 
    getMotivation,
    generateChallengeProtocol 
};
