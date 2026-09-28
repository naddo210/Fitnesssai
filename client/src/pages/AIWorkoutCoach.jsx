import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Brain, Utensils, Search, Ruler, Loader2, Download } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AICoach = () => {
  const [activeTab, setActiveTab] = useState('workout');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // Forms State
  // Forms State
  const [workoutForm, setWorkoutForm] = useState({ fitnessLevel: 'Beginner', goals: '', pastHistory: '', injuries: '' });
  const [mealForm, setMealForm] = useState({ dietType: 'Balanced', calories: '2000', preferences: '' });
  const [exerciseForm, setExerciseForm] = useState({ bodyPart: '' });
  const [heightForm, setHeightForm] = useState({ currentHeight: '', age: '', gender: 'Male' });
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResult(null);
  };

  const submitWorkout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.post('/api/ai/workout-plan', workoutForm);
      setResult(data.result);
    } catch (error) {
      setResult('Error generating plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitMeal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const { data } = await axios.post('/api/ai/meal-plan', mealForm);
      setResult(data.result);
    } catch (error) {
      setResult('Error generating plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitExercise = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null); // Reset result
    try {
      const { data } = await axios.post('/api/ai/exercise', exerciseForm);
      setResult(data.result);
    } catch (error) {
      console.error(error);
      setResult('Error finding exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitHeight = async (e) => {
    e.preventDefault(); // Fixed: prevent default form submission
    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.post('/api/ai/height', heightForm);
      setResult(data.result);
    } catch (error) {
      setResult('Error generating advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('ai-result-content');
    if (!element) return;
    
    try {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('gym-genius-plan.pdf');
    } catch (err) {
        console.error("PDF Export failed", err);
        alert("Failed to allow download. Please try again.");
    }
  };

// ... (renderContent helper remains same)

// ...

            {activeTab === 'workout' && (
              <form onSubmit={submitWorkout} className="space-y-4">
                <div className="border-l-4 border-primary pl-4 mb-4">
                   <h3 className="text-lg font-bold text-white">Tell us about yourself</h3>
                   <p className="text-sm text-gray-400">The more information you provide, the better the recommendation.</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1">Fitness Goals</label>
                  <textarea 
                    className="w-full rounded-md border border-gray-700 bg-black py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                    placeholder="e.g., Lose 10kg in 3 months, build muscle for summer, run a 5k, improve overall stamina." 
                    value={workoutForm.goals}
                    onChange={(e) => setWorkoutForm({...workoutForm, goals: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1">Current Fitness Level</label>
                  <select
                    className="w-full rounded-md border border-gray-700 bg-black py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    value={workoutForm.fitnessLevel}
                    onChange={(e) => setWorkoutForm({...workoutForm, fitnessLevel: e.target.value})}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div>
                   <label className="text-sm font-medium text-gray-300 block mb-1">Past Workout History (Optional)</label>
                   <textarea 
                    className="w-full rounded-md border border-gray-700 bg-black py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                    placeholder="e.g., Used to go to the gym 3 times a week, focused on weightlifting. Haven't worked out in 6 months. I enjoy cycling."
                    value={workoutForm.pastHistory}
                    onChange={(e) => setWorkoutForm({...workoutForm, pastHistory: e.target.value})}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="animate-spin" /> : 'Generate Plan'}
                </Button>
              </form>
            )}

            {/* Meal form and Exercise form remain roughly same but skipping for brevity in this replace block, 
                Wait, I need to match the structure to replace correctly. 
                I will only replace the top state definition and the workout/height rendering parts. 
                Actually, replacing the whole form section is safer to avoid mismatch. */}

             {activeTab === 'height' && (
              <form onSubmit={submitHeight} className="space-y-4">
                 <div className="border-l-4 border-secondary pl-4 mb-4">
                   <h3 className="text-lg font-bold text-white">Growth Parameters</h3>
                   <p className="text-sm text-gray-400">Maximize your genetic potential.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-1">Current Height (cm/ft)</label>
                        <Input 
                            placeholder="e.g. 5'9 or 175cm" 
                            value={heightForm.currentHeight} 
                            onChange={(e) => setHeightForm({...heightForm, currentHeight: e.target.value})}
                            required
                        />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-300 block mb-1">Age</label>
                        <Input 
                            type="number" 
                            placeholder="e.g. 18" 
                            value={heightForm.age} 
                            onChange={(e) => setHeightForm({...heightForm, age: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1">Gender</label>
                   <select
                    className="w-full rounded-md border border-gray-700 bg-black py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    value={heightForm.gender}
                    onChange={(e) => setHeightForm({...heightForm, gender: e.target.value})}
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                 <p className="text-xs text-gray-500 italic">
                  Note: Genetics play the largest role. This guide focuses on maximizing your remaining natural potential through lifestyle factors.
                </p>

                 <Button type="submit" disabled={loading} className="w-full bg-secondary text-black hover:bg-secondary/90">
                  {loading ? <Loader2 className="animate-spin" /> : 'Generate Growth Plan'}
                </Button>
              </form>
            )}

  // Helper to render content based on type
  const renderContent = () => {
      if (loading) {
          return (
             <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
                <p>Consulting neural networks...</p>
             </div>
          );
      }

      if (!result) {
          return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600">
               <Search className="h-16 w-16 mb-4 opacity-20" />
               <p>Enter parameters on the left to generate your plan.</p>
            </div>
          );
      }

      if (activeTab === 'exercise' && Array.isArray(result)) {
          return (
              <div className="space-y-6">
                  {result.map((ex, idx) => (
                      <div key={idx} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                          <h3 className="text-xl font-bold text-secondary mb-2">{ex.name}</h3>
                          <div className="mb-2">
                              <span className="font-semibold text-primary">Form Cues:</span> {ex.formCues}
                          </div>
                          <div className="mb-4">
                              <span className="font-semibold text-red-400">Mistakes:</span> {ex.commonMistakes}
                          </div>
                          <div className="mb-4">
                               <span className="font-semibold text-orange-500">⚠ Injury Risks:</span> {ex.injuryRisks || "None listed"}
                          </div>
                          <Button asChild variant="outline" className="w-full sm:w-auto">
                              <a 
                                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + " exercise form")}`} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="flex items-center gap-2"
                              >
                                  <Search className="w-4 h-4" /> Watch on YouTube
                              </a>
                          </Button>
                      </div>
                  ))}
              </div>
          );
      }

      // Default string/markdown render for other tabs
      return <ReactMarkdown>{result}</ReactMarkdown>;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block mb-2">
          AI PERFORMANCE HUB
        </h2>
        <p className="text-gray-400">Advanced algorithms to optimize your biology.</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { id: 'workout', label: 'Workout Coach', icon: Brain },
          { id: 'meal', label: 'Meal Planner', icon: Utensils },
          { id: 'exercise', label: 'Exercise Finder', icon: Search },
          { id: 'height', label: 'Height Max', icon: Ruler },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
              activeTab === tab.id
                ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(138,43,226,0.5)]'
                : 'bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-gray-300'
            }`}
          >
            <tab.icon className={`h-8 w-8 mb-2 ${activeTab === tab.id ? 'text-secondary' : ''}`} />
            <span className="font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Input Section */}
        <Card className="md:col-span-1 bg-gray-900 border-gray-800 h-fit">
          <CardHeader>
            <CardTitle>
              {activeTab === 'workout' && 'Parameters'}
              {activeTab === 'meal' && 'Diet Preferences'}
              {activeTab === 'exercise' && 'Target Area'}
              {activeTab === 'height' && 'Growth Optimization'}
            </CardTitle>
            <CardDescription>Configure your AI request</CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === 'workout' && (
              <form onSubmit={submitWorkout} className="space-y-4">
                <div className="border-l-4 border-primary pl-4 mb-4">
                   <h3 className="text-lg font-bold text-white">Tell us about yourself</h3>
                   <p className="text-sm text-gray-400">The more information you provide, the better the recommendation.</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1">Fitness Goals</label>
                  <textarea 
                    className="w-full rounded-md border border-gray-700 bg-black py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                    placeholder="e.g., Lose 10kg in 3 months, build muscle for summer, run a 5k, improve overall stamina." 
                    value={workoutForm.goals}
                    onChange={(e) => setWorkoutForm({...workoutForm, goals: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1">Current Fitness Level</label>
                  <select
                    className="w-full rounded-md border border-gray-700 bg-black py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    value={workoutForm.fitnessLevel}
                    onChange={(e) => setWorkoutForm({...workoutForm, fitnessLevel: e.target.value})}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div>
                   <label className="text-sm font-medium text-gray-300 block mb-1">Past Workout History (Optional)</label>
                   <textarea 
                    className="w-full rounded-md border border-gray-700 bg-black py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                    placeholder="e.g., Used to go to the gym 3 times a week, focused on weightlifting. Haven't worked out in 6 months. I enjoy cycling."
                    value={workoutForm.pastHistory}
                    onChange={(e) => setWorkoutForm({...workoutForm, pastHistory: e.target.value})}
                  />
                </div>


                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="animate-spin" /> : 'Generate Plan'}
                </Button>
              </form>
            )}

            {activeTab === 'meal' && (
              <form onSubmit={submitMeal} className="space-y-4">
                <div>
                   <label className="text-sm text-gray-400">Diet Type</label>
                  <select
                    className="w-full rounded-md border border-gray-700 bg-black py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    value={mealForm.dietType}
                    onChange={(e) => setMealForm({...mealForm, dietType: e.target.value})}
                  >
                    <option>Balanced</option>
                    <option>Keto</option>
                    <option>Vegan</option>
                    <option>Paleo</option>
                    <option>High Protein</option>
                  </select>
                </div>
                <div>
                   <label className="text-sm text-gray-400">Calories (Target)</label>
                   <Input 
                    type="number"
                    value={mealForm.calories}
                    onChange={(e) => setMealForm({...mealForm, calories: e.target.value})}
                    required
                  />
                </div>
                 <div>
                   <label className="text-sm text-gray-400">Preferences / Allergies</label>
                   <Input 
                    placeholder="No nuts, love chicken..."
                    value={mealForm.preferences}
                    onChange={(e) => setMealForm({...mealForm, preferences: e.target.value})}
                  />
                </div>
                 <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="animate-spin" /> : 'Generate Menu'}
                </Button>
              </form>
            )}

            {activeTab === 'exercise' && (
              <form onSubmit={submitExercise} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Target Body Part</label>
                   <Input 
                    placeholder="e.g. Chest, Lower Back, Glutes"
                    value={exerciseForm.bodyPart}
                    onChange={(e) => setExerciseForm({...exerciseForm, bodyPart: e.target.value})}
                    required
                  />
                </div>
                 <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="animate-spin" /> : 'Find Exercises'}
                </Button>
              </form>
            )}

             {activeTab === 'height' && (
              <form onSubmit={submitHeight} className="space-y-4">
                 <div className="border-l-4 border-secondary pl-4 mb-4">
                   <h3 className="text-lg font-bold text-white">Growth Parameters</h3>
                   <p className="text-sm text-gray-400">Maximize your genetic potential.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-1">Current Height (cm/ft)</label>
                        <Input 
                            placeholder="e.g. 5'9 or 175cm" 
                            value={heightForm.currentHeight} 
                            onChange={(e) => setHeightForm({...heightForm, currentHeight: e.target.value})}
                            required
                        />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-300 block mb-1">Age</label>
                        <Input 
                            type="number" 
                            placeholder="e.g. 18" 
                            value={heightForm.age} 
                            onChange={(e) => setHeightForm({...heightForm, age: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1">Gender</label>
                   <select
                    className="w-full rounded-md border border-gray-700 bg-black py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    value={heightForm.gender}
                    onChange={(e) => setHeightForm({...heightForm, gender: e.target.value})}
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                 <p className="text-xs text-gray-500 italic">
                  Note: Genetics play the largest role. This guide focuses on maximizing your remaining natural potential through lifestyle factors.
                </p>

                 <Button type="submit" disabled={loading} className="w-full bg-secondary text-black hover:bg-secondary/90">
                  {loading ? <Loader2 className="animate-spin" /> : 'Generate Growth Plan'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="md:col-span-2 bg-gray-900 border-gray-800 min-h-[500px]">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Brain className="text-primary" />
                AI Analysis Result
             </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white max-w-none overflow-y-auto max-h-[600px] p-6 bg-black/30 rounded-lg border border-gray-800">
            <div id="ai-result-content">
              {renderContent()}
            </div>
            
            {result && !loading && (
                <div className="mt-6 flex justify-end">
                    <Button onClick={downloadPDF} variant="outline" className="text-gray-400 hover:text-white border-gray-700">
                        <Download className="w-4 h-4 mr-2" /> Download Plan (PDF)
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICoach;
