
import { Track } from "@/components/audio/TrackMixer";

export const downloadAudioFile = (url: string, filename: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const mixdownTracks = async (
  tracks: Track[],
  activeTracksMap: Record<string, boolean>,
  volumeMap: Record<string, number>
): Promise<Blob> => {
  // Create a new AudioContext
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Load all audio buffer promises
  const bufferPromises = tracks
    .filter(track => activeTracksMap[track.id])
    .map(async track => {
      try {
        // Fetch the audio file
        const response = await fetch(track.audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        // Decode the audio data
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        return {
          buffer: audioBuffer,
          volume: (volumeMap[track.id] || 80) / 100, // Convert percentage to 0-1 range
          id: track.id
        };
      } catch (error) {
        console.error(`Error loading track ${track.name}:`, error);
        throw error;
      }
    });
  
  try {
    // Wait for all audio buffers to load
    const trackBuffers = await Promise.all(bufferPromises);
    
    // Determine the longest track duration
    const maxDuration = Math.max(...trackBuffers.map(t => t.buffer.duration));
    
    // Create an offline audio context for rendering
    const offlineContext = new OfflineAudioContext(
      2, // stereo output
      audioContext.sampleRate * maxDuration, // total samples
      audioContext.sampleRate
    );
    
    // Create source nodes and connect them to the offline context
    trackBuffers.forEach(track => {
      const source = offlineContext.createBufferSource();
      source.buffer = track.buffer;
      
      // Create a gain node for volume control
      const gainNode = offlineContext.createGain();
      gainNode.gain.value = track.volume;
      
      // Connect source -> gain -> destination
      source.connect(gainNode);
      gainNode.connect(offlineContext.destination);
      
      // Start playback
      source.start(0);
    });
    
    // Render the audio
    const renderedBuffer = await offlineContext.startRendering();
    
    // Convert to WAV format
    const wavBlob = audioBufferToWav(renderedBuffer);
    
    // Close the audio contexts
    audioContext.close();
    
    return wavBlob;
  } catch (error) {
    console.error("Error during mixdown:", error);
    audioContext.close();
    throw error;
  }
};

// Helper function to convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer): Blob {
  // This is a simplified version - in production you'd use a proper library
  // like audioBufferToWav or wav-encoder
  
  const numOfChannels = buffer.numberOfChannels;
  const length = buffer.length * numOfChannels * 2;
  const sampleRate = buffer.sampleRate;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);
  
  // Write WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  
  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numOfChannels * 2, true); // byte rate
  view.setUint16(32, numOfChannels * 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  
  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);
  
  // Write audio data
  const offset = 44;
  const channelData = [];
  
  // Get data from each channel
  for (let i = 0; i < numOfChannels; i++) {
    channelData.push(buffer.getChannelData(i));
  }
  
  // Interleave the channel data and convert to 16-bit PCM
  let sample = 0;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChannels; channel++) {
      // Convert float to int16
      const value = Math.max(-1, Math.min(1, channelData[channel][i]));
      const int16 = value < 0 ? value * 0x8000 : value * 0x7FFF;
      view.setInt16(offset + sample * 2, int16, true);
      sample++;
    }
  }
  
  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
