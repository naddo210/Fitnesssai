import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import WorkoutLogger from './pages/WorkoutLogger';
import Progress from './pages/Progress';
import AIWorkoutCoach from './pages/AIWorkoutCoach';
import NutritionTracker from './pages/NutritionTracker';
import Leaderboard from './pages/Leaderboard';
import Challenges from './pages/Challenges';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
             <Route path="/" element={<Dashboard />} />
             <Route path="/goals" element={<Goals />} />
             <Route path="/workouts" element={<WorkoutLogger />} />
             <Route path="/progress" element={<Progress />} />
             <Route path="/nutrition" element={<NutritionTracker />} />
             <Route path="/leaderboard" element={<Leaderboard />} />
             <Route path="/challenges" element={<Challenges />} />
             <Route path="/ai-coach" element={<AIWorkoutCoach />} />
             <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
