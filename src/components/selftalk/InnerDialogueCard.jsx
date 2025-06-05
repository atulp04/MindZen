import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Headphones, MessageSquare, Languages, Repeat, Play, Pause } from 'lucide-react';
import { loopOptions } from './selfTalkUtils';

const InnerDialogueCard = ({ dialogue, index, sectionType }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopCount, setLoopCount] = useState(1);
  const [currentLoop, setCurrentLoop] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const cardColor = sectionType === 'professionals' ? 'bg-primary/5' : 'bg-accent/5';
  const accentColor = sectionType === 'professionals' ? 'text-primary' : 'text-accent';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handleAudioEnd = () => {
      if (currentLoop < loopCount - 1) {
        setCurrentLoop(prev => prev + 1);
        audio.currentTime = 0;
        audio.play().catch(e => console.error("Error replaying audio:", e));
      } else {
        setIsPlaying(false);
        setCurrentLoop(0);
        setCurrentTime(0); 
      }
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleAudioEnd);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, [audioRef, loopCount, currentLoop]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setCurrentLoop(0); 
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="h-full"
    >
      <Card className={`overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-2xl ${cardColor} backdrop-blur-sm`}>
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            alt={dialogue.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
           src="https://images.unsplash.com/photo-1683825094320-636dd592c0a0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className={`absolute top-3 right-3 p-1.5 rounded-full bg-background/80 ${accentColor}`}>
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>
        <CardHeader className="pb-3">
          <CardTitle className={`text-xl group-hover:${accentColor} transition-colors`}>{dialogue.title}</CardTitle>
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <Languages className="h-3.5 w-3.5 mr-1.5" /> {dialogue.language}
          </div>
        </CardHeader>
        <CardContent className="flex-grow pt-0">
          <CardDescription className="text-sm line-clamp-3 mb-3">{dialogue.description}</CardDescription>
          
          <div className="space-y-2 mb-3">
            <Label htmlFor={`loop-select-${dialogue.id}`} className="text-xs text-muted-foreground">Play this audio:</Label>
            <Select
              value={String(loopCount)}
              onValueChange={(value) => setLoopCount(Number(value))}
              disabled={isPlaying}
            >
              <SelectTrigger id={`loop-select-${dialogue.id}`} className="h-9 text-xs">
                <SelectValue placeholder="Select loops" />
              </SelectTrigger>
              <SelectContent>
                {loopOptions.map(option => (
                  <SelectItem key={option.value} value={String(option.value)} className="text-xs">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <audio ref={audioRef} src={dialogue.audioUrl} preload="metadata" className="hidden" />
          
          {duration > 0 && (
            <div className="text-xs text-muted-foreground mb-1">
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              {loopCount > 1 && <span> (Loop {currentLoop + 1} of {loopCount})</span>}
            </div>
          )}
           <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              if (audioRef.current) {
                audioRef.current.currentTime = Number(e.target.value);
                setCurrentTime(Number(e.target.value));
              }
            }}
            className="w-full h-1.5 bg-muted-foreground/30 rounded-lg appearance-none cursor-pointer accent-primary dark:accent-primary mb-3"
            disabled={!duration}
          />


        </CardContent>
        <CardFooter>
          <Button 
            onClick={handlePlayPause} 
            className={`w-full bg-gradient-to-r ${sectionType === 'professionals' ? 'from-primary to-purple-600' : 'from-accent to-teal-600'} hover:opacity-90 transition-opacity`}
            disabled={!dialogue.audioUrl || dialogue.audioUrl === "#"}
          >
            {isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default InnerDialogueCard;
