import React, { useState, useEffect, useMemo, useRef } from 'react';
    import { motion } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/hooks/useAuth';
    import { supabase } from '@/lib/supabaseClient';
    import MeditationTabs from '@/components/meditation/MeditationTabs';
    import MeditationCard from '@/components/meditation/MeditationCard';
    import { Loader2, Volume2, VolumeX } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { FRONTEND_CATEGORIES, SUPABASE_FOLDER_TO_FRONTEND_CATEGORY_MAP } from '@/components/meditation/meditationUtils';

    const MeditationPage = () => {
      const [activeTab, setActiveTab] = useState(FRONTEND_CATEGORIES[0]);
      const [allSessions, setAllSessions] = useState([]);
      const [loading, setLoading] = useState(true);
      const [userSessionsData, setUserSessionsData] = useState({});
      
      const [activePlayer, setActivePlayer] = useState(null); 
      const [globalMute, setGlobalMute] = useState(false);

      const audioRefs = useRef({});
      const { toast } = useToast();
      const { user } = useAuth();

      useEffect(() => {
        if (user?.id) {
          const storedData = localStorage.getItem(`user_sessions_data_${user.id}`);
          if (storedData) {
            setUserSessionsData(JSON.parse(storedData));
          }
        }
      }, [user?.id]);

      const updateLocalStorageUserSessions = (newData) => {
        if (user?.id) {
          localStorage.setItem(`user_sessions_data_${user.id}`, JSON.stringify(newData));
        }
      };

      useEffect(() => {
        const fetchAllSessions = async () => {
          setLoading(true);
          const { data, error } = await supabase
            .from('meditation_sessions')
            .select('*');

          if (error) {
            console.error('Error fetching all sessions:', error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Could not fetch meditation sessions. Please try again later.",
            });
            setAllSessions([]);
          } else {
            setAllSessions(data || []);
          }
          setLoading(false);
        };

        fetchAllSessions();
        
        return () => {
          Object.values(audioRefs.current).forEach(audio => {
            if (audio) audio.pause();
          });
        };
      }, [toast]);
      
      const sessionsForActiveTab = useMemo(() => {
        if (!activeTab || allSessions.length === 0) return [];
        return allSessions.filter(session => {
          const frontendCategory = SUPABASE_FOLDER_TO_FRONTEND_CATEGORY_MAP[session.category] || session.category;
          return frontendCategory === activeTab;
        });
      }, [allSessions, activeTab]);

      const handleTabChange = (newTab) => {
        if (activePlayer?.audioRef) {
          activePlayer.audioRef.pause();
        }
        setActivePlayer(null);
        setActiveTab(newTab);
      };
      
      const toggleMasterMute = () => {
        const newMutedState = !globalMute;
        setGlobalMute(newMutedState);
        if (activePlayer?.audioRef) {
          activePlayer.audioRef.muted = newMutedState;
        }
      };
      
      const onSessionPlay = (session, audioRef) => {
        if (activePlayer && activePlayer.sessionId !== session.id && audioRefs.current[activePlayer.sessionId]) {
          audioRefs.current[activePlayer.sessionId].pause();
        }
        setActivePlayer({ sessionId: session.id, audioRef: audioRef });
        
        const newUserData = { ...userSessionsData };
        if (!newUserData[session.id]) {
            newUserData[session.id] = { favorited: false, completed: false, played_at: null };
        }
        newUserData[session.id].played_at = new Date().toISOString();
        setUserSessionsData(newUserData);
        updateLocalStorageUserSessions(newUserData);
      };

      const onSessionPause = (session) => {
        // If the paused session is the active player, clear it
        if (activePlayer && activePlayer.sessionId === session.id) {
          // setActivePlayer(null); // Or keep it to resume, depending on desired UX
        }
      };

      const onSessionEnd = (session) => {
        if (activePlayer && activePlayer.sessionId === session.id) {
         setActivePlayer(null);
        }
        const newUserData = { ...userSessionsData };
        if (!newUserData[session.id]) {
          newUserData[session.id] = { favorited: false, completed: false, played_at: null };
        }
        newUserData[session.id].completed = true;
        newUserData[session.id].played_at = new Date().toISOString(); // Update played_at on completion as well
        setUserSessionsData(newUserData);
        updateLocalStorageUserSessions(newUserData);
        toast({ title: "Session Completed!", description: `"${session.title}" marked as completed.` });
      };

      const toggleFavorite = (sessionId, title) => {
        const newUserData = { ...userSessionsData };
        if (!newUserData[sessionId]) {
          newUserData[sessionId] = { favorited: false, completed: false, played_at: null };
        }
        newUserData[sessionId].favorited = !newUserData[sessionId].favorited;
        setUserSessionsData(newUserData);
        updateLocalStorageUserSessions(newUserData);
        toast({
          title: newUserData[sessionId].favorited ? "Added to Favorites" : "Removed from Favorites",
          description: `"${title}" ${newUserData[sessionId].favorited ? 'is now a favorite.' : 'is no longer a favorite.'}`,
        });
      };


      return (
        <div className="animate-fade-in">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Explore Meditation Sessions</h1>
            <p className="text-lg text-muted-foreground">Find your peace and clarity with our curated collection of guided meditations.</p>
          </motion.div>

          <MeditationTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            categories={FRONTEND_CATEGORIES}
          />
            
          <div className="flex justify-end mb-4">
            <Button variant="ghost" size="icon" onClick={toggleMasterMute} className="text-muted-foreground hover:text-primary">
              {globalMute ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>

          {FRONTEND_CATEGORIES.map(categoryName => (
            activeTab === categoryName && (
              <div key={categoryName}>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : sessionsForActiveTab.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10">No sessions available in this category yet. Stay tuned!</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessionsForActiveTab.map((session, index) => (
                       <MeditationCard
                        key={session.id}
                        session={session}
                        sessionUserData={userSessionsData[session.id] || { favorited: false, completed: false }}
                        audioRef={el => audioRefs.current[session.id] = el}
                        index={index}
                        isCurrentlyActivePlayer={activePlayer?.sessionId === session.id}
                        globalMute={globalMute}
                        onPlay={() => onSessionPlay(session, audioRefs.current[session.id])}
                        onPause={() => onSessionPause(session)}
                        onEnd={() => onSessionEnd(session)}
                        onToggleFavorite={() => toggleFavorite(session.id, session.title)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      );
    };

    export default MeditationPage;