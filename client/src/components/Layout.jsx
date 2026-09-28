import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Target, Dumbbell, TrendingUp, User, LogOut, 
  Menu, X, Brain, Utensils, Trophy, Swords, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Goals', icon: Target, path: '/goals' },
    { name: 'Workout Logger', icon: Dumbbell, path: '/workouts' },
    { name: 'Nutrition', icon: Utensils, path: '/nutrition' },
    { name: 'Challenges', icon: Swords, path: '/challenges' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { name: 'Progress', icon: TrendingUp, path: '/progress' },
    { name: 'AI Coach', icon: Brain, path: '/ai-coach' },
    { name: 'Settings', icon: User, path: '/settings' },
  ];

  // If logged in as admin, dynamically show Admin Portal
  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin Portal', icon: ShieldCheck, path: '/admin', isAdmin: true });
  }

  return (
    <div className="flex h-screen bg-dark text-white overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-800 bg-gray-950">
        <div className="p-6 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
              GYM GENIUS
            </h1>
          </Link>
          {user?.role === 'admin' && (
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-500/40">
              Admin
            </span>
          )}
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium",
                  isActive
                    ? item.isAdmin 
                      ? "bg-purple-900/40 text-purple-300 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                      : "bg-primary/20 text-primary font-semibold border border-primary/30"
                    : item.isAdmin
                      ? "text-purple-400 hover:bg-purple-950/40 hover:text-purple-200"
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                )
              }
            >
              <item.icon className={cn("w-4 h-4", item.isAdmin && "text-purple-400")} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800/80 space-y-2">
          <div className="flex items-center justify-between px-2 text-[11px] text-gray-500">
            <Link to="/privacy-policy" className="hover:text-gray-300 transition">
              Privacy Policy
            </Link>
            <span className="truncate max-w-[100px] text-gray-400 font-mono text-[10px]">
              {user?.email?.split('@')[0]}
            </span>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300 text-sm h-9" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold italic bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GYM GENIUS
            </h1>
            {user?.role === 'admin' && (
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-900 text-purple-300">
                Admin
              </span>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </header>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-gray-950/98 md:hidden flex flex-col p-6 animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-2xl font-bold italic bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                GYM GENIUS
              </h1>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X />
              </Button>
            </div>
            <nav className="flex-1 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    item.isAdmin ? "text-purple-300 bg-purple-950/40" : "text-gray-300 hover:text-primary hover:bg-gray-900"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-gray-800 space-y-3">
              <Link 
                to="/privacy-policy" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs text-gray-500 block text-center hover:text-gray-300"
              >
                Privacy Policy
              </Link>
              <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-950" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-black/50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
