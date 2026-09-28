import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Loader2, Trophy, Medal, Flame, Dumbbell } from "lucide-react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get('/api/leaderboard');
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    } finally {
        setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400"><Loader2 className="w-8 h-8 animate-spin mx-auto"/> Loading champions...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-10">
         <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent inline-block mb-2">
            LEADERBOARD
          </h2>
          <p className="text-gray-400">Hall of Fame. See where you stand.</p>
      </div>

      <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Trophy className="text-yellow-500" /> Top Performers
              </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-800 text-gray-400 text-sm">
                            <th className="p-4">Rank</th>
                            <th className="p-4">Athlete</th>
                            <th className="p-4">Level</th>
                            <th className="p-4 text-center">Badges</th>
                            <th className="p-4 text-right">Workouts</th>
                            <th className="p-4 text-right">Streak</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {users.map((user, index) => (
                            <tr key={user._id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="p-4 font-bold text-gray-300">
                                    {index === 0 && <span className="text-2xl">🥇</span>}
                                    {index === 1 && <span className="text-2xl">🥈</span>}
                                    {index === 2 && <span className="text-2xl">🥉</span>}
                                    {index > 2 && `#${index + 1}`}
                                </td>
                                <td className="p-4 font-medium text-white">{user.name}</td>
                                <td className="p-4 text-gray-400 text-sm">{user.fitnessLevel}</td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center gap-1 flex-wrap">
                                        {user.badges && user.badges.length > 0 ? (
                                            user.badges.map((badge, i) => (
                                                <span key={i} title={badge} className="px-2 py-1 bg-gray-800 rounded-full text-xs text-yellow-400 border border-gray-700">
                                                    {badge.includes("First") && "🥇"}
                                                    {badge.includes("Fire") && "🔥"}
                                                    {badge.includes("Century") && "🏆"}
                                                    {!badge.includes("First") && !badge.includes("Fire") && !badge.includes("Century") && "🏅"}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-600 text-xs">-</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-right font-mono text-blue-400">{user.totalWorkouts || 0}</td>
                                <td className="p-4 text-right font-mono text-orange-400">
                                    {user.currentStreak > 0 ? (
                                        <div className="flex items-center justify-end gap-1">
                                            {user.currentStreak} <Flame className="w-3 h-3" />
                                        </div>
                                    ) : "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
