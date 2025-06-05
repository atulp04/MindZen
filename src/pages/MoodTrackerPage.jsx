
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, MessageSquare, TrendingUp, CheckCircle, Smile, Meh, Frown, Angry, Laugh, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { downloadMoodLogAsCSV } from '@/components/meditation/meditationUtils';

const MOOD_LOGS_KEY_PREFIX = 'mindzen_mood_logs_';

const moodOptions = [
  { value: 5, label: '😄 Amazing', icon: <Laugh className="h-7 w-7 sm:h-8 sm:w-8 text-green-500" />, color: 'text-green-500', borderColor: 'border-green-500' },
  { value: 4, label: '😊 Good', icon: <Smile className="h-7 w-7 sm:h-8 sm:w-8 text-lime-500" />, color: 'text-lime-500', borderColor: 'border-lime-500' },
  { value: 3, label: '😐 Okay', icon: <Meh className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-500" />, color: 'text-yellow-500', borderColor: 'border-yellow-500' },
  { value: 2, label: '🙁 Bad', icon: <Frown className="h-7 w-7 sm:h-8 sm:w-8 text-orange-500" />, color: 'text-orange-500', borderColor: 'border-orange-500' },
  { value: 1, label: '😠 Angry', icon: <Angry className="h-7 w-7 sm:h-8 sm:w-8 text-red-500" />, color: 'text-red-500', borderColor: 'border-red-500' },
];

const MoodTrackerPage = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [emotionTags, setEmotionTags] = useState('');
  const [notes, setNotes] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const MOOD_LOGS_KEY = user ? `${MOOD_LOGS_KEY_PREFIX}${user.id}` : null;

  useEffect(() => {
    if (MOOD_LOGS_KEY) {
      const storedLogs = localStorage.getItem(MOOD_LOGS_KEY);
      if (storedLogs) {
        setMoodHistory(JSON.parse(storedLogs));
      }
    } else {
      setMoodHistory([]);
    }
  }, [MOOD_LOGS_KEY]);

  const saveMoodLog = (logEntry) => {
    if (!MOOD_LOGS_KEY) {
      toast({ variant: "destructive", title: "Error", description: "User not identified. Cannot save mood." });
      return;
    }
    const updatedHistory = [logEntry, ...moodHistory];
    setMoodHistory(updatedHistory);
    localStorage.setItem(MOOD_LOGS_KEY, JSON.stringify(updatedHistory));
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleSubmitMood = () => {
    if (!selectedMood) {
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: "Please select a mood before submitting.",
      });
      return;
    }
    const newLog = {
      id: `mood_${Date.now()}`,
      user_id: user?.id || 'guest',
      mood_score: selectedMood.value,
      emotion_label: selectedMood.label,
      emotion_tags: emotionTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      notes: notes,
      created_at: new Date().toISOString(),
    };
    saveMoodLog(newLog);
    setSelectedMood(null);
    setEmotionTags('');
    setNotes('');
    toast({
      title: "Mood Logged!",
      description: `You're feeling ${selectedMood.label.toLowerCase()}. Keep it up!`,
      action: <CheckCircle className="text-green-500" />,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const getChartData = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentLogs = moodHistory
      .filter(log => new Date(log.created_at) >= sevenDaysAgo)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    const dailyData = {};
    recentLogs.forEach(log => {
      const dateKey = new Date(log.created_at).toLocaleDateString('en-CA');
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { date: dateKey, mood_score: [], count: 0 };
      }
      dailyData[dateKey].mood_score.push(log.mood_score);
      dailyData[dateKey].count++;
    });

    return Object.values(dailyData).map(d => ({
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: d.mood_score.reduce((a,b) => a+b, 0) / d.count
    })).sort((a,b) => new Date(a.date) - new Date(b.date));
  };

  const chartData = getChartData();

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Track Your Mood</h1>
        <p className="text-lg text-muted-foreground mb-8 text-center leading-relaxed">How are you feeling today? Log your mood to gain insights into your emotional well-being.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="max-w-2xl mx-auto shadow-xl hover:shadow-2xl transition-shadow bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl">Log Your Current Mood</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Select an emotion that best describes how you feel right now. Your mood logs help build a picture of your emotional journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap justify-around items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-primary/5 rounded-lg">
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood)}
                  className={`p-2 sm:p-3 rounded-lg transition-all duration-200 ease-in-out transform focus:outline-none border-2 ${
                    selectedMood?.value === mood.value ? `bg-primary/20 scale-110 ${mood.borderColor} ring-2 ring-offset-2 ring-primary` : `bg-background hover:bg-accent/10 border-transparent hover:${mood.borderColor}`
                  }`}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={mood.label}
                >
                  {mood.icon}
                </motion.button>
              ))}
            </div>
            {selectedMood && (
              <p className="text-center font-semibold text-lg">
                You selected: <span className={`${selectedMood.color} font-bold`}>{selectedMood.label}</span>
              </p>
            )}
            <div>
              <Label htmlFor="emotionTags" className="flex items-center mb-1">
                <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                Emotion Tags (optional, comma-separated)
              </Label>
              <Input
                id="emotionTags"
                placeholder="e.g., excited, productive, grateful"
                value={emotionTags}
                onChange={(e) => setEmotionTags(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="notes" className="flex items-center mb-1">
                <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                Additional Notes (optional)
              </Label>
              <Input
                id="notes"
                placeholder="Any thoughts or reasons for this mood? (e.g., had a great meeting)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubmitMood} 
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg py-3"
            >
              <CheckCircle className="mr-2 h-5 w-5" /> Log Mood
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-xl hover:shadow-2xl transition-shadow bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-primary" />
                Mood History (Last 7 Days)
              </CardTitle>
              <CardDescription className="mt-2">Review your recent mood entries and trends.</CardDescription>
            </div>
            {moodHistory.length > 0 && (
              <Button
                onClick={() => downloadMoodLogAsCSV(moodHistory)}
                className="bg-primary/10 text-primary hover:bg-primary/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {moodHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No moods logged yet. Start tracking to see your history!</p>
            ) : chartData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Not enough data for the last 7 days. Keep logging your mood!</p>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.3)" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={[0, 5]} allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        boxShadow: '0 4px 12px hsl(var(--primary) / 0.1)'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3} 
                      dot={{ r: 5, fill: 'hsl(var(--primary))' }} 
                      activeDot={{ r: 7, fill: 'hsl(var(--accent))', stroke: 'hsl(var(--background))', strokeWidth: 2 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <h3 className="text-lg font-semibold mt-8 mb-3">All Logged Moods:</h3>
            {moodHistory.length > 0 ? (
              <ul className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {moodHistory.map((log) => {
                  const moodVisual = moodOptions.find(m => m.value === log.mood_score);
                  return (
                    <li key={log.id} className="p-4 border rounded-lg bg-background/70 hover:bg-secondary/50 transition-colors shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div className="flex items-center mb-2 sm:mb-0">
                          {moodVisual?.icon && React.cloneElement(moodVisual.icon, {className: `h-6 w-6 mr-2 ${moodVisual.color}`})}
                          <span className={`font-semibold text-md ${moodVisual?.color || ''}`}>
                            {log.emotion_label}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {log.emotion_tags && log.emotion_tags.length > 0 && (
                        <div className="mt-1.5">
                          {log.emotion_tags.map(tag => (
                            <span key={tag} className="inline-block bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {log.notes && <p className="text-sm text-muted-foreground mt-1.5 pl-1 border-l-2 border-primary/30">{log.notes}</p>}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No moods logged yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MoodTrackerPage;