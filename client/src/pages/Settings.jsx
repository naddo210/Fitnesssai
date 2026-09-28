import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import axios from 'axios';
import { User, Shield, LogOut } from 'lucide-react';

const Settings = () => {
  const { user, login } = useAuth(); // Re-fetch or update context might be needed
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [fitnessLevel, setFitnessLevel] = useState(user?.fitnessLevel || 'Beginner');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setFitnessLevel(user.fitnessLevel);
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        // We didn't explicitly make an update profile endpoint, but we can assume one exists or just show success for demo
        // For real app: await axios.put('/api/auth/profile', { name, fitnessLevel });
        // Since I didn't verify if I made a PUT /profile, let's just simulate or add it if strictly needed.
        // Actually, I only made GET /profile. 
        // I will just show a "Feature coming soon" or quickly add PUT /profile if I want perfection.
        // Given time, I'll just simulate it or log it.
        // Wait, User requirements said "Update name, Update fitness level". I should implement it.
        // I will add PUT /profile to authController backend now to be complete.
        
        await axios.put('/api/auth/profile', { name, email, fitnessLevel });
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
    } catch (error) {
        setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white">Settings</h2>
        <p className="text-gray-400">Manage your account preferences.</p>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className={`p-3 mb-4 rounded text-center ${message.includes('success') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Email Address</label>
              <Input value={email} disabled className="opacity-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Fitness Level</label>
               <select
                className="w-full rounded-md border border-gray-700 bg-black py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800 border-red-900/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <Shield className="text-red-500" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
           <Button variant="outline" className="w-full border-red-500/50 text-red-500 hover:bg-red-950">
             Change Password
           </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
