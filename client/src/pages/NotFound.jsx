import { Link } from 'react-router-dom';
import { Dumbbell, Home, Brain, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-md mx-auto space-y-6">
        {/* Animated Dumbbell Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-purple-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(147,51,234,0.3)] animate-bounce duration-1000">
          <Dumbbell className="w-10 h-10 text-primary" />
        </div>

        {/* 404 Header */}
        <div className="space-y-2">
          <h1 className="text-7xl font-black tracking-widest bg-gradient-to-r from-primary via-purple-300 to-secondary bg-clip-text text-transparent italic">
            404
          </h1>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
            Protocol Not Found
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            The page you are looking for has been moved, removed, or never existed in the GymGenius neural database.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold">
            <Link to="/" className="flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Return to Dashboard
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto border-gray-800 text-gray-300 hover:text-white hover:border-gray-700">
            <Link to="/ai-coach" className="flex items-center justify-center gap-2">
              <Brain className="w-4 h-4 text-secondary" />
              AI Performance Hub
            </Link>
          </Button>
        </div>

        <div className="pt-8 text-xs text-gray-600">
          <Link to="/privacy-policy" className="hover:text-gray-400 underline underline-offset-4">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
