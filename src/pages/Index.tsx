
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Music } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import JamRoomCard, { JamRoomProps } from "@/components/jam/JamRoomCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateJamRoomModal from "@/components/jam/CreateJamRoomModal";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const Index: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { user } = useAuth();

  // Fetch public jam rooms
  const { data: publicJams = [], isLoading: publicLoading } = useQuery({
    queryKey: ['publicJams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jam_rooms')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      return (data || []).map(room => ({
        id: room.id,
        title: room.title,
        bpm: room.bpm,
        key: room.key,
        isPublic: room.is_public,
        host: room.host_name,
        activeUsers: 1, // This would come from a real-time count in production
        trackCount: 0, // This would be calculated in production
        createdAt: room.created_at,
      }));
    },
  });
  
  // Fetch user's jam rooms (if logged in)
  const { data: myJams = [], isLoading: myJamsLoading } = useQuery({
    queryKey: ['myJams', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('jam_rooms')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return (data || []).map(room => ({
        id: room.id,
        title: room.title,
        bpm: room.bpm,
        key: room.key,
        isPublic: room.is_public,
        host: room.host_name,
        activeUsers: 1,
        trackCount: 0,
        createdAt: room.created_at,
      }));
    },
    enabled: !!user,
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h1 className="text-4xl font-bold mb-4">Collaborative Jam Sessions</h1>
            <p className="text-gray-400 text-lg">
              Create, record, and collaborate on music with musicians from around the world.
              No complex DAW required.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => setCreateModalOpen(true)} 
              className="text-lg py-6 px-8"
              disabled={!user}
            >
              <Plus className="mr-2 h-5 w-5" />
              {user ? "Create Jam Room" : "Sign In to Create"}
            </Button>
          </div>
        </section>
        
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Browse Jam Rooms</h2>
          </div>
          
          <Tabs defaultValue="public">
            <TabsList>
              <TabsTrigger value="public">Public Jams</TabsTrigger>
              {user && <TabsTrigger value="my">My Jams</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="public" className="mt-6">
              {publicLoading ? (
                <div className="text-center py-12 text-gray-400">
                  Loading jam rooms...
                </div>
              ) : publicJams.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                  <Music className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No public jams yet</h3>
                  <p className="text-gray-400 mb-4">
                    Be the first to create a collaborative jam session.
                  </p>
                  <Button 
                    onClick={() => setCreateModalOpen(true)}
                    disabled={!user}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Jam Room
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publicJams.map((jam) => (
                    <Link to={`/jam/${jam.id}`} key={jam.id} className="block">
                      <JamRoomCard {...jam} />
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {user && (
              <TabsContent value="my" className="mt-6">
                {myJamsLoading ? (
                  <div className="text-center py-12 text-gray-400">
                    Loading your jam rooms...
                  </div>
                ) : myJams.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                    <Music className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">You haven't created any jams yet</h3>
                    <p className="text-gray-400 mb-4">
                      Start your first collaborative jam session now.
                    </p>
                    <Button onClick={() => setCreateModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Jam Room
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myJams.map((jam) => (
                      <Link to={`/jam/${jam.id}`} key={jam.id} className="block">
                        <JamRoomCard {...jam} />
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </section>
      </div>
      
      <CreateJamRoomModal 
        isOpen={createModalOpen} 
        onOpenChange={setCreateModalOpen} 
      />
    </MainLayout>
  );
};

export default Index;
