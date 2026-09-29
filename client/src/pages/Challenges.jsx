import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { 
  Loader2, Flame, Sun, Moon, Zap, Swords, ArrowLeft, 
  Copy, Check, Download, ShieldAlert, Sparkles, Clock, Target, Dumbbell 
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';

const Challenges = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [copied, setCopied] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const challenges = [
    {
      id: 'fat-loss',
      title: '30-Day Fat Loss & Shred',
      icon: Flame,
      color: 'text-red-500',
      badgeColor: 'bg-red-500/10 border-red-500/30 text-red-400',
      duration: '30 Days',
      difficulty: 'Intermediate',
      focus: 'Fat Loss & Conditioning',
      desc: 'High-intensity metabolic resistance training paired with strict caloric deficit principles to torch body fat in 30 days.',
      prompt: 'Create a strict but safe 30-day fat loss challenge plan including daily workout focus, cardio finishers, and exact nutrition rules. Use a tabular format for the schedule.'
    },
    {
      id: 'ramadan',
      title: 'Ramadan Muscle Preservation',
      icon: Moon,
      color: 'text-purple-400',
      badgeColor: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
      duration: '30 Days',
      difficulty: 'All Levels',
      focus: 'Fasting & Hypertrophy',
      desc: 'Maintain strength, protect lean muscle mass, and optimize cellular hydration while fasting. Suhoor and Iftar blueprints included.',
      prompt: 'Create a complete Ramadan fitness protocol. Include: 1. Strategic workout timing windows (pre-Iftar vs post-Taraweeh). 2. Suhoor and Iftar meal examples for sustained energy and hydration. 3. Structured weekly resistance plan with volume regulation.'
    },
    {
      id: 'summer-shred',
      title: 'Summer Aesthetic Shred',
      icon: Sun,
      color: 'text-yellow-400',
      badgeColor: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
      duration: '4 Weeks',
      difficulty: 'Intermediate',
      focus: 'V-Taper & Core',
      desc: 'Hypertrophy-focused program designed to accentuate aesthetic muscle groups: Delts, Upper Chest, Abs, and Biceps.',
      prompt: 'Create a 4-week "Summer Aesthetic Shred" workout and nutrition program. Heavily emphasize the V-Taper (Lateral Delts, Lats, Upper Chest, and Abs). High volume mechanical tension.'
    },
    {
      id: 'goku-mode',
      title: 'Saiyan Physiology: Unlimited Power',
      icon: Zap,
      color: 'text-orange-400',
      badgeColor: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
      duration: '4 Weeks',
      difficulty: 'Extreme',
      focus: 'Raw Power & Stamina',
      desc: 'Relentless hybrid volume combining heavy compound powerlifting with explosive bodyweight calisthenics. Not for beginners.',
      prompt: 'Create an intense "Saiyan Physiology" training routine. Heavy compound lifts mixed with explosive calisthenics, gravity-chamber conditioning, and aggressive fueling rules. Include warnings.'
    },
    {
      id: '100-pushups',
      title: '100 Pushups / Day Mastery',
      icon: Dumbbell,
      color: 'text-cyan-400',
      badgeColor: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      duration: '30 Days',
      difficulty: 'Beginner to Advanced',
      focus: 'Chest & Tricep Endurance',
      desc: 'Progressive overload protocol to build a dense chest and bulletproof shoulder joints using daily calibrated pushup variations.',
      prompt: 'Create a progressive 30-day "100 Pushups A Day" protocol. Break it down into progressive variation levels (Diamond, Archer, Decline, Explosive), recovery protocols for wrists/rotator cuffs, and daily sets split.'
    },
    {
      id: 'murph-prep',
      title: 'Warrior Murph Preparation',
      icon: Swords,
      color: 'text-emerald-400',
      badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      duration: '6 Weeks',
      difficulty: 'Advanced',
      focus: 'Tactical Endurance',
      desc: 'Structured progression to conquer the heroic Murph challenge: 1-mile run, 100 pull-ups, 200 push-ups, 300 squats, 1-mile run.',
      prompt: 'Create a 6-week tactical preparation program to conquer the Crossfit Hero WOD "Murph". Provide weekly breakdown of running pacing, partition strategies (Cindy style), pullup volume progression, and recovery.'
    }
  ];

  const handleJoin = async (challenge) => {
    setLoading(true);
    setSelectedChallenge(challenge);
    setResult(null);
    setCommitted(false);
    setCopied(false);

    try {
      // Use the dedicated challenge endpoint
      const { data } = await axios.post('/api/ai/challenge', {
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        promptDirective: challenge.prompt,
        fitnessLevel: challenge.difficulty
      });
      setResult(data.result);
    } catch (error) {
      console.error("Challenge Generation Error:", error);
      // Fallback in case endpoint is pending
      setResult(`## ${challenge.title} Protocol\n\nFailed to reach neural engine. Please check connection and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCommitChallenge = () => {
    if (!selectedChallenge) return;
    try {
      const activeChallenges = JSON.parse(localStorage.getItem('gymgenius_active_challenges') || '[]');
      const updated = [
        ...activeChallenges.filter(c => c.id !== selectedChallenge.id),
        {
          id: selectedChallenge.id,
          title: selectedChallenge.title,
          joinedAt: new Date().toISOString(),
          duration: selectedChallenge.duration
        }
      ];
      localStorage.setItem('gymgenius_active_challenges', JSON.stringify(updated));
      setCommitted(true);
    } catch (err) {
      console.error("Failed to commit challenge:", err);
    }
  };

  const handleExportPdf = () => {
    if (!result || !selectedChallenge) return;
    setExportingPdf(true);

    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - (margin * 2);
      let y = margin;

      const checkPageBreak = (spaceNeeded = 10) => {
        if (y + spaceNeeded > pageHeight - margin - 10) {
          doc.addPage();
          y = margin + 5;
        }
      };

      // Header Banner
      doc.setFillColor(15, 23, 42); // dark navy
      doc.rect(0, 0, pageWidth, 28, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(245, 158, 11); // Amber
      doc.text("GYMGENIUS AI • VIRAL CHALLENGE PROTOCOL", margin, 12);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(selectedChallenge.title.toUpperCase(), margin, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Duration: ${selectedChallenge.duration}  |  Difficulty: ${selectedChallenge.difficulty}  |  Generated: ${new Date().toLocaleDateString()}`, margin, 25);

      y = 36;

      const lines = result.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i].trim();
        if (!rawLine) {
          y += 2.5;
          continue;
        }

        // H1 Heading
        if (rawLine.startsWith('# ')) {
          checkPageBreak(14);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.setTextColor(245, 158, 11);
          doc.text(rawLine.replace(/^#\s*/, '').replace(/\*/g, ''), margin, y);
          y += 7;
          continue;
        }

        // H2 Heading
        if (rawLine.startsWith('## ')) {
          checkPageBreak(12);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(56, 189, 248);
          doc.text(rawLine.replace(/^##\s*/, '').replace(/\*/g, ''), margin, y);
          y += 6;
          continue;
        }

        // H3 Heading
        if (rawLine.startsWith('### ')) {
          checkPageBreak(10);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(251, 191, 36);
          doc.text(rawLine.replace(/^###\s*/, '').replace(/\*/g, ''), margin, y);
          y += 5;
          continue;
        }

        // Blockquotes (> Quote)
        if (rawLine.startsWith('>')) {
          checkPageBreak(15);
          const quoteText = rawLine.replace(/^>\s*/, '').replace(/\*\*/g, '').trim();
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8.5);
          const splitQuote = doc.splitTextToSize(quoteText, contentWidth - 8);
          const boxH = (splitQuote.length * 4) + 4;

          doc.setFillColor(254, 243, 199);
          doc.roundedRect(margin, y, contentWidth, boxH, 1, 1, 'F');
          doc.setFillColor(245, 158, 11);
          doc.rect(margin, y, 2, boxH, 'F');

          doc.setTextColor(146, 64, 14);
          doc.text(splitQuote, margin + 4, y + 4);
          y += boxH + 3;
          continue;
        }

        // Table Rows
        if (rawLine.startsWith('|')) {
          if (rawLine.includes('---')) continue; // separator
          checkPageBreak(7);
          const cells = rawLine.split('|').filter(c => c.trim().length > 0).map(c => c.trim().replace(/\*\*/g, ''));
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(30, 41, 59);

          const cellText = cells.join('  •  ');
          const splitRow = doc.splitTextToSize(cellText, contentWidth);
          doc.text(splitRow, margin, y);
          y += (splitRow.length * 3.5) + 1;
          continue;
        }

        // List items (- or *)
        if (rawLine.startsWith('- ') || rawLine.startsWith('* ') || /^\d+\.\s/.test(rawLine)) {
          checkPageBreak(6);
          const cleanItem = rawLine.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '').replace(/\*\*/g, '');
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(51, 65, 85);
          const splitItem = doc.splitTextToSize(`•  ${cleanItem}`, contentWidth);
          doc.text(splitItem, margin + 2, y);
          y += (splitItem.length * 3.8) + 1;
          continue;
        }

        // Standard Paragraph
        checkPageBreak(6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        const splitP = doc.splitTextToSize(rawLine.replace(/\*\*/g, ''), contentWidth);
        doc.text(splitP, margin, y);
        y += (splitP.length * 3.8) + 1.5;
      }

      // Add footers
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text('GymGenius AI • Certified Training & Challenge Protocol', margin, pageHeight - 6);
        doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin - 15, pageHeight - 6);
      }

      doc.save(`GymGenius_${selectedChallenge.id}_protocol.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Could not generate PDF. Please use the Copy Protocol button.");
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-wider uppercase">
          <Swords className="w-3.5 h-3.5" /> Elite Athletic Protocols
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
          VIRAL <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">CHALLENGES</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
          Choose a battle-tested challenge protocol. Each blueprint delivers precise daily workout splits, nutrition guidelines, and progressive milestones.
        </p>
      </div>

      {/* Grid of Challenges */}
      {!result && !loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const Icon = challenge.icon;
            return (
              <Card 
                key={challenge.id} 
                className="bg-gray-900/90 border-gray-800 hover:border-gray-700/80 transition-all hover:shadow-2xl hover:shadow-orange-500/5 group flex flex-col justify-between"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className={`w-6 h-6 ${challenge.color}`} />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${challenge.badgeColor}`}>
                      {challenge.duration}
                    </span>
                  </div>

                  <div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {challenge.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-cyan-400" /> {challenge.focus}
                      </span>
                      <span>•</span>
                      <span>{challenge.difficulty}</span>
                    </div>
                  </div>

                  <CardDescription className="text-gray-400 text-xs leading-relaxed">
                    {challenge.desc}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="pt-4 border-t border-gray-800/80">
                  <Button 
                    onClick={() => handleJoin(challenge)} 
                    className="w-full font-bold bg-white text-black hover:bg-amber-400 hover:text-black transition-all shadow-md group-hover:shadow-amber-500/20"
                  >
                    Accept Challenge &rarr;
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-5 text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin"></div>
            <Zap className="w-6 h-6 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Synthesizing {selectedChallenge?.title} Protocol...</h3>
            <p className="text-xs text-gray-400">Engineering custom volume splits, nutrition targets, and progressive overload benchmarks.</p>
          </div>
        </div>
      )}

      {/* Protocol Result Display */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-900 border border-gray-800 p-4 rounded-xl">
            <Button 
              variant="ghost" 
              onClick={() => { setResult(null); setSelectedChallenge(null); }} 
              className="text-gray-300 hover:text-white self-start"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Challenges
            </Button>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="border-gray-700 text-gray-300 hover:text-white"
              >
                {copied ? <Check className="w-4 h-4 mr-1.5 text-emerald-400" /> : <Copy className="w-4 h-4 mr-1.5" />}
                {copied ? "Copied!" : "Copy Protocol"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPdf}
                disabled={exportingPdf}
                className="border-gray-700 text-gray-300 hover:text-white"
              >
                <Download className="w-4 h-4 mr-1.5" />
                {exportingPdf ? "Generating..." : "Download PDF"}
              </Button>

              <Button
                size="sm"
                onClick={handleCommitChallenge}
                disabled={committed}
                className={`font-bold transition-all ${
                  committed 
                    ? "bg-emerald-600 text-white" 
                    : "bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20"
                }`}
              >
                {committed ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5" /> Challenge Accepted!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-1.5" /> Commit to Challenge
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Commitment Toast */}
          {committed && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>
                  <strong>Locked in!</strong> This protocol has been registered to your active athletic goals. Check back every day to maintain your streak!
                </span>
              </div>
            </div>
          )}

          {/* Protocol Card */}
          <Card className="bg-gray-900/90 border-gray-800 shadow-2xl relative overflow-hidden">
            <CardHeader className="border-b border-gray-800 pb-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <Swords className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-black text-white">
                      {selectedChallenge?.title}
                    </CardTitle>
                    <p className="text-xs text-gray-400">
                      Official Training & Nutrition Blueprint • {selectedChallenge?.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${selectedChallenge?.badgeColor}`}>
                    {selectedChallenge?.difficulty}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-800 border border-gray-700 text-gray-300">
                    {selectedChallenge?.focus}
                  </span>
                </div>
              </div>
            </CardHeader>

            {/* Rich Markdown Rendering with Custom Components */}
            <CardContent className="p-6 md:p-8">
              <div className="markdown-body max-w-none">
                <ReactMarkdown
                  components={{
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-4 rounded-xl border border-gray-800 shadow-md">
                        <table className="w-full text-left border-collapse" {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th className="bg-gray-800/90 text-amber-400 font-bold p-3 text-xs uppercase tracking-wider border-b border-gray-700" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="p-3 border-b border-gray-800 text-gray-300 text-sm align-middle" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-amber-500 bg-amber-500/10 p-4 my-4 rounded-r-xl text-amber-200 text-sm italic" {...props} />
                    ),
                    h1: ({ node, ...props }) => (
                      <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-6 mb-3 pb-2 border-b border-gray-800" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-xl md:text-2xl font-bold text-sky-400 mt-5 mb-2.5 pb-1 border-b border-sky-500/20" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-lg font-bold text-amber-400 mt-4 mb-2" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-5 space-y-1.5 my-3 text-gray-300 text-sm" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-5 space-y-1.5 my-3 text-gray-300 text-sm" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="text-white font-bold" {...props} />
                    ),
                    hr: ({ node, ...props }) => (
                      <hr className="my-6 border-gray-800" {...props} />
                    ),
                  }}
                >
                  {result}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Challenges;
