import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Droplets, Flame, Beef, Plus, Save, Loader2 } from "lucide-react";

const NutritionTracker = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [date] = useState(new Date().toISOString().split('T')[0]); // Today's date YYYY-MM-DD
  
  const [form, setForm] = useState({
    calories: 0,
    protein: 0,
    water: 0
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLog();
  }, []);

  const fetchLog = async () => {
    try {
      const { data } = await axios.get(`/api/nutrition?date=${date}`);
      setForm({
        calories: data.calories,
        protein: data.protein,
        water: data.water
      });
    } catch (error) {
      console.error("Failed to fetch nutrition log", error);
    } finally {
        setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await axios.post('/api/nutrition', {
        date,
        ...form
      });
      setMessage('Progress saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Failed to save", error);
      setMessage('Error saving.');
    } finally {
      setSaving(false);
    }
  };

  const incrementWater = () => setForm(prev => ({ ...prev, water: prev.water + 1 }));
  const decrementWater = () => setForm(prev => ({ ...prev, water: Math.max(0, prev.water - 1) }));

  if (loading) return <div className="p-8 text-center text-gray-400"><Loader2 className="w-8 h-8 animate-spin mx-auto"/> Loading tracker...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-bold text-white mb-2">My Nutrition</h2>
           <p className="text-gray-400">Track your daily essentials. Simplicity is key.</p>
        </div>
        <div className="text-right">
            <span className="text-sm text-gray-500 font-mono">{date}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Calories Card */}
        <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Flame className="w-5 h-5" /> Calories
                </CardTitle>
                <CardDescription>Daily Energy Intake</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-white mb-6 text-center">
                    {form.calories} <span className="text-sm text-gray-500 font-normal">kcal</span>
                </div>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setForm(f => ({...f, calories: f.calories + 100}))} className="flex-1">+100</Button>
                        <Button variant="outline" size="sm" onClick={() => setForm(f => ({...f, calories: f.calories + 250}))} className="flex-1">+250</Button>
                        <Button variant="outline" size="sm" onClick={() => setForm(f => ({...f, calories: f.calories + 500}))} className="flex-1">+500</Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Custom:</span>
                        <Input 
                            type="number" 
                            value={form.calories} 
                            onChange={(e) => setForm({...form, calories: Number(e.target.value)})}
                            className="h-8"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Protein Card */}
        <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                    <Beef className="w-5 h-5" /> Protein
                </CardTitle>
                <CardDescription>Muscle Building Fuel</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-white mb-6 text-center">
                    {form.protein} <span className="text-sm text-gray-500 font-normal">g</span>
                </div>
                <div className="space-y-4">
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setForm(f => ({...f, protein: f.protein + 5}))} className="flex-1">+5g</Button>
                        <Button variant="outline" size="sm" onClick={() => setForm(f => ({...f, protein: f.protein + 20}))} className="flex-1">+20g</Button>
                        <Button variant="outline" size="sm" onClick={() => setForm(f => ({...f, protein: f.protein + 30}))} className="flex-1">+30g</Button>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Custom:</span>
                        <Input 
                            type="number" 
                            value={form.protein} 
                            onChange={(e) => setForm({...form, protein: Number(e.target.value)})}
                             className="h-8"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Water Card */}
        <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Droplets className="w-5 h-5" /> Water
                </CardTitle>
                <CardDescription>Hydration (Glasses)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-white mb-6 text-center">
                    {form.water} <span className="text-sm text-gray-500 font-normal">glasses</span>
                </div>
                
                <div className="flex justify-center gap-4 mb-4">
                     <Button 
                        size="icon" 
                        variant="outline"
                        className="h-12 w-12 rounded-full border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                        onClick={decrementWater}
                    >
                        -
                    </Button>
                    <Button 
                        size="icon" 
                        className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                        onClick={incrementWater}
                    >
                        <Plus className="w-6 h-6" />
                    </Button>
                </div>
                <div className="text-center text-xs text-blue-300">
                    Target: 8 glasses/day
                </div>
            </CardContent>
        </Card>

      </div>

      <div className="flex justify-end pt-4">
        {message && <span className="mr-4 text-green-400 animate-pulse self-center">{message}</span>}
        <Button size="lg" onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 min-w-[150px]">
            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Log
        </Button>
      </div>

    </div>
  );
};

export default NutritionTracker;
