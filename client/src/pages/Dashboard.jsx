import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { 
  ArrowRight, Dumbbell, Target, Flame, Calendar, Loader2, 
  Sparkles, Quote, RefreshCw, Zap, Award, Activity 
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [motivation, setMotivation] = useState(() => {
    try {
      const cached = localStorage.getItem('gymgenius_daily_quote');
      return cached ? JSON.parse(cached) : { 
        text: "Action produces results. Inaction produces excuses. Choose your path.", 
        author: "GymGenius Athlete" 
      };
    } catch {
      return { 
        text: "Action produces results. Inaction produces excuses. Choose your path.", 
        author: "GymGenius Athlete" 
      };
    }
  });
  const [loading, setLoading] = useState(true);
  const [refreshingQuote, setRefreshingQuote] = useState(false);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/dashboard');
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMotivation = async (forceAI = false) => {
    if (forceAI) setRefreshingQuote(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const { data } = await axios.post('/api/ai/motivation', { 
        name: userInfo.name,
        forceAI
      });
      const quoteObj = {
        text: data.quote || data.result,
        author: data.author || (forceAI ? `${userInfo.name ? userInfo.name + "'s " : ""}AI Coach` : "Daily Motivation")
      };
      setMotivation(quoteObj);
      localStorage.setItem('gymgenius_daily_quote', JSON.stringify(quoteObj));
    } catch (error) {
      console.error("Failed to fetch motivation", error);
    } finally {
      setRefreshingQuote(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const cached = localStorage.getItem('gymgenius_daily_quote');
    if (!cached) {
      fetchMotivation(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <Flame className="w-5 h-5 text-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-400 text-sm font-medium animate-pulse">Syncing performance telemetry...</p>
      </div>
    );
  }

  const statCards = [
    { 
      label: "Active Targets", 
      value: stats?.activeGoals || 0, 
      unit: "Goals Set",
      icon: Target, 
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20 shadow-cyan-500/10" 
    },
    { 
      label: "Workouts Completed", 
      value: stats?.totalWorkouts || 0, 
      unit: "Logged Sessions",
      icon: Dumbbell, 
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20 shadow-purple-500/10" 
    },
    { 
      label: "Current Streak", 
      value: stats?.streak || 0, 
      unit: "Days Unbroken",
      icon: Flame, 
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20 shadow-amber-500/10" 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            COMMAND <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CENTER</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">Real-time biometrics, workout logging, and neural recommendations.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="font-bold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/25">
            <Link to="/workouts">
              <Dumbbell className="w-4 h-4 mr-2" /> Quick Log
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="font-semibold border-secondary/40 text-secondary hover:bg-secondary/10">
            <Link to="/ai-coach">
              <Sparkles className="w-4 h-4 mr-1.5" /> AI Coach
            </Link>
          </Button>
        </div>
      </div>

      {/* Motivation Banner */}
      <div className="bg-gradient-to-r from-red-950/60 via-[#18101a] to-[#0d0d16] border border-orange-500/30 p-6 md:p-7 rounded-2xl relative overflow-hidden shadow-2xl backdrop-blur-md transition-all hover:border-orange-500/50">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Flame className="w-44 h-44 text-orange-500 -mr-6 -mt-6" />
        </div>
        <div className="relative z-10 space-y-3.5 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-orange-400 bg-orange-500/15 border border-orange-500/30 px-2.5 py-1 rounded-full">
              <Flame className="w-3.5 h-3.5 fill-orange-400" /> QUOTE OF THE DAY
            </div>
            <button
              onClick={() => fetchMotivation(true)}
              disabled={refreshingQuote}
              title="Generate new AI motivation quote"
              className="flex items-center gap-1.5 text-xs font-semibold text-orange-300 hover:text-white bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              {refreshingQuote ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" /> AI Boost
                </>
              )}
            </button>
          </div>

          <div className="flex items-start gap-4">
            <Quote className="w-8 h-8 text-orange-500/40 shrink-0 mt-1 rotate-180" />
            <div>
              <p className="text-lg md:text-2xl font-black text-white tracking-wide leading-snug">
                {motivation.text}
              </p>
              {motivation.author && (
                <p className="text-xs md:text-sm text-orange-300/80 font-semibold mt-2.5 flex items-center gap-2">
                  <span className="w-5 h-px bg-orange-500/50"></span>
                  {motivation.author}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.label} className="group hover:-translate-y-1 transition-transform border-gray-800/80 hover:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {stat.label}
              </span>
              <div className={`p-2.5 rounded-xl border ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-black text-white tracking-tight">{stat.value}</div>
              <p className="text-xs text-gray-500 font-medium mt-1">{stat.unit}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grid: Recent Activity & AI Coach Banner */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-gray-800/80">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-800/60">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" /> Recent Activity
              </CardTitle>
              <CardDescription className="text-xs">Your logged training history</CardDescription>
            </div>
            <Link to="/workouts" className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
               <div className="space-y-3">
                  {stats.recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-gray-800/80 hover:border-gray-700 transition-colors">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-800/50 flex items-center justify-center shrink-0">
                                  <Dumbbell className="w-5 h-5 text-purple-400" />
                              </div>
                              <div>
                                  <p className="text-white font-bold text-sm">{activity.workoutName || "Workout Session"}</p>
                                  <div className="flex items-center text-xs text-gray-500 gap-2 mt-0.5">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(activity.date).toLocaleDateString()}
                                  </div>
                              </div>
                          </div>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-900 text-cyan-300 border border-gray-800">
                            {activity.duration} min
                          </span>
                      </div>
                  ))}
               </div>
            ) : (
                <div className="text-gray-400 text-sm py-10 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 rounded-full bg-gray-900 border border-gray-800">
                    <Dumbbell className="w-6 h-6 text-gray-600" />
                  </div>
                  <p className="font-medium text-gray-300">No workout records found.</p>
                  <p className="text-xs text-gray-500">Log your first training session to activate analytics.</p>
                </div>
            )}
            
            <Button asChild className="mt-4 w-full" variant="outline">
              <Link to="/workouts">
                 Log Training Session <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-purple-500/30 bg-gradient-to-br from-[#1c122e]/90 via-[#100d1c]/90 to-black relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Brain className="w-40 h-40 text-purple-400 -mr-6 -mt-6" />
          </div>
          <CardHeader className="relative z-10 pb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold uppercase tracking-wider border border-purple-500/30 w-fit mb-2">
              <Zap className="w-3 h-3 fill-purple-400" /> Neural Training Engine
            </div>
            <CardTitle className="text-xl font-black text-white">AI COACH PROTOCOL</CardTitle>
            <CardDescription className="text-xs text-purple-200/70">
              Need fresh progressive overload splits or tailored macro breakdown? Consult your neural coach.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 pt-4 space-y-4">
            <div className="p-3 rounded-xl bg-black/40 border border-purple-800/40 text-xs text-gray-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-secondary">
                <Sparkles className="w-3.5 h-3.5" /> Capabilities:
              </div>
              <p>• 7-Day Hypertrophy & Strength Splits</p>
              <p>• Macro-Targeted Daily Meal Plans</p>
              <p>• Biomechanics & In-App YouTube Form Videos</p>
            </div>

            <Link to="/ai-coach" className="block w-full">
              <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold text-sm shadow-lg shadow-primary/30">
                  <Sparkles className="w-4 h-4 mr-2 text-secondary" /> Open AI Hub
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
