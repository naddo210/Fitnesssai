import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { 
  Loader2, Trophy, Flame, Dumbbell, Zap, Crown, 
  Sparkles, Award, TrendingUp, Info, CheckCircle2, AlertCircle 
} from "lucide-react";
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('points'); // 'points' | 'streak' | 'workouts'

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  const fetchLeaderboard = async (sortBy) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/leaderboard?sort=${sortBy}`);
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && data.leaderboard) {
        setUsers(data.leaderboard);
        if (data.currentUser) {
          setCurrentUserData(data.currentUser);
        }
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    } finally {
      setLoading(false);
    }
  };

  // Find logged-in user in list if not provided in payload
  const myStanding = currentUserData || users.find(u => u._id === authUser?._id);

  // Top 3 athletes for the podium
  const top1 = users[0];
  const top2 = users[1];
  const top3 = users[2];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Dynamic Daily Arena
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
          THE <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">LEADERBOARD</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
          Updated in real-time. Check in every day and log your workouts to increase your streak and climb the ranks.
        </p>
      </div>

      {/* Current User Standing Card */}
      {myStanding && (
        <div className="bg-gradient-to-r from-orange-950/40 via-gray-900 to-gray-900 border border-orange-500/30 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Flame className="w-40 h-40 text-orange-500 -mr-10 -mt-10" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold uppercase tracking-wider">
                  Your Standing
                </span>
                <span className="text-xs text-gray-400">Live Telemetry</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                {myStanding.name}
                <span className="text-xs font-normal text-gray-400 px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700">
                  {myStanding.fitnessLevel}
                </span>
              </h3>
              <p className="text-sm text-gray-300 flex items-center gap-1.5 pt-1">
                {myStanding.streakStatus === 'active_today' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Checked in today!</span> Daily streak extended.
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 font-medium">Active today.</span> Log a workout or stay active to boost XP!
                  </>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 text-center">
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3">
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Rank</div>
                <div className="text-xl md:text-2xl font-black text-amber-400">
                  #{myStanding.rank || '-'}
                </div>
              </div>
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3">
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Streak</div>
                <div className="text-xl md:text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
                  {myStanding.currentStreak || 0} <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                </div>
              </div>
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3">
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Workouts</div>
                <div className="text-xl md:text-2xl font-black text-cyan-400">
                  {myStanding.totalWorkouts || 0}
                </div>
              </div>
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3">
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total XP</div>
                <div className="text-xl md:text-2xl font-black text-yellow-400">
                  {myStanding.points || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Podium for Top 3 */}
      {users.length >= 3 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 items-end">
          {/* 2nd Place */}
          {top2 && (
            <div className="order-2 md:order-1 bg-gradient-to-b from-gray-800/80 to-gray-900 border border-gray-700/60 rounded-2xl p-5 text-center relative shadow-lg transform md:-translate-y-2">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-300/10 border border-slate-300/30 flex items-center justify-center text-2xl shadow-inner">
                🥈
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-400/20 text-slate-300 text-xs font-bold uppercase tracking-wider">
                Rank #2
              </span>
              <h4 className="text-lg font-bold text-white mt-2 truncate">{top2.name}</h4>
              <p className="text-xs text-gray-400">{top2.fitnessLevel}</p>
              <div className="mt-4 pt-3 border-t border-gray-800 flex justify-around text-xs">
                <div>
                  <div className="text-gray-400">Streak</div>
                  <div className="text-orange-400 font-bold flex items-center justify-center gap-0.5">
                    {top2.currentStreak} <Flame className="w-3.5 h-3.5 fill-orange-400" />
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Workouts</div>
                  <div className="text-cyan-400 font-bold">{top2.totalWorkouts}</div>
                </div>
                <div>
                  <div className="text-gray-400">XP</div>
                  <div className="text-yellow-400 font-bold">{top2.points}</div>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {top1 && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/40 via-gray-900 to-gray-900 border-2 border-amber-500/50 rounded-2xl p-6 text-center relative shadow-2xl shadow-amber-500/10 transform md:-translate-y-6">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Crown className="w-8 h-8 text-amber-400 fill-amber-400 animate-bounce" />
              </div>
              <div className="w-14 h-14 mx-auto mb-3 mt-2 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
                🥇
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/30">
                Grand Champion #1
              </span>
              <h4 className="text-xl font-extrabold text-white mt-2 truncate">{top1.name}</h4>
              <p className="text-xs text-amber-300/80 font-medium">{top1.fitnessLevel}</p>
              <div className="mt-5 pt-3 border-t border-gray-800 flex justify-around text-sm">
                <div>
                  <div className="text-xs text-gray-400">Streak</div>
                  <div className="text-orange-400 font-black flex items-center justify-center gap-1 text-base">
                    {top1.currentStreak} <Flame className="w-4 h-4 fill-orange-400" />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Workouts</div>
                  <div className="text-cyan-400 font-black text-base">{top1.totalWorkouts}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">XP</div>
                  <div className="text-yellow-400 font-black text-base">{top1.points}</div>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3 && (
            <div className="order-3 md:order-3 bg-gradient-to-b from-gray-800/80 to-gray-900 border border-gray-700/60 rounded-2xl p-5 text-center relative shadow-lg transform md:-translate-y-2">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-700/10 border border-amber-700/30 flex items-center justify-center text-2xl shadow-inner">
                🥉
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                Rank #3
              </span>
              <h4 className="text-lg font-bold text-white mt-2 truncate">{top3.name}</h4>
              <p className="text-xs text-gray-400">{top3.fitnessLevel}</p>
              <div className="mt-4 pt-3 border-t border-gray-800 flex justify-around text-xs">
                <div>
                  <div className="text-gray-400">Streak</div>
                  <div className="text-orange-400 font-bold flex items-center justify-center gap-0.5">
                    {top3.currentStreak} <Flame className="w-3.5 h-3.5 fill-orange-400" />
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Workouts</div>
                  <div className="text-cyan-400 font-bold">{top3.totalWorkouts}</div>
                </div>
                <div>
                  <div className="text-gray-400">XP</div>
                  <div className="text-yellow-400 font-bold">{top3.points}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sorting Tabs & Table Section */}
      <Card className="bg-gray-900 border-gray-800 shadow-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800/80">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
              <Trophy className="w-5 h-5 text-amber-500" /> Arena Rankings
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs mt-0.5">
              Rankings change every 24 hours based on daily activity, streaks, and logged sessions.
            </CardDescription>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-gray-800/80 p-1 rounded-xl border border-gray-700/60 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('points')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'points'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" /> Overall XP
            </button>
            <button
              onClick={() => setActiveTab('streak')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'streak'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" /> Daily Streak
            </button>
            <button
              onClick={() => setActiveTab('workouts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'workouts'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" /> Workouts
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 text-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-2" />
              <p className="text-sm font-medium">Computing live arena standings...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider bg-gray-950/40">
                    <th className="p-4 pl-6">Rank</th>
                    <th className="p-4">Athlete</th>
                    <th className="p-4">Level</th>
                    <th className="p-4 text-center">Badges</th>
                    <th className="p-4 text-right">Workouts</th>
                    <th className="p-4 text-right">Daily Streak</th>
                    <th className="p-4 text-right pr-6">Arena XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-sm">
                  {users.map((user) => {
                    const isMe = user._id === authUser?._id || user.isCurrentUser;
                    return (
                      <tr 
                        key={user._id} 
                        className={`transition-colors ${
                          isMe 
                            ? 'bg-orange-500/10 hover:bg-orange-500/15 border-l-4 border-orange-500' 
                            : 'hover:bg-gray-800/40'
                        }`}
                      >
                        <td className="p-4 pl-6 font-bold text-gray-300">
                          {user.rank === 1 && <span className="text-xl">🥇</span>}
                          {user.rank === 2 && <span className="text-xl">🥈</span>}
                          {user.rank === 3 && <span className="text-xl">🥉</span>}
                          {user.rank > 3 && <span className="text-gray-400 font-mono">#{user.rank}</span>}
                        </td>
                        <td className="p-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <span>{user.name}</span>
                            {isMe && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white shadow-sm">
                                YOU
                              </span>
                            )}
                            {user.streakStatus === 'active_today' && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active today"></span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-400 text-xs">
                          <span className="px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700/60">
                            {user.fitnessLevel}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-1 flex-wrap max-w-xs mx-auto">
                            {user.badges && user.badges.length > 0 ? (
                              user.badges.slice(0, 4).map((badge, i) => (
                                <span 
                                  key={i} 
                                  title={badge} 
                                  className="px-1.5 py-0.5 bg-gray-800 rounded-md text-xs border border-gray-700"
                                >
                                  {badge.includes("First") && "🥇"}
                                  {badge.includes("Fire") && "🔥"}
                                  {badge.includes("Century") && "🏆"}
                                  {badge.includes("Dedicated") && "🌟"}
                                  {badge.includes("Beast") && "⚡"}
                                  {badge.includes("Will") && "🛡️"}
                                  {badge.includes("Rat") && "🏋️"}
                                  {!badge.match(/(First|Fire|Century|Dedicated|Beast|Will|Rat)/) && "🏅"}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-600 text-xs">-</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-cyan-400">
                          {user.totalWorkouts || 0}
                        </td>
                        <td className="p-4 text-right font-mono font-bold">
                          {user.currentStreak > 0 ? (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400">
                              <span>{user.currentStreak}d</span>
                              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
                            </div>
                          ) : (
                            <span className="text-gray-600 font-mono text-xs">0d</span>
                          )}
                        </td>
                        <td className="p-4 text-right pr-6 font-mono font-extrabold text-amber-400">
                          {user.points || 0} <span className="text-[10px] text-gray-500 font-normal">XP</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scoring Rules Explanation */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-gray-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400" /> How Daily Modifiers & Leaderboard XP Work
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-gray-800/40 rounded-lg border border-gray-700/40 space-y-1">
            <div className="font-bold text-orange-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> Daily App Check-in
            </div>
            <p className="text-gray-400">
              Open the app every 24 hours: <strong className="text-white">+10 XP</strong> and your daily active streak grows!
            </p>
          </div>
          <div className="p-3 bg-gray-800/40 rounded-lg border border-gray-700/40 space-y-1">
            <div className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5" /> Completed Workout
            </div>
            <p className="text-gray-400">
              Log a workout session: <strong className="text-white">+50 XP</strong> bonus and workout badge progress.
            </p>
          </div>
          <div className="p-3 bg-gray-800/40 rounded-lg border border-gray-700/40 space-y-1">
            <div className="font-bold text-yellow-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Streak Multiplier
            </div>
            <p className="text-gray-400">
              Every consecutive day unbroken awards <strong className="text-white">+30 XP/day</strong> directly to your score.
            </p>
          </div>
          <div className="p-3 bg-gray-800/40 rounded-lg border border-gray-700/40 space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Inactivity Reset
            </div>
            <p className="text-gray-400">
              Missing more than 24 hours resets your streak to 0, directly dropping your leaderboard standing!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
