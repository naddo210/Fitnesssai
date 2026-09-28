import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Progress = () => {
    const [weightHistory, setWeightHistory] = useState([]);
    const [newWeight, setNewWeight] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get('/api/progress/weight');
            setWeightHistory(data.map(item => ({
                ...item,
                formattedDate: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            })));
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogWeight = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/progress/weight', { weight: Number(newWeight) });
            const newItem = {
                ...data,
                formattedDate: new Date(data.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            };
            setWeightHistory([...weightHistory, newItem].sort((a,b) => new Date(a.date) - new Date(b.date)));
            setNewWeight('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Progress Tracking</h2>
                    <p className="text-gray-400">Visualize your journey.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2 bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle>Weight Progression</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weightHistory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="formattedDate" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="weight" 
                                    stroke="#8A2BE2" 
                                    strokeWidth={3}
                                    dot={{ fill: '#00FFFF', r: 4 }}
                                    activeDot={{ r: 6 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle>Log Weight</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogWeight} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">Current Weight (kg)</label>
                                <Input 
                                    type="number" 
                                    placeholder="0.0" 
                                    value={newWeight} 
                                    onChange={(e) => setNewWeight(e.target.value)} 
                                    required
                                    step="0.1"
                                />
                            </div>
                            <Button type="submit" className="w-full">Update Weight</Button>
                        </form>

                        <div className="mt-8 space-y-4">
                            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Recent Logs</h4>
                            <div className="space-y-2">
                                {weightHistory.slice().reverse().slice(0, 5).map((entry) => (
                                    <div key={entry._id} className="flex justify-between items-center text-sm p-2 rounded bg-gray-950">
                                        <span className="text-gray-300">{entry.formattedDate}</span>
                                        <span className="font-bold text-white">{entry.weight} kg</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Progress;
