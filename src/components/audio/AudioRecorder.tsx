
import React, { useState, useRef } from "react";
import { Mic, Square, Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WaveformVisualizer from "./WaveformVisualizer";

interface AudioRecorderProps {
  onSave: (audioBlob: Blob, name: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [trackName, setTrackName] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        
        // Create audio element for playback
        if (audioRef.current) {
          audioRef.current.src = URL.createObjectURL(audioBlob);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          stopRecording();
        }
      }, 30000);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all media tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const playAudio = () => {
    if (audioRef.current && audioBlob) {
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const handleSave = () => {
    if (audioBlob && trackName.trim()) {
      onSave(audioBlob, trackName.trim());
      setTrackName("");
      setAudioBlob(null);
    }
  };

  return (
    <div className="bg-soundboard-darkblue rounded-md p-4 relative">
      <audio ref={audioRef} className="hidden" />
      
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <WaveformVisualizer 
            isPlaying={isPlaying} 
            isRecording={isRecording}
            color="bg-soundboard-pink" 
          />
        </div>
        
        <div className="flex space-x-2">
          {!isRecording && !audioBlob && (
            <Button onClick={startRecording} variant="outline" className="flex-1">
              <Mic className="mr-2 h-4 w-4" />
              Record Loop (30s max)
            </Button>
          )}
          
          {isRecording && (
            <Button onClick={stopRecording} variant="destructive" className="flex-1">
              <Square className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          )}
          
          {audioBlob && !isPlaying && (
            <Button onClick={playAudio} variant="outline" className="flex-1">
              <Play className="mr-2 h-4 w-4" />
              Play
            </Button>
          )}
          
          {audioBlob && (
            <div className="flex-1 flex space-x-2">
              <Input
                placeholder="Track name"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
              />
              <Button onClick={handleSave} disabled={!trackName.trim()}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
