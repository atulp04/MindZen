import { supabase } from '@/lib/supabaseClient';

export const FRONTEND_CATEGORIES = ["Quick Pranayama", "Body Scan", "Mindfulness", "Muscle Relaxation", "Instrumental"];

export const SUPABASE_FOLDER_TO_FRONTEND_CATEGORY_MAP = {
  "pranayam": "Quick Pranayama",
  "Quick Pranayama": "Quick Pranayama", 
  "body-scan": "Body Scan",
  "Body Scan Meditation": "Body Scan",
  "mindfulness": "Mindfulness",
  "Mindfulness Practice": "Mindfulness",
  "muscle-relaxation": "Muscle Relaxation",
  "Muscle Relaxation Therapy": "Muscle Relaxation",
  "instrumental": "Instrumental",
  "Instrumental Tracks": "Instrumental",
};

export const formatDuration = (numericDuration) => {
  if (typeof numericDuration !== 'number' || isNaN(numericDuration)) return "N/A";
  if (numericDuration === 1) return `Duration: ${numericDuration} Minute`;
  return `Duration: ${numericDuration} Minutes`;
};

export const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const defaultCalmingImages = [
  "calm yoga setting with soft light",
  "serene meditation space with nature elements",
  "abstract flowing colors in pastel tones",
  "peaceful zen garden with raked sand",
  "silhouette of a person meditating at sunrise"
];

export const getSessionImage = (session, index) => {
  if (session.image_url) return session.image_url;

  const categoryKey = SUPABASE_FOLDER_TO_FRONTEND_CATEGORY_MAP[session.category] || session.category;
  
  const categorySpecificImageQueries = {
    "Quick Pranayama": [
      "person practicing pranayama breathing exercises in a tranquil environment",
      "close up of hands in a mudra during meditation",
      "sunlight filtering through leaves in a peaceful forest"
    ],
    "Body Scan": [
      "person lying down peacefully for body scan meditation",
      "abstract representation of body awareness and energy flow",
      "calm water surface reflecting the sky"
    ],
    "Mindfulness": [
      "individual sitting in mindful meditation outdoors",
      "dew drops on a leaf macro shot",
      "stack of balanced stones on a beach"
    ],
    "Muscle Relaxation": [
      "person in a relaxed pose focusing on muscle tension release",
      "soft focus image of a comfortable relaxation space",
      "gentle waves lapping on a shore"
    ],
    "Instrumental": [
      "abstract sound waves visualization in calming colors",
      "musical instruments in a serene setting",
      "starry night sky for deep listening"
    ]
  };

  const imageQueries = categorySpecificImageQueries[categoryKey] || defaultCalmingImages;
  // This is a placeholder. The actual image URL will be replaced by the system.
  // The string inside <img-replace> is a description for the image generation system.
  return imageQueries[index % imageQueries.length];
};

export const getSessionCaption = (session) => {
  if (session.short_description) return session.short_description;
  
  const displayCategory = SUPABASE_FOLDER_TO_FRONTEND_CATEGORY_MAP[session.category] || session.category;
  const durationText = typeof session.duration === 'number' ? `${session.duration}-minute` : '';
  
  const categoryDescriptions = {
    "Quick Pranayama": [
      `A ${durationText} guided breathwork session for instant calm and focus.`,
      `Experience deep relaxation with this ${durationText} pranayama practice.`,
      `Restore balance through ${durationText} of mindful breathing.`
    ],
    "Body Scan": [
      `A gentle ${durationText} body awareness meditation for complete relaxation.`,
      `Release tension with this ${durationText} guided body scan practice.`,
      `Journey through your body in this ${durationText} relaxation session.`
    ],
    "Mindfulness": [
      `Cultivate present-moment awareness in this ${durationText} mindfulness practice.`,
      `A ${durationText} meditation to enhance clarity and inner peace.`,
      `Develop mindful presence with this ${durationText} guided session.`
    ],
    "Muscle Relaxation": [
      `Progressive muscle relaxation for ${durationText} of deep stress relief.`,
      `Release physical tension in this ${durationText} guided practice.`,
      `A ${durationText} session for complete muscular relaxation.`
    ],
    "Instrumental": [
      `Peaceful ${durationText} instrumental track for meditation or focus.`,
      `Calming sounds for ${durationText} of deep concentration.`,
      `Ambient music designed for ${durationText} of serenity.`
    ]
  };

  const descriptions = categoryDescriptions[displayCategory] || categoryDescriptions["Mindfulness"];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

export const downloadMoodLogAsCSV = (moodHistory) => {
  const headers = ['Date', 'Time', 'Mood Score', 'Emotion Label', 'Tags', 'Notes'];
  const csvContent = [
    headers.join(','),
    ...moodHistory.map(log => {
      const date = new Date(log.created_at);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        log.mood_score,
        `"${log.emotion_label}"`,
        `"${(log.emotion_tags || []).join(', ')}"`,
        `"${log.notes || ''}"`
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `mindzen_mood_log_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
