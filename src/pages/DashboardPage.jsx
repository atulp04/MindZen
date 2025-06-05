
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { PlayCircle, Heart, BookOpen, Award, TrendingUp, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

import DashboardSection from '@/components/dashboard/DashboardSection';
import SessionCard from '@/components/dashboard/SessionCard';
import EmptyState from '@/components/dashboard/EmptyState';
import CalloutCard from '@/components/dashboard/CalloutCard';
import MoodSummaryChart from '@/components/dashboard/MoodSummaryChart';
import BlogPreviewSection from '@/components/dashboard/BlogPreviewSection';

const MOOD_LOGS_KEY_PREFIX = 'mindzen_mood_logs_';

const moodOptions = [
  { value: 5, label: 'Amazing', icon: <Smile className="h-5 w-5 text-green-500" />, color: 'hsl(140, 70%, 60%)' },
  { value: 4, label: 'Good', icon: <Smile className="h-5 w-5 text-lime-500" />, color: 'hsl(80, 70%, 60%)' },
  { value: 3, label: 'Okay', icon: <Smile className="h-5 w-5 text-yellow-500" />, color: 'hsl(50, 70%, 60%)' },
  { value: 2, label: 'Bad', icon: <Smile className="h-5 w-5 text-orange-500" />, color: 'hsl(30, 70%, 60%)' },
  { value: 1, label: 'Awful', icon: <Smile className="h-5 w-5 text-red-500" />, color: 'hsl(0, 70%, 60%)' },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [favoriteSessions, setFavoriteSessions] = useState([]);
  const [moodSummary, setMoodSummary] = useState({ stats: [], trend: [] });
  const [loading, setLoading] = useState(true);

  const MOOD_LOGS_KEY = user ? `${MOOD_LOGS_KEY_PREFIX}${user.id}` : null;

  useEffect(() => {
    if (!user) return;
    
    fetchDashboardData();
    fetchMoodData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const { data: recentSessions, error: recentError } = await supabase
        .from('user_sessions')
        .select(`
          id,
          played_at,
          completed,
          progress,
          meditation_sessions (
            id,
            title,
            duration,
            category,
            language,
            audio_file_url
          )
        `)
        .eq('user_id', user.id)
        .order('played_at', { ascending: false })
        .limit(3);

      if (recentError) {
        console.error('Error fetching recent sessions:', recentError);
      } else {
        setRecentlyPlayed(recentSessions || []);
      }

      const { data: favorites, error: favError } = await supabase
        .from('user_favorites')
        .select(`
          id,
          created_at,
          meditation_sessions (
            id,
            title,
            duration,
            category,
            language,
            audio_file_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (favError) {
        console.error('Error fetching favorites:', favError);
      } else {
        setFavoriteSessions(favorites || []);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMoodData = () => {
    if (MOOD_LOGS_KEY) {
      const storedMoodLogs = localStorage.getItem(MOOD_LOGS_KEY);
      if (storedMoodLogs) {
        const moodLogs = JSON.parse(storedMoodLogs);
        const stats = moodOptions.map(opt => ({
          name: opt.label,
          value: moodLogs.filter(log => log.mood_score === opt.value).length,
          fill: opt.color,
          icon: opt.icon
        })).filter(s => s.value > 0);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const trendData = moodLogs
          .filter(log => new Date(log.created_at) >= sevenDaysAgo)
          .map(log => ({
            date: new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}),
            mood: log.mood_score
          }))
          .sort((a,b) => new Date(a.date) - new Date(b.date));

        setMoodSummary({ stats, trend: trendData });
      }
    }
  };

  const handlePlayAgain = async (session) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_id: session.meditation_sessions.id,
          played_at: new Date().toISOString(),
          completed: false,
          progress: 0
        });

      if (error) {
        console.error('Error recording play session:', error);
      }

      toast({
        title: "Playing Session",
        description: `Now playing: ${session.meditation_sessions.title}`,
      });
      navigate('/meditation');
    } catch (error) {
      console.error('Error playing session:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start session. Please try again.",
      });
    }
  };

  const formatDuration = (duration) => {
    if (typeof duration !== 'number') return 'N/A';
    return duration === 1 ? `${duration} min` : `${duration} mins`;
  };

  const formatPlayedAt = (playedAt) => {
    const date = new Date(playedAt);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-2xl text-muted-foreground mb-4">Please log in to view your dashboard.</p>
        <Button onClick={() => navigate('/auth')}>Login</Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8 md:space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-1">Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{user?.user_metadata?.full_name || user?.email}!</span></h1>
        <p className="text-md sm:text-lg text-muted-foreground">Here's your personalized mental wellness dashboard.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6 md:space-y-8">
          
          <DashboardSection title="Recently Played" icon={<PlayCircle className="h-6 w-6 text-primary" />}>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : recentlyPlayed.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recentlyPlayed.map(session => (
                  <SessionCard 
                    key={session.id}
                    session={session}
                    onPlayAgain={() => handlePlayAgain(session)}
                    showPlayedAt={true}
                    formatDuration={formatDuration}
                    formatPlayedAt={formatPlayedAt}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="No recently played sessions. Explore meditations to get started!" link="/meditation" linkText="Start Meditating" />
            )}
          </DashboardSection>

          <DashboardSection title="Favorite Sessions" icon={<Heart className="h-6 w-6 text-pink-500" />}>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : favoriteSessions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favoriteSessions.map(favorite => (
                  <SessionCard 
                    key={favorite.id}
                    session={favorite}
                    onPlayAgain={() => handlePlayAgain(favorite)}
                    showPlayedAt={false}
                    formatDuration={formatDuration}
                    isFavorite={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="No favorite sessions yet. Heart a session to see it here!" link="/meditation" linkText="Browse Sessions" />
            )}
          </DashboardSection>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-1">
          <DashboardSection title="Mood Summary" icon={<Smile className="h-6 w-6 text-accent" />} className="h-full">
            {moodSummary.stats.length > 0 ? (
              <MoodSummaryChart moodSummary={moodSummary} />
            ) : (
              <EmptyState text="No mood data yet. Log your mood to see summaries!" link="/mood-tracker" linkText="Log Mood"/>
            )}
          </DashboardSection>
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants}>
        <DashboardSection title="Discover More" icon={<TrendingUp className="h-6 w-6 text-primary" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <CalloutCard
              icon={<BookOpen className="h-10 w-10 text-green-500" />}
              title="MindZen Guide Book"
              description="Deepen your practice with our exclusive guide."
              actionText="Learn More"
              onClick={() => toast({ title: "Coming Soon!", description: "The MindZen Guide Book will be available shortly."})}
            />
            <CalloutCard
              icon={<Award className="h-10 w-10 text-yellow-500" />}
              title="21-Day Mindfulness Workshop"
              description="Embark on a transformative journey to inner peace."
              actionText="Enroll Now"
              onClick={() => toast({ title: "Coming Soon!", description: "Enrollment for the workshop opens next month."})}
            />
          </div>
          <BlogPreviewSection />
        </DashboardSection>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
