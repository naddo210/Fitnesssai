import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Target, Dumbbell, TrendingUp, User, LogOut, Menu, X, Brain, Utensils, Trophy, Swords } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Mock logout for now, will connect to context later
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
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

  return (
    <div className="flex h-screen bg-dark text-white overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-800 bg-gray-950">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
            GYM GENIUS
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  isActive
                    ? "bg-primary/20 text-primary font-semibold"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
          <h1 className="text-xl font-bold italic bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            GYM GENIUS
          </h1>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </header>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-gray-950/95 md:hidden flex flex-col p-4 animate-in fade-in slide-in-from-top-10">
            <div className="flex justify-between items-center mb-8">
               <h1 className="text-2xl font-bold italic bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                GYM GENIUS
              </h1>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X />
              </Button>
            </div>
            <nav className="flex-1 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 text-lg font-medium text-gray-300 hover:text-primary transition-colors border-b border-gray-800"
                >
                  <item.icon className="w-6 h-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <Button variant="outline" className="mt-8 w-full border-red-500 text-red-500 hover:bg-red-950" onClick={handleLogout}>
              Logout
            </Button>
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
