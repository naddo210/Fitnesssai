import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ShieldCheck, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      if (data?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-dark bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>
      <Card className="z-10 w-full max-w-md border-gray-800 bg-black/85 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent italic">
            GYM GENIUS
          </CardTitle>
          <p className="text-center text-gray-400 text-sm">Athletic & Admin Access Portal</p>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-center">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="mb-1 block text-xs font-semibold text-gray-300 uppercase tracking-wider">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/70 border-gray-700"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full font-bold text-base h-11 bg-primary hover:bg-primary/90 text-white shadow-lg">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {loading ? 'AUTHENTICATING...' : 'ENTER PROTOCOL'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-800/80 flex flex-col items-center gap-3 text-xs text-gray-400">
            <div>
              Don't have an athlete profile?{' '}
              <Link to="/register" className="text-primary hover:underline font-semibold">
                Register Free
              </Link>
            </div>
            
            <div className="flex items-center gap-4 text-gray-500 text-[11px]">
              <Link to="/privacy-policy" className="hover:text-gray-300 transition">
                Privacy Policy
              </Link>
              <span>•</span>
              <span className="flex items-center gap-1 text-purple-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Ready
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
