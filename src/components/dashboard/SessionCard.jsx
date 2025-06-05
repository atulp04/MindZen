import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Clock, RotateCcw, Heart } from 'lucide-react';

const SessionCard = ({ session, onPlayAgain, showPlayedAt, formatDuration, formatPlayedAt, isFavorite }) => {
  const sessionData = session.meditation_sessions;
  
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="p-4 rounded-lg border bg-background/70 hover:bg-secondary/50 transition-colors shadow-sm"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-foreground truncate">{sessionData.title}</h4>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center">
                <Brain className="h-3 w-3 mr-1" />
                {sessionData.category}
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDuration(sessionData.duration)}
              </span>
            </div>
            {showPlayedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatPlayedAt(session.played_at)}
              </p>
            )}
          </div>
          {isFavorite && (
            <Heart className="h-4 w-4 text-pink-500 fill-current flex-shrink-0" />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onPlayAgain}
            className="flex-1 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Play Again
          </Button>
          {sessionData.audio_file_url && (
            <audio 
              controls 
              preload="none"
              className="h-8 flex-1"
              style={{ fontSize: '10px' }}
            >
              <source src={sessionData.audio_file_url} type="audio/mpeg" />
            </audio>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SessionCard;