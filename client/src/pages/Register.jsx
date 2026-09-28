import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ShieldCheck, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('Beginner');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminField, setShowAdminField] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await register(name, email, password, fitnessLevel, adminCode || undefined);
      if (data?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-dark bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm pointer-events-none"></div>
      
      <Card className="z-10 w-full max-w-md border-gray-800 bg-black/85 backdrop-blur-md shadow-2xl my-6">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent italic">
            GYM GENIUS
          </CardTitle>
          <p className="text-gray-400 text-sm mt-1">Initialize Athlete Protocol</p>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-center">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-300 uppercase tracking-wider">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-black/70 border-gray-700"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-300 uppercase tracking-wider">Email Address</label>
              <Input
                type="email"
                placeholder="athlete@gymgenius.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/70 border-gray-700"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-300 uppercase tracking-wider">Password (min 6 chars)</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-black/70 border-gray-700"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-300 uppercase tracking-wider">Fitness Experience</label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-700 bg-black/70 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
              >
                <option value="Beginner">Beginner (0 - 1 years)</option>
                <option value="Intermediate">Intermediate (1 - 3 years)</option>
                <option value="Advanced">Advanced (3+ years)</option>
              </select>
            </div>

            {/* Optional Admin Passcode Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdminField(!showAdminField)}
                className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {showAdminField ? 'Hide Admin Code' : 'Have an Admin Passcode?'}
              </button>

              {showAdminField && (
                <div className="mt-2 animate-in fade-in">
                  <Input
                    type="password"
                    placeholder="Enter Admin Secret Code..."
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="bg-purple-950/30 border-purple-500/40 text-xs font-mono placeholder:text-gray-500"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Passcode grants global administrator access.</p>
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full font-bold text-base h-11 bg-primary hover:bg-primary/90 text-white shadow-lg mt-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {loading ? 'INITIALIZING...' : 'CREATE ACCOUNT'}
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-800/80 flex flex-col items-center gap-2.5 text-xs text-gray-400">
            <div>
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold">
                Sign In
              </Link>
            </div>

            <div className="text-[11px] text-gray-500">
              By joining, you agree to our{' '}
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white underline">
                Privacy Policy
              </Link>.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
