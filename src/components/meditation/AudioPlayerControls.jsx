import React, { useState, useEffect, useCallback } from 'react';
    import { Button } from '@/components/ui/button';
    import { Slider } from '@/components/ui/slider';
    import { PlayCircle, PauseCircle, Volume2, VolumeX, Volume1 } from 'lucide-react';
    import { formatTime } from './meditationUtils';

    const AudioPlayerControls = ({ audioRef, session, isCurrentlyActivePlayer, globalMute, onPlay, onPause, onEnd }) => {
      const [isPlaying, setIsPlaying] = useState(false);
      const [currentTime, setCurrentTime] = useState(0);
      const [duration, setDuration] = useState(0);
      const [volume, setVolume] = useState(0.75);
      const [isMutedByPlayer, setIsMutedByPlayer] = useState(false);

      const effectiveMute = globalMute || isMutedByPlayer;

      const updateAudioProperties = useCallback(() => {
        if (audioRef?.current) {
          setCurrentTime(audioRef.current.currentTime);
          setDuration(audioRef.current.duration || 0);
          setIsPlaying(!audioRef.current.paused);
          setVolume(audioRef.current.volume);
          setIsMutedByPlayer(audioRef.current.muted && !globalMute); 
        }
      }, [audioRef, globalMute]);

      useEffect(() => {
        const audio = audioRef?.current;
        if (!audio) return;

        audio.addEventListener('loadedmetadata', updateAudioProperties);
        audio.addEventListener('timeupdate', updateAudioProperties);
        audio.addEventListener('play', () => { setIsPlaying(true); if (onPlay) onPlay(); });
        audio.addEventListener('pause', () => { setIsPlaying(false); if (onPause) onPause(); });
        audio.addEventListener('ended', () => { setIsPlaying(false); setCurrentTime(0); if (onEnd) onEnd(); });
        audio.addEventListener('volumechange', updateAudioProperties);
        
        // Set initial volume and mute state based on globalMute
        audio.volume = volume;
        audio.muted = globalMute;
        updateAudioProperties();


        return () => {
          audio.removeEventListener('loadedmetadata', updateAudioProperties);
          audio.removeEventListener('timeupdate', updateAudioProperties);
          audio.removeEventListener('play', () => setIsPlaying(true));
          audio.removeEventListener('pause', () => setIsPlaying(false));
          audio.removeEventListener('ended', () => { setIsPlaying(false); setCurrentTime(0); });
          audio.removeEventListener('volumechange', updateAudioProperties);
        };
      }, [audioRef, onPlay, onPause, onEnd, updateAudioProperties, globalMute, volume]);
      
      // Sync globalMute to audio element
      useEffect(() => {
        if (audioRef?.current) {
          audioRef.current.muted = globalMute || isMutedByPlayer;
        }
      }, [globalMute, audioRef, isMutedByPlayer]);


      const handlePlayPause = () => {
        if (!audioRef?.current) return;
        if (audioRef.current.paused) {
          audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        } else {
          audioRef.current.pause();
        }
      };

      const handleSeek = (value) => {
        if (audioRef?.current) {
          audioRef.current.currentTime = value[0];
          setCurrentTime(value[0]);
        }
      };

      const handleVolumeChange = (value) => {
        if (audioRef?.current) {
          const newVolume = value[0];
          audioRef.current.volume = newVolume;
          setVolume(newVolume);
          // If user changes volume, unmute locally unless globally muted
          if (newVolume > 0 && isMutedByPlayer && !globalMute) {
            audioRef.current.muted = false;
            setIsMutedByPlayer(false);
          } else if (newVolume === 0 && !globalMute) {
             audioRef.current.muted = true;
             setIsMutedByPlayer(true);
          }
        }
      };
      
      const toggleLocalMute = () => {
        if (audioRef?.current) {
            const newMuteState = !audioRef.current.muted;
            audioRef.current.muted = newMuteState;
            setIsMutedByPlayer(newMuteState);
            if (newMuteState) setVolume(0); // Reflect mute in volume slider visually
            else if (audioRef.current.volume === 0) setVolume(0.1); // If unmuting and volume was 0, set to small value
        }
      };


      if (!isCurrentlyActivePlayer) {
        return null; // Don't render controls if this card's player isn't the active one
      }

      return (
        <div className="mt-2 space-y-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
            aria-label="Audio progress"
            disabled={!duration}
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handlePlayPause} disabled={!duration}>
              {isPlaying ? <PauseCircle className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-1 flex-grow">
              <Button variant="ghost" size="icon" onClick={toggleLocalMute} disabled={globalMute}>
                {effectiveMute ? <VolumeX className="h-4 w-4"/> : volume > 0.5 ? <Volume2 className="h-4 w-4"/> : volume > 0 ? <Volume1 className="h-4 w-4"/> : <VolumeX className="h-4 w-4"/>}
              </Button>
              <Slider
                value={[effectiveMute ? 0 : volume]}
                max={1}
                step={0.05}
                onValueChange={handleVolumeChange}
                className="w-full max-w-[100px]"
                aria-label="Volume"
                disabled={globalMute}
              />
            </div>
          </div>
        </div>
      );
    };

    export default AudioPlayerControls;