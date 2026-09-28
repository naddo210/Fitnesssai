import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [unit, setUnit] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data } = await axios.get('/api/goals');
      setGoals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/goals', {
        title,
        targetValue,
        unit,
        currentValue: 0,
      });
      setGoals([...goals, data]);
      setShowForm(false);
      setTitle('');
      setTargetValue('');
      setUnit('');
    } catch (error) {
      console.error(error);
    }
  };

  const [editingGoalId, setEditingGoalId] = useState(null);

  const handleEditGoal = (goal) => {
    setTitle(goal.title);
    setTargetValue(goal.targetValue);
    setUnit(goal.unit);
    setEditingGoalId(goal._id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoalId(null);
    setTitle('');
    setTargetValue('');
    setUnit('');
  };

  const handleDeleteGoal = async (id) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await axios.delete(`/api/goals/${id}`);
        setGoals(goals.filter(g => g._id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoalId) {
           const { data } = await axios.put(`/api/goals/${editingGoalId}`, {
            title,
            targetValue,
            unit,
          });
          setGoals(goals.map(g => g._id === editingGoalId ? data : g));
      } else {
          const { data } = await axios.post('/api/goals', {
            title,
            targetValue,
            unit,
            currentValue: 0,
          });
          setGoals([...goals, data]);
      }
      handleCancel();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Your Goals</h2>
          <p className="text-gray-400">Track your progress and shatter limits.</p>
        </div>
        <Button onClick={() => showForm ? handleCancel() : setShowForm(true)}>
          {showForm ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> Add Goal</>}
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/50 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{editingGoalId ? 'Edit Goal' : 'New Goal'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4 items-end">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-300">Goal Title</label>
                <Input 
                  placeholder="e.g. Bench Press" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Target Value</label>
                <Input 
                  type="number" 
                  placeholder="100" 
                  value={targetValue} 
                  onChange={(e) => setTargetValue(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Unit</label>
                <Input 
                  placeholder="kg, lbs, km" 
                  value={unit} 
                  onChange={(e) => setUnit(e.target.value)} 
                  required 
                />
              </div>
              <Button type="submit" className="md:col-span-4 bg-primary hover:bg-primary/90">
                {editingGoalId ? 'Update Goal' : 'Create Goal'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-gray-400">Loading goals...</p>
        ) : goals.length === 0 ? (
          <p className="text-gray-400 col-span-3 text-center py-10">No goals set yet. Start today!</p>
        ) : (
          goals.map((goal) => (
            <Card key={goal._id} className="relative overflow-hidden group border-gray-800 bg-gray-900 transition-all hover:border-primary/50">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">{goal.title}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleEditGoal(goal)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteGoal(goal._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-3xl font-bold text-white">{goal.currentValue}</span>
                  <span className="text-sm text-gray-400 mb-1">/ {goal.targetValue} {goal.unit}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-secondary" />
                  {Math.round((goal.currentValue / goal.targetValue) * 100)}% Complete
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Goals;
