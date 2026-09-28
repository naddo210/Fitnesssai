import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Loader2, Flame, Sun, Moon, Zap, Swords } from "lucide-react";
import ReactMarkdown from 'react-markdown';

const Challenges = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const challenges = [
    {
        id: 'fat-loss',
        title: '30-Day Fat Loss',
        icon: Flame,
        color: 'text-red-500',
        desc: 'High intensity interval training + calorie deficit plan to shred fat in one month.',
        prompt: 'Create a strict but safe 30-day fat loss challenge plan including daily workout focus and nutrition rules. Use a tabular format for the schedule.'
    },
    {
        id: 'ramadan',
        title: 'Ramadan Fitness',
        icon: Moon,
        color: 'text-purple-400',
        desc: 'Maintain muscle and hydration while fasting. Suhoor/Iftar meal guides included.',
        prompt: 'Create a Ramadan fitness guide. Include: 1. Best times to workout (before Iftar/after Taraweeh). 2. Suhoor and Iftar meal examples for sustained energy. 3. A modified low-intensity exercise plan.'
    },
    {
        id: 'summer-shred',
        title: 'Summer Shred',
        icon: Sun,
        color: 'text-yellow-400',
        desc: '4-week beach body prep. Focus on aesthetics: Abs, Chest, and Arms.',
        prompt: 'Create a "Summer Shred" aesthetic workout program for 4 weeks. Focus heavily on visible muscles (Abs, Arms, Chest, Delts). High volume, hypertrophy focus.'
    },
    {
        id: 'goku-mode',
        title: 'Saiyan Physiology',
        icon: Zap,
        color: 'text-orange-400',
        desc: 'Insane volume training for those who want to break their limits. Not for beginners.',
        prompt: 'Create a "Saiyan" inspired workout routine. Extremely high volume, callisthenics mixed with heavy lifting. Focus on explosive power and endurance. Warning: Very intensity.'
    }
  ];

  const handleJoin = async (challenge) => {
      setLoading(true);
      setSelectedChallenge(challenge);
      setResult(null);
      try {
          // Re-using the generic workout endpoint but with a custom prompt injection
          // We can construct a "User Profile" that simulates this request
          const { data } = await axios.post('/api/ai/workout-plan', {
              fitnessLevel: 'Intermediate', 
              goals: `CHALLENGE REQUEST: ${challenge.title}. ${challenge.prompt}`,
              daysAvailable: 5,
              pastHistory: 'User wants to start a specific challenge.'
          });
          setResult(data.result);
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
         <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent inline-block mb-2">
            VIRAL CHALLENGES
          </h2>
          <p className="text-gray-400">Join the community. Pick your battle.</p>
      </div>

      {!result && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {challenges.map((challenge) => (
                  <Card key={challenge.id} className="bg-gray-900 border-gray-800 hover:border-gray-600 transition-all">
                      <CardHeader>
                          <challenge.icon className={`w-12 h-12 mb-4 ${challenge.color}`} />
                          <CardTitle>{challenge.title}</CardTitle>
                          <CardDescription>{challenge.desc}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                          <Button onClick={() => handleJoin(challenge)} className="w-full bg-white text-black hover:bg-gray-200">
                              Accept Challenge
                          </Button>
                      </CardFooter>
                  </Card>
              ))}
          </div>
      )}

      {loading && (
          <div className="flex flex-col items-center justify-center p-20">
              <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
              <p className="text-xl text-white font-bold animate-pulse">Generating Challenge Protocol...</p>
          </div>
      )}

      {result && (
          <div className="space-y-6">
              <Button variant="ghost" onClick={() => setResult(null)} className="mb-4">
                  &larr; Back to Challenges
              </Button>
              <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                          <Swords className="text-red-500" />
                          {selectedChallenge?.title} Protocol
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-invert max-w-none">
                      <ReactMarkdown>{result}</ReactMarkdown>
                  </CardContent>
              </Card>
          </div>
      )}
    </div>
  );
};

export default Challenges;
