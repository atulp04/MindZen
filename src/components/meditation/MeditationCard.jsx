import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Headphones, Heart, CheckCircle, Globe, Clock, PlayCircle, RotateCcw } from 'lucide-react';
    import { formatDuration, getSessionImage, getSessionCaption, SUPABASE_FOLDER_TO_FRONTEND_CATEGORY_MAP } from './meditationUtils';

    const MeditationCard = ({ 
      session, 
      sessionUserData, 
      audioRef, 
      index, 
      onPlay,
      onEnd,
      onToggleFavorite 
    }) => {
      
      const displayCategory = SUPABASE_FOLDER_TO_FRONTEND_CATEGORY_MAP[session.category] || session.category;
      const imageUrl = getSessionImage(session, index);
      const caption = getSessionCaption(session);

      const handleAudioPlay = () => {
        if (onPlay) {
          onPlay(session, audioRef.current); 
        }
      };

      const handleAudioEnded = () => {
        if (onEnd) {
          onEnd(session);
        }
      };

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-2xl bg-card/80 backdrop-blur-sm">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                alt={`${session.title} - ${displayCategory}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={imageUrl} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute top-3 right-3 flex items-center space-x-2">
                {sessionUserData.completed && (
                  <CheckCircle className="h-6 w-6 text-green-400" title="Completed" />
                )}
                <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(session.id, session.title)} className="text-white/80 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white/20">
                  <Heart className={`h-5 w-5 ${sessionUserData.favorited ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl group-hover:text-primary transition-colors">{session.title}</CardTitle>
              <div className="text-xs text-muted-foreground mt-1 flex items-center flex-wrap gap-x-3 gap-y-1">
                <span className="flex items-center"><Headphones className="h-3.5 w-3.5 mr-1 text-primary/80" /> {displayCategory}</span>
                <span className="flex items-center"><Globe className="h-3.5 w-3.5 mr-1" /> {session.language || "N/A"}</span>
                <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1" /> {formatDuration(session.duration)}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow pt-2 flex flex-col">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {caption}
              </p>
              <div className="mt-auto">
                <audio
                  ref={audioRef}
                  controls
                  preload="metadata"
                  src={session.audio_file_url}
                  onPlay={handleAudioPlay}
                  onEnded={handleAudioEnded}
                  className="w-full"
                  onError={(e) => {
                    console.error(`Error loading audio for ${session.title}:`, session.audio_file_url, e.target.error);
                  }}
                >
                  Your browser does not support the audio element. Please try a different browser.
                </audio>
              </div>
            </CardContent>
             {/* Removed the custom play button section as native controls are now visible */}
          </Card>
        </motion.div>
      );
    };

    export default MeditationCard;