/**
 * Verified, public YouTube tutorial IDs for popular exercises.
 * Sourced from elite fitness educators (Jeff Nippard, Athlean-X, Squat University).
 * Direct video IDs bypass YouTube's restriction on listType=search in iframes.
 */
const EXERCISE_VIDEO_MAP = [
  // Chest
  { keywords: ['bench press', 'flat bench', 'barbell bench', 'chest press'], id: 'rT7DgCr-3pg' },
  { keywords: ['incline bench', 'incline dumbbell', 'incline press'], id: '8iPEnn-ltC8' },
  { keywords: ['push up', 'push-up', 'pushup'], id: 'IODxDxX7oi4' },
  { keywords: ['chest fly', 'cable fly', 'pec fly', 'dumbbell fly'], id: 'taI4XduLpTk' },
  { keywords: ['dip', 'dips', 'chest dip'], id: '2z8JmcrW-As' },

  // Shoulders
  { keywords: ['overhead press', 'military press', 'shoulder press', 'ohp', 'barbell press'], id: '2yjwXTZQDDI' },
  { keywords: ['lateral raise', 'side raise', 'side delt', 'dumbbell lateral'], id: '3VcKaXpzqRo' },
  { keywords: ['face pull', 'rear delt', 'facepull'], id: 'rep-qVOkqgk' },
  { keywords: ['shrug', 'shrugs'], id: 'cJRVVxmytaM' },

  // Back
  { keywords: ['deadlift', 'romanian deadlift', 'rdl', 'stiff leg deadlift'], id: 'op9kVnSso6Q' },
  { keywords: ['pull up', 'pull-up', 'pullup', 'chin up', 'chin-up'], id: 'eGo4IYlbE5g' },
  { keywords: ['lat pulldown', 'pulldown', 'cable pulldown'], id: 'CAwf7n6Luuc' },
  { keywords: ['barbell row', 'bent over row', 'dumbbell row', 'cable row', 'seated row', 'row'], id: 'roCP6wCXPqo' },

  // Legs / Glutes
  { keywords: ['squat', 'back squat', 'goblet squat', 'front squat'], id: 'bEv6CCg2BC8' },
  { keywords: ['leg press'], id: 'IZxyjW7MPJQ' },
  { keywords: ['lunge', 'lunges', 'walking lunge'], id: 'QOVaHwm-Q6U' },
  { keywords: ['bulgarian split squat', 'split squat'], id: '2C-uNgKwPLE' },
  { keywords: ['leg extension'], id: 'm0FOpMEgero' },
  { keywords: ['leg curl', 'hamstring curl'], id: '1Tq3QdYUuHs' },
  { keywords: ['hip thrust', 'glute bridge'], id: 'SEdqd1n0cvg' },
  { keywords: ['calf raise', 'standing calf', 'calves'], id: '-M4-G8p8fmc' },

  // Arms
  { keywords: ['bicep curl', 'dumbbell curl', 'barbell curl', 'biceps', 'curl'], id: 'ykJmrZ5v0Oo' },
  { keywords: ['hammer curl'], id: 'TwD-YGVP4Bk' },
  { keywords: ['tricep pushdown', 'pushdown', 'rope pushdown', 'cable pushdown'], id: '2-LAMcpzODU' },
  { keywords: ['skullcrusher', 'triceps extension', 'tricep extension', 'skull crusher'], id: '6SS6K3lAwZ8' },

  // Core / HIIT
  { keywords: ['plank', 'planks'], id: 'pSHjTRCQxIw' },
  { keywords: ['hanging leg raise', 'leg raise'], id: 'hdng3Nm1x_E' },
  { keywords: ['burpee', 'burpees'], id: 'dZgVxmf6jkA' },
  { keywords: ['mountain climber', 'mountain climbers'], id: 'nmwgirgXLYM' },
];

/**
 * Returns a verified embed URL for any exercise name.
 * Uses keyword matching; falls back to foundational lifting mechanics if no match.
 */
export const getExerciseEmbedUrl = (exerciseName = '') => {
  const normalized = exerciseName.toLowerCase().trim();
  
  for (const entry of EXERCISE_VIDEO_MAP) {
    if (entry.keywords.some(kw => normalized.includes(kw))) {
      return `https://www.youtube-nocookie.com/embed/${entry.id}?rel=0&modestbranding=1`;
    }
  }

  // Foundational form tutorial fallback
  return `https://www.youtube-nocookie.com/embed/bEv6CCg2BC8?rel=0&modestbranding=1`;
};
