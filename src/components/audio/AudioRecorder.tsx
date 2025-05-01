
import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WaveformVisualizer from "./WaveformVisualizer";
import { toast } from "sonner";

interface AudioRecorderProps {
  onSave: (audioBlob: Blob, name: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [trackName, setTrackName] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
    
    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request microphone access
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
      setRecordingTime(0);
      
      // Start timer for recording duration
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          
          // Auto stop after 30 seconds
          if (newTime >= 30 && mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            stopRecording();
            return 30;
          }
          
          return newTime;
        });
      }, 1000);
      
      toast.info("Recording started. Max duration: 30 seconds");
    } catch (err) {
      console.error("Error starting recording:", err);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Stop all media tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      
      toast.success("Recording finished!");
    }
  };

  const playAudio = () => {
    if (audioRef.current && audioBlob) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSave = () => {
    if (audioBlob && trackName.trim()) {
      onSave(audioBlob, trackName.trim());
      setTrackName("");
      setAudioBlob(null);
      toast.success(`Track "${trackName}" saved successfully`);
    } else {
      toast.error("Please provide a name for your track");
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
          
          {isRecording && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {recordingTime}s / 30s
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {!isRecording && !audioBlob && (
            <Button 
              onClick={startRecording} 
              variant="outline" 
              className="flex-1"
              type="button"
            >
              <Mic className="mr-2 h-4 w-4" />
              Record Loop (30s max)
            </Button>
          )}
          
          {isRecording && (
            <Button 
              onClick={stopRecording} 
              variant="destructive" 
              className="flex-1 animate-pulse"
              type="button"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          )}
          
          {audioBlob && !isPlaying && (
            <Button 
              onClick={playAudio} 
              variant="outline" 
              className="flex-1"
              type="button"
            >
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
                className="flex-1"
              />
              <Button 
                onClick={handleSave} 
                disabled={!trackName.trim()}
                type="button"
              >
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
