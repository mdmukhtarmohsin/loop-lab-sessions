
import React, { useState } from "react";
import { Volume2, Trash, Play } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import WaveformVisualizer from "./WaveformVisualizer";
import { toast } from "sonner";

export interface Track {
  id: string;
  name: string;
  audioUrl: string;
  user: string;
  createdAt: string;
}

interface TrackMixerProps {
  tracks: Track[];
  onDeleteTrack?: (id: string) => void;
  onExportMixdown?: (
    activeTracksMap: Record<string, boolean>,
    volumeMap: Record<string, number>
  ) => void;
}

const TrackMixer: React.FC<TrackMixerProps> = ({ 
  tracks, 
  onDeleteTrack,
  onExportMixdown
}) => {
  const [activeTracksMap, setActiveTracksMap] = useState<Record<string, boolean>>(
    tracks.reduce((acc, track) => ({ ...acc, [track.id]: true }), {})
  );
  
  const [volumeMap, setVolumeMap] = useState<Record<string, number>>(
    tracks.reduce((acc, track) => ({ ...acc, [track.id]: 80 }), {})
  );
  
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});

  const toggleTrackActive = (trackId: string) => {
    setActiveTracksMap((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));
  };

  const handleVolumeChange = (trackId: string, value: number[]) => {
    setVolumeMap((prev) => ({
      ...prev,
      [trackId]: value[0],
    }));
    
    // Update volume of playing track if needed
    if (audioElements[trackId]) {
      audioElements[trackId].volume = value[0] / 100;
    }
  };

  const handlePlayTrack = (trackId: string, audioUrl: string) => {
    // Stop any currently playing track
    if (playingTrack && audioElements[playingTrack]) {
      audioElements[playingTrack].pause();
      audioElements[playingTrack].currentTime = 0;
    }
    
    // Create or reuse audio element
    let audio = audioElements[trackId];
    if (!audio) {
      audio = new Audio(audioUrl);
      setAudioElements(prev => ({...prev, [trackId]: audio}));
    }
    
    // Set volume and play
    audio.volume = (volumeMap[trackId] || 80) / 100;
    
    audio.onended = () => {
      setPlayingTrack(null);
    };
    
    audio.play().catch(err => {
      console.error("Error playing audio:", err);
      toast.error("Could not play audio. Please try again.");
    });
    setPlayingTrack(trackId);
  };

  // Handle export if needed
  const handleExportClick = () => {
    if (onExportMixdown) {
      onExportMixdown(activeTracksMap, volumeMap);
    }
  };

  if (tracks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No tracks available. Record your first loop!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tracks.map((track) => (
        <div 
          key={track.id}
          className={`bg-soundboard-darkblue rounded-md p-3 flex flex-col transition-opacity duration-200 ${
            !activeTracksMap[track.id] ? "opacity-50" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Switch
                checked={activeTracksMap[track.id] || false}
                onCheckedChange={() => toggleTrackActive(track.id)}
                className="mr-2"
              />
              <span className="text-sm font-medium">{track.name}</span>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{track.user}</span>
              <button 
                onClick={() => handlePlayTrack(track.id, track.audioUrl)}
                className="hover:text-white flex items-center gap-1"
              >
                <Play size={14} />
                {playingTrack === track.id ? "Playing..." : "Play"}
              </button>
              {onDeleteTrack && (
                <button 
                  onClick={() => onDeleteTrack(track.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash size={16} />
                </button>
              )}
            </div>
          </div>
          
          <div className="relative">
            <div
              className="cursor-pointer"
              onClick={() => handlePlayTrack(track.id, track.audioUrl)}
            >
              <WaveformVisualizer 
                isPlaying={playingTrack === track.id}
                color={
                  track.user === "You" 
                    ? "bg-soundboard-purple" 
                    : "bg-soundboard-blue"
                }
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <Volume2 size={16} className="text-gray-400" />
            <Slider
              value={[volumeMap[track.id] || 80]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleVolumeChange(track.id, value)}
              disabled={!activeTracksMap[track.id]}
              className="flex-1"
            />
            <span className="text-xs text-gray-400 w-8">
              {volumeMap[track.id] || 80}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackMixer;
