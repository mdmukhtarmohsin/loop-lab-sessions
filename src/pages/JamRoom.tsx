
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, Share, Settings, Users } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import AudioRecorder from "@/components/audio/AudioRecorder";
import TrackMixer, { Track } from "@/components/audio/TrackMixer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const JamRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  // Fetch jam room data
  const { data: jamRoom, isLoading: roomLoading, error: roomError } = useQuery({
    queryKey: ['jamRoom', id],
    queryFn: async () => {
      if (!id) throw new Error('No jam room ID provided');
      
      const { data, error } = await supabase
        .from('jam_rooms')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (!data) throw new Error('Jam room not found');
      
      return {
        id: data.id,
        title: data.title,
        bpm: data.bpm,
        key: data.key,
        isPublic: data.is_public,
        host: data.host_name,
        users: ['You'], // In a real app, this would be fetched from a participants table
      };
    },
    retry: false,
    onError: (error) => {
      console.error('Error fetching jam room:', error);
      toast.error('Could not find jam room');
      navigate('/');
    }
  });
  
  // Fetch tracks for this jam room
  const { data: trackData, refetch: refetchTracks } = useQuery({
    queryKey: ['tracks', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('jam_room_id', id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return (data || []).map(track => ({
        id: track.id,
        name: track.name,
        audioUrl: track.audio_url,
        user: track.user_name,
        createdAt: track.created_at,
      }));
    },
  });
  
  const [tracks, setTracks] = useState<Track[]>([]);
  
  // Update tracks when data is fetched
  useEffect(() => {
    if (trackData) {
      setTracks(trackData);
    }
  }, [trackData]);
  
  // Create mutation for saving tracks
  const saveTrackMutation = useMutation({
    mutationFn: async (params: { audioBlob: Blob, name: string }) => {
      if (!id || !user || !profile) throw new Error('Missing required data');
      
      // In a real app, you would upload the blob to Supabase Storage
      // For now, we'll use a placeholder URL
      const audioUrl = URL.createObjectURL(params.audioBlob);
      
      const trackData = {
        jam_room_id: id,
        name: params.name,
        audio_url: audioUrl, // This would be a real URL in production
        user_id: user.id,
        user_name: profile.username,
      };
      
      const { data, error } = await supabase
        .from('tracks')
        .insert(trackData)
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      toast.success('Track saved successfully');
      refetchTracks();
    },
    onError: (error) => {
      console.error('Error saving track:', error);
      toast.error('Failed to save track');
    }
  });
  
  const handleSaveLoop = (audioBlob: Blob, name: string) => {
    saveTrackMutation.mutate({ audioBlob, name });
  };
  
  // Delete track mutation
  const deleteTrackMutation = useMutation({
    mutationFn: async (trackId: string) => {
      const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', trackId)
        .eq('user_id', user?.id || ''); // Ensure users can only delete their own tracks
        
      if (error) throw error;
      
      return trackId;
    },
    onSuccess: (trackId) => {
      setTracks(prev => prev.filter(track => track.id !== trackId));
      toast.success('Track deleted');
    },
    onError: (error) => {
      console.error('Error deleting track:', error);
      toast.error('Failed to delete track');
    }
  });
  
  const handleDeleteTrack = (id: string) => {
    deleteTrackMutation.mutate(id);
  };
  
  // Track polling effect
  useEffect(() => {
    if (!id) return;
    
    const interval = setInterval(() => {
      refetchTracks();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id, refetchTracks]);
  
  const handleExportMixdown = () => {
    // In a real app, this would use Web Audio API to mix and download tracks
    toast.success('Mixdown would be exported here in a real app');
  };

  if (roomLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          Loading jam room...
        </div>
      </MainLayout>
    );
  }

  if (roomError || !jamRoom) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          Error loading jam room. Please try again.
        </div>
      </MainLayout>
    );
  }

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
                {user && profile && jamRoom.host === profile.username && (
                  <Button variant="ghost" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Room Settings
                  </Button>
                )}
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
                  <TabsTrigger value="your">Your Tracks ({tracks.filter(t => t.user === profile?.username).length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  <TrackMixer 
                    tracks={tracks} 
                    onDeleteTrack={(id) => {
                      const trackToDelete = tracks.find(t => t.id === id);
                      if (trackToDelete && trackToDelete.user === profile?.username) {
                        handleDeleteTrack(id);
                      }
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="your" className="mt-4">
                  <TrackMixer 
                    tracks={tracks.filter(t => t.user === profile?.username)} 
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
