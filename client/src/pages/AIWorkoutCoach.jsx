import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Brain, Utensils, Search, Ruler, Loader2, Download, Play, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';

const AICoach = () => {
  const [activeTab, setActiveTab] = useState('workout');
  const [loading, setLoading] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [result, setResult] = useState('');
  const [openVideoIdx, setOpenVideoIdx] = useState(null);

  // Forms State
  const [workoutForm, setWorkoutForm] = useState({ fitnessLevel: 'Beginner', goals: '', pastHistory: '', injuries: '' });
  const [mealForm, setMealForm] = useState({ dietType: 'Balanced', calories: '2000', preferences: '' });
  const [exerciseForm, setExerciseForm] = useState({ bodyPart: '' });
  const [heightForm, setHeightForm] = useState({ currentHeight: '', age: '', gender: 'Male' });
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResult(null);
    setOpenVideoIdx(null);
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
    setResult(null);
    setOpenVideoIdx(null);
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
    e.preventDefault();
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

  const downloadPDF = () => {
    if (!result) return;
    setExportingPdf(true);

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 16;
      const contentWidth = pageWidth - (margin * 2);
      let y = margin;

      // Dark Banner Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 28, 'F');

      // Title & Branding
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('GYM GENIUS AI', margin, 13);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(`PERFORMANCE PROTOCOL • ${activeTab.toUpperCase()}`, margin, 20);

      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      doc.text(`Date: ${dateStr}`, pageWidth - margin - 35, 13);

      // Accent border
      doc.setDrawColor(139, 92, 246); // purple-500
      doc.setLineWidth(1.2);
      doc.line(0, 28, pageWidth, 28);

      y = 38;

      const checkPageBreak = (neededHeight) => {
        if (y + neededHeight > pageHeight - 18) {
          doc.addPage();
          y = 20;
        }
      };

      if (activeTab === 'exercise' && Array.isArray(result)) {
        result.forEach((ex, idx) => {
          checkPageBreak(25);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(139, 92, 246);
          doc.text(`${idx + 1}. ${ex.name || 'Exercise'}`, margin, y);
          y += 6;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(31, 41, 55);

          if (ex.formCues) {
            checkPageBreak(10);
            doc.setFont('helvetica', 'bold');
            doc.text('Form Cues: ', margin, y);
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(ex.formCues, contentWidth - 22);
            doc.text(lines, margin + 22, y);
            y += (lines.length * 4.5) + 2.5;
          }

          if (ex.commonMistakes) {
            checkPageBreak(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(220, 38, 38);
            doc.text('Mistakes: ', margin, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(31, 41, 55);
            const lines = doc.splitTextToSize(ex.commonMistakes, contentWidth - 22);
            doc.text(lines, margin + 22, y);
            y += (lines.length * 4.5) + 2.5;
          }

          if (ex.injuryRisks) {
            checkPageBreak(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(217, 119, 6);
            doc.text('Injury Risks: ', margin, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(31, 41, 55);
            const lines = doc.splitTextToSize(ex.injuryRisks, contentWidth - 22);
            doc.text(lines, margin + 22, y);
            y += (lines.length * 4.5) + 2.5;
          }
          y += 3;
        });
      } else {
        const rawText = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
        const lines = rawText.split('\n');

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line) {
            y += 2.5;
            continue;
          }

          if (line.startsWith('#')) {
            checkPageBreak(14);
            const headerText = line.replace(/^#+\s*/, '').replace(/\*\*/g, '');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12.5);
            doc.setTextColor(15, 23, 42);
            doc.text(headerText, margin, y);
            y += 6.5;
          } else if (line.startsWith('|')) {
            if (line.includes('---')) continue;
            checkPageBreak(8);
            const cells = line.split('|').map(c => c.trim().replace(/\*\*/g, '')).filter(Boolean);
            const colWidth = contentWidth / (cells.length || 1);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(51, 65, 85);
            cells.forEach((cell, i) => {
              const truncated = doc.splitTextToSize(cell, colWidth - 2)[0] || '';
              doc.text(truncated, margin + (i * colWidth), y);
            });
            y += 5.5;
          } else {
            checkPageBreak(7);
            const clean = line.replace(/\*\*/g, '');
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(51, 65, 85);
            const split = doc.splitTextToSize(clean, contentWidth);
            split.forEach(s => {
              checkPageBreak(4.5);
              doc.text(s, margin, y);
              y += 4.5;
            });
          }
        }
      }

      // Add footers with page numbers
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text('GymGenius AI • Confidential Training Protocol', margin, pageHeight - 8);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 8);
      }

      const fileDate = new Date().toISOString().split('T')[0];
      doc.save(`GymGenius_${activeTab}_plan_${fileDate}.pdf`);
    } catch (err) {
      console.error("PDF Export error:", err);
      // Resilient fallback: download markdown text file
      try {
        const textContent = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
        const blob = new Blob([textContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GymGenius_${activeTab}_plan.md`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (fallbackErr) {
        alert("Failed to export PDF. Please copy your plan text directly.");
      }
    } finally {
      setExportingPdf(false);
    }
  };

  // Helper to render content based on active tab and result type
  const renderContent = () => {
      if (loading) {
          return (
             <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
                <p className="font-semibold text-lg">Consulting GymGenius Neural Engine...</p>
                <p className="text-sm text-gray-500 mt-1">Generating personalized recommendations</p>
             </div>
          );
      }

      if (!result) {
          return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
               <Search className="h-16 w-16 mb-4 opacity-30 text-primary" />
               <p className="text-lg font-medium text-gray-300">Your AI Plan Awaits</p>
               <p className="text-sm text-gray-500 mt-1">Configure your parameters on the left and click Generate.</p>
            </div>
          );
      }

      // Special display for Exercise Finder tab with in-app YouTube iframe
      if (activeTab === 'exercise' && Array.isArray(result)) {
          return (
              <div className="space-y-6">
                  {result.map((ex, idx) => (
                      <div key={idx} className="p-5 bg-gray-800/90 rounded-xl border border-gray-700/80 shadow-lg">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                            <h3 className="text-xl font-bold text-secondary flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs flex items-center justify-center font-mono">
                                {idx + 1}
                              </span>
                              {ex.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => setOpenVideoIdx(openVideoIdx === idx ? null : idx)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 transition flex items-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              {openVideoIdx === idx ? 'Hide Video' : 'Watch Form Tutorial'}
                              {openVideoIdx === idx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          <div className="mb-2 text-sm text-gray-300 leading-relaxed">
                              <span className="font-semibold text-primary">Form Cues:</span> {ex.formCues}
                          </div>
                          <div className="mb-2 text-sm text-gray-300 leading-relaxed">
                              <span className="font-semibold text-red-400">Common Mistakes:</span> {ex.commonMistakes}
                          </div>
                          <div className="mb-3 text-sm text-gray-300 leading-relaxed">
                              <span className="font-semibold text-amber-400">⚠️ Injury Risks:</span> {ex.injuryRisks || "None listed"}
                          </div>

                          {/* In-App YouTube Iframe Player - Keeps user on page */}
                          {openVideoIdx === idx && (
                            <div className="mt-4 pt-3 border-t border-gray-700/60">
                              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1 font-medium">
                                <Play className="w-3 h-3 text-red-500" /> Embedded YouTube Form Guide:
                              </p>
                              <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-700 bg-black shadow-inner">
                                <iframe
                                  className="w-full h-full"
                                  src={`https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(ex.name + ' exercise proper form')}&autoplay=1`}
                                  title={`${ex.name} Form Guide`}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          )}
                      </div>
                  ))}
              </div>
          );
      }

      // Default string/markdown render for workout, nutrition, height
      return (
        <div className="prose prose-invert max-w-none prose-headings:text-secondary prose-h2:border-b prose-h2:border-gray-800 prose-h2:pb-2 prose-table:border prose-table:border-gray-800 prose-th:bg-gray-800 prose-th:p-2 prose-td:p-2 prose-td:border-t prose-td:border-gray-800">
          <ReactMarkdown>{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</ReactMarkdown>
        </div>
      );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent inline-block mb-2 tracking-tight">
          AI PERFORMANCE HUB
        </h2>
        <p className="text-gray-400">Next-gen intelligence tailored to your unique biology & training goals.</p>
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
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(138,43,226,0.5)]'
                : 'bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-gray-300'
            }`}
          >
            <tab.icon className={`h-8 w-8 mb-2 ${activeTab === tab.id ? 'text-secondary' : ''}`} />
            <span className="font-semibold text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Input Section */}
        <Card className="md:col-span-1 bg-gray-900 border-gray-800 h-fit shadow-xl">
          <CardHeader>
            <CardTitle>
              {activeTab === 'workout' && 'Workout Parameters'}
              {activeTab === 'meal' && 'Diet Preferences'}
              {activeTab === 'exercise' && 'Target Area'}
              {activeTab === 'height' && 'Growth Optimization'}
            </CardTitle>
            <CardDescription>Configure your AI profile</CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === 'workout' && (
              <form onSubmit={submitWorkout} className="space-y-4">
                <div className="border-l-4 border-primary pl-4 mb-4">
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider">Profile Information</h3>
                   <p className="text-xs text-gray-400">The more specific you are, the more personalized the split.</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1">Fitness Goals</label>
                  <textarea 
                    className="w-full rounded-md border border-gray-700 bg-black py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                    placeholder="e.g., Build lean muscle, lose 5kg body fat, improve stamina for running." 
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
                   <label className="text-sm font-medium text-gray-300 block mb-1">Past Workout History / Preferences (Optional)</label>
                   <textarea 
                    className="w-full rounded-md border border-gray-700 bg-black py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                    placeholder="e.g., 3-4 days a week, prefer dumbbells and barbell over machines."
                    value={workoutForm.pastHistory}
                    onChange={(e) => setWorkoutForm({...workoutForm, pastHistory: e.target.value})}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {loading ? 'Analyzing...' : 'Generate Plan'}
                </Button>
              </form>
            )}

            {activeTab === 'meal' && (
              <form onSubmit={submitMeal} className="space-y-4">
                <div>
                   <label className="text-sm text-gray-400 block mb-1">Diet Type</label>
                  <select
                    className="w-full rounded-md border border-gray-700 bg-black py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    value={mealForm.dietType}
                    onChange={(e) => setMealForm({...mealForm, dietType: e.target.value})}
                  >
                    <option>Balanced</option>
                    <option>High Protein</option>
                    <option>Keto</option>
                    <option>Vegan</option>
                    <option>Vegetarian</option>
                    <option>Paleo</option>
                  </select>
                </div>
                <div>
                   <label className="text-sm text-gray-400 block mb-1">Target Daily Calories</label>
                   <Input 
                    type="number"
                    value={mealForm.calories}
                    onChange={(e) => setMealForm({...mealForm, calories: e.target.value})}
                    required
                  />
                </div>
                <div>
                   <label className="text-sm text-gray-400 block mb-1">Preferences / Allergies</label>
                   <Input 
                    placeholder="e.g. No nuts, lactose intolerant, high egg intake"
                    value={mealForm.preferences}
                    onChange={(e) => setMealForm({...mealForm, preferences: e.target.value})}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {loading ? 'Crafting Menu...' : 'Generate Meal Plan'}
                </Button>
              </form>
            )}

            {activeTab === 'exercise' && (
              <form onSubmit={submitExercise} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Target Muscle Group</label>
                   <Input 
                    placeholder="e.g. Chest, Lats, Shoulders, Glutes, Calves"
                    value={exerciseForm.bodyPart}
                    onChange={(e) => setExerciseForm({...exerciseForm, bodyPart: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {loading ? 'Finding Movements...' : 'Find Exercises'}
                </Button>
              </form>
            )}

            {activeTab === 'height' && (
              <form onSubmit={submitHeight} className="space-y-4">
                 <div className="border-l-4 border-secondary pl-4 mb-4">
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider">Growth Optimization</h3>
                   <p className="text-xs text-gray-400">Lifestyle factors to maximize your genetic potential.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-1">Current Height</label>
                        <Input 
                            placeholder="e.g. 175cm / 5'9" 
                            value={heightForm.currentHeight} 
                            onChange={(e) => setHeightForm({...heightForm, currentHeight: e.target.value})}
                            required
                        />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-300 block mb-1">Age</label>
                        <Input 
                            type="number" 
                            placeholder="e.g. 19" 
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
                  Note: Genetics play the primary role. This regimen maximizes spinal decompression, posture, and deep sleep HGH production.
                </p>

                <Button type="submit" disabled={loading} className="w-full bg-secondary text-black hover:bg-secondary/90">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {loading ? 'Calculating...' : 'Generate Growth Plan'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="md:col-span-2 bg-gray-900 border-gray-800 min-h-[500px] flex flex-col shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800/80 pb-4">
             <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="text-primary w-5 h-5" />
                AI Analysis & Protocol
             </CardTitle>
             {result && !loading && (
                <Button 
                  onClick={downloadPDF} 
                  disabled={exportingPdf}
                  variant="outline" 
                  size="sm"
                  className="text-xs font-semibold text-gray-300 hover:text-white border-gray-700 hover:border-primary transition"
                >
                  {exportingPdf ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-primary" />
                  ) : (
                    <Download className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  )}
                  {exportingPdf ? 'Exporting PDF...' : 'Download PDF'}
                </Button>
             )}
          </CardHeader>
          <CardContent className="flex-1 p-6 overflow-y-auto max-h-[620px] bg-black/30 rounded-b-lg">
            <div id="ai-result-content" className="p-2">
              {renderContent()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICoach;
