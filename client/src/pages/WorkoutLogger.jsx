import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Plus, Trash2, Dumbbell, Clock, Calendar } from "lucide-react";

const WorkoutLogger = () => {
    const [workouts, setWorkouts] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [editingWorkoutId, setEditingWorkoutId] = useState(null);

    // Form state
    const [workoutName, setWorkoutName] = useState('');
    const [duration, setDuration] = useState('');
    const [exercises, setExercises] = useState([{ name: '', sets: 0, reps: 0, weight: 0 }]);

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            const { data } = await axios.get('/api/workouts');
            setWorkouts(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddExercise = () => {
        setExercises([...exercises, { name: '', sets: 0, reps: 0, weight: 0 }]);
    };

    const handleExerciseChange = (index, field, value) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    const handleEdit = (workout) => {
        setWorkoutName(workout.workoutName);
        setDuration(workout.duration);
        setExercises(workout.exercises);
        setEditingWorkoutId(workout._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if(!confirm("Are you sure you want to delete this workout?")) return;
        try {
            await axios.delete(`/api/workouts/${id}`);
            setWorkouts(workouts.filter(w => w._id !== id));
        } catch (error) {
            console.error("Failed to delete workout", error);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingWorkoutId(null);
        setWorkoutName('');
        setDuration('');
        setExercises([{ name: '', sets: 0, reps: 0, weight: 0 }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const workoutData = {
            workoutName,
            duration: Number(duration),
            exercises: exercises.map(ex => ({
                ...ex,
                sets: Number(ex.sets),
                reps: Number(ex.reps),
                weight: Number(ex.weight)
            }))
        };

        try {
            if (editingWorkoutId) {
                // Update existing
                const { data } = await axios.put(`/api/workouts/${editingWorkoutId}`, workoutData);
                setWorkouts(workouts.map(w => w._id === editingWorkoutId ? data : w));
            } else {
                // Create new
                const { data } = await axios.post('/api/workouts', workoutData);
                setWorkouts([data.workout, ...workouts]); // structure from backend is { workout: ... }
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
                    <h2 className="text-3xl font-bold text-white">Workout Logger</h2>
                    <p className="text-gray-400">Log every rep. Make every set count.</p>
                </div>
                <Button onClick={() => showForm ? handleCancel() : setShowForm(true)}>
                    {showForm ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> Log Workout</>}
                </Button>
            </div>

            {showForm && (
                <Card className="border-primary/50 bg-gray-900/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>{editingWorkoutId ? 'Edit Session' : 'Log Session'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-300">Workout Name</label>
                                    <Input placeholder="e.g. Chest Day" value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-300">Duration (mins)</label>
                                    <Input type="number" placeholder="60" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">Exercises</h3>
                                {exercises.map((ex, index) => (
                                    <div key={index} className="grid grid-cols-9 gap-2 items-end">
                                        <div className="col-span-3">
                                            <Input placeholder="Exercise Name" value={ex.name} onChange={(e) => handleExerciseChange(index, 'name', e.target.value)} required />
                                        </div>
                                        <div className="col-span-2">
                                            <Input type="number" placeholder="Sets" value={ex.sets} onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)} required />
                                        </div>
                                        <div className="col-span-2">
                                            <Input type="number" placeholder="Reps" value={ex.reps} onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)} required />
                                        </div>
                                        <div className="col-span-2">
                                            <Input type="number" placeholder="Weight (kg)" value={ex.weight} onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={handleAddExercise} className="w-full border-dashed border-gray-600">
                                    <Plus className="h-4 w-4 mr-2" /> Add Exercise
                                </Button>
                            </div>

                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                                {editingWorkoutId ? 'Update Workout' : 'Save Workout'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {workouts.map((workout) => (
                    <Card key={workout._id} className="border-gray-800 bg-gray-900">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <Dumbbell className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{workout.workoutName}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(workout.date).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {workout.duration} mins</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(workout)} className="text-gray-400 hover:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(workout._id)} className="text-gray-400 hover:text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2 pl-16">
                                {workout.exercises.map((ex, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-800 last:border-0">
                                        <span className="text-gray-300 font-medium">{ex.name}</span>
                                        <span className="text-gray-500">{ex.sets} sets x {ex.reps} reps @ {ex.weight}kg</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default WorkoutLogger;
