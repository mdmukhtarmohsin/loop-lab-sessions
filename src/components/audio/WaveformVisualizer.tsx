
import React, { useEffect, useRef } from "react";

interface WaveformVisualizerProps {
  isPlaying: boolean;
  isRecording?: boolean;
  color?: string;
  className?: string;
  barCount?: number;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isPlaying,
  isRecording = false,
  color = "bg-soundboard-purple",
  className = "",
  barCount = 32,
}) => {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Mock animation for waveform visualization
  useEffect(() => {
    if (!isPlaying && !isRecording) return;
    
    const bars = barsRef.current.filter(Boolean) as HTMLDivElement[];
    
    bars.forEach((bar, i) => {
      const randomHeight = Math.floor(Math.random() * 70) + 30;
      const animationDelay = `${i * 0.05}s`;
      
      bar.style.height = isPlaying || isRecording ? `${randomHeight}%` : "10%";
      bar.style.animationDelay = animationDelay;
    });
    
    const interval = setInterval(() => {
      if (!isPlaying && !isRecording) return;
      
      bars.forEach((bar) => {
        const randomHeight = Math.floor(Math.random() * 70) + 30;
        bar.style.height = `${randomHeight}%`;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, [isPlaying, isRecording]);

  return (
    <div className={`flex items-center justify-center h-20 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (barsRef.current[i] = el)}
          className={`waveform-bar ${color} mx-[1px] transition-all duration-200`}
          style={{
            height: "10%",
          }}
        />
      ))}
      
      {isRecording && (
        <div className="recording-dot absolute -top-2 right-2" />
      )}
    </div>
  );
};

export default WaveformVisualizer;
