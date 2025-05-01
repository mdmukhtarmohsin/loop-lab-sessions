
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Download, Share, Settings, Users } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import AudioRecorder from "@/components/audio/AudioRecorder";
import TrackMixer, { Track } from "@/components/audio/TrackMixer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const JamRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // State for jam room data
  const [jamRoom, setJamRoom] = useState({
    id: id || "jam-1",
    title: "Late Night Jazz Session",
    bpm: 90,
    key: "Cm",
    isPublic: true,
    host: "JazzMaster",
    users: ["JazzMaster", "GuitarHero", "BeatMaker", "You"],
  });
  
  // State for tracks
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: "track-1",
      name: "Baseline Groove",
      audioUrl: "#", // In a real app, this would be a valid URL
      user: "JazzMaster",
      createdAt: new Date().toISOString(),
    },
    {
      id: "track-2",
      name: "Piano Chords",
      audioUrl: "#",
      user: "BeatMaker",
      createdAt: new Date().toISOString(),
    },
    {
      id: "track-3",
      name: "Guitar Solo",
      audioUrl: "#",
      user: "GuitarHero",
      createdAt: new Date().toISOString(),
    },
  ]);
  
  // Track polling effect (simulated)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      // In a real app, this would fetch new tracks from the server
      console.log("Polling for new tracks...");
      // Simulate new tracks occasionally
      if (Math.random() > 0.8) {
        console.log("New track found!");
      }
    }, 5000);
    
    return () => clearInterval(pollInterval);
  }, []);
  
  const handleSaveLoop = (audioBlob: Blob, name: string) => {
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      name,
      audioUrl: URL.createObjectURL(audioBlob), // In a real app, we'd upload this to a server
      user: "You",
      createdAt: new Date().toISOString(),
    };
    
    setTracks((prev) => [newTrack, ...prev]);
  };
  
  const handleDeleteTrack = (id: string) => {
    // Only let users delete their own tracks
    setTracks((prev) => prev.filter((track) => track.id !== id || track.user !== "You"));
  };
  
  const handleExportMixdown = () => {
    // In a real app, this would use Web Audio API to mix and download tracks
    alert("Mixdown export would happen here. This would combine all active tracks into one audio file.");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          {/* Left column - Room info and controls */}
          <div className="w-full lg:w-1/3">
            <div className="bg-soundboard-darkblue rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{jamRoom.title}</h1>
                  <p className="text-sm text-gray-400">Hosted by {jamRoom.host}</p>
                </div>
                <Badge variant={jamRoom.isPublic ? "outline" : "secondary"}>
                  {jamRoom.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-secondary rounded p-3 text-center">
                  <p className="text-sm text-gray-400">BPM</p>
                  <p className="text-xl font-bold">{jamRoom.bpm}</p>
                </div>
                <div className="bg-secondary rounded p-3 text-center">
                  <p className="text-sm text-gray-400">Key</p>
                  <p className="text-xl font-bold">{jamRoom.key}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Room Members</p>
                <div className="flex flex-wrap gap-2">
                  {jamRoom.users.map((user) => (
                    <Badge key={user} variant="secondary">
                      {user} {user === "You" && "👋"}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button onClick={handleExportMixdown} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Mixdown
                </Button>
                <Button variant="outline" className="w-full">
                  <Share className="mr-2 h-4 w-4" />
                  Invite Musicians
                </Button>
                <Button variant="ghost" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Room Settings
                </Button>
              </div>
            </div>
            
            <div className="bg-soundboard-darkblue rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Record New Loop</h2>
              <AudioRecorder onSave={handleSaveLoop} />
            </div>
          </div>
          
          {/* Right column - Track mixer */}
          <div className="w-full lg:w-2/3">
            <div className="bg-soundboard-darkblue rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Track Mixer</h2>
              
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Tracks ({tracks.length})</TabsTrigger>
                  <TabsTrigger value="your">Your Tracks ({tracks.filter(t => t.user === "You").length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  <TrackMixer 
                    tracks={tracks} 
                    onDeleteTrack={(id) => {
                      const trackToDelete = tracks.find(t => t.id === id);
                      if (trackToDelete && trackToDelete.user === "You") {
                        handleDeleteTrack(id);
                      }
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="your" className="mt-4">
                  <TrackMixer 
                    tracks={tracks.filter(t => t.user === "You")} 
                    onDeleteTrack={handleDeleteTrack}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="text-center text-sm text-gray-400">
                <p>Tracks automatically sync every 5 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JamRoom;
