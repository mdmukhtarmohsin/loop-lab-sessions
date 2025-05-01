
import React, { useEffect, useState } from "react";
import { Music, Mic, Download, Clock } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JamRoomCard from "@/components/jam/JamRoomCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { JamRoomData } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const Profile: React.FC = () => {
  const { user, profile } = useAuth();
  
  const { data: userAnalytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['userAnalytics', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        console.error("Error fetching analytics:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!user
  });
  
  const { data: userJams, isLoading: isJamsLoading } = useQuery({
    queryKey: ['userJams', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('jam_rooms')
        .select('*, tracks(count)')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching jam rooms:", error);
        return [];
      }
      
      return data.map(room => ({
        id: room.id,
        title: room.title,
        bpm: room.bpm,
        key: room.key,
        isPublic: room.is_public,
        host: room.host_name,
        activeUsers: 1, // This would be implemented with real-time functionality later
        trackCount: room.tracks[0].count,
        createdAt: room.created_at
      }));
    },
    enabled: !!user
  });
  
  if (!user || !profile) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">You need to sign in to view your profile</h1>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - User info and stats */}
          <div className="w-full md:w-1/3">
            <div className="bg-soundboard-darkblue rounded-lg p-6 mb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 bg-soundboard-purple/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">{profile.username.charAt(0).toUpperCase()}</span>
                </div>
                
                <h1 className="text-2xl font-bold">{profile.username}</h1>
                <p className="text-sm text-gray-500 mt-1">Member since {new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-gray-400">Jam Rooms Hosted</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center">
                      <Music className="h-5 w-5 text-soundboard-purple mr-2" />
                      <span className="text-2xl font-bold">{userAnalytics?.rooms_hosted || 0}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-gray-400">Loops Recorded</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center">
                      <Mic className="h-5 w-5 text-soundboard-pink mr-2" />
                      <span className="text-2xl font-bold">{userAnalytics?.loops_recorded || 0}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-gray-400">Mixdown Exports</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center">
                      <Download className="h-5 w-5 text-soundboard-blue mr-2" />
                      <span className="text-2xl font-bold">{userAnalytics?.mixdowns_exported || 0}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-gray-400">Avg Loops / Session</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-2xl font-bold">
                        {userAnalytics && userAnalytics.rooms_hosted > 0 
                          ? (userAnalytics.loops_recorded / userAnalytics.rooms_hosted).toFixed(1) 
                          : "0.0"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Right column - User's jam rooms */}
          <div className="w-full md:w-2/3">
            <div className="bg-soundboard-darkblue rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Your Jam Rooms</h2>
              
              {isJamsLoading ? (
                <div className="text-center py-8">Loading your jam rooms...</div>
              ) : userJams && userJams.length > 0 ? (
                <div className="space-y-4">
                  {userJams.map((jam) => (
                    <JamRoomCard key={jam.id} {...jam} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  You haven't created any jam rooms yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
