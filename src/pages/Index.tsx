
import React from "react";
import { Link } from "react-router-dom";
import { Music, Users, BellRing } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import JamRoomCard, { JamRoomProps } from "@/components/jam/JamRoomCard";
import { Button } from "@/components/ui/button";

const Index: React.FC = () => {
  // Mock data for featured jam rooms
  const featuredJams: JamRoomProps[] = [
    {
      id: "jam-1",
      title: "Late Night Jazz Session",
      bpm: 90,
      key: "Cm",
      isPublic: true,
      host: "JazzMaster",
      activeUsers: 4,
      trackCount: 8,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "jam-2",
      title: "Rock Jam - Guitar Focus",
      bpm: 120,
      key: "Em",
      isPublic: true,
      host: "GuitarHero",
      activeUsers: 3,
      trackCount: 6,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "jam-3",
      title: "Hip Hop Beat Workshop",
      bpm: 85,
      key: "Gm",
      isPublic: true,
      host: "BeatMaker",
      activeUsers: 7,
      trackCount: 12,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-soundboard-purple to-soundboard-blue bg-clip-text text-transparent">
            Create Music Together, Anywhere
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Record audio loops, collaborate with musicians worldwide, and mix tracks in real-time. 
            No complex software needed.
          </p>
          
          <div className="flex justify-center gap-4 mb-12">
            <Button size="lg" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/explore">Explore Jams</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-soundboard-purple/20 flex items-center justify-center mb-3">
                <Music size={24} className="text-soundboard-purple" />
              </div>
              <h3 className="font-medium mb-1">Create Jam Rooms</h3>
              <p className="text-sm text-gray-400">
                Set BPM, key, and invite collaborators
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-soundboard-blue/20 flex items-center justify-center mb-3">
                <BellRing size={24} className="text-soundboard-blue" />
              </div>
              <h3 className="font-medium mb-1">Record & Share Loops</h3>
              <p className="text-sm text-gray-400">
                Capture ideas with our simple recorder
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-soundboard-pink/20 flex items-center justify-center mb-3">
                <Users size={24} className="text-soundboard-pink" />
              </div>
              <h3 className="font-medium mb-1">Collaborate Live</h3>
              <p className="text-sm text-gray-400">
                Mix tracks and export your final jam
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Jams Section */}
      <section className="py-12 bg-soundboard-darkblue">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Jam Rooms</h2>
            <Link to="/explore" className="text-soundboard-purple hover:underline">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJams.map((jam) => (
              <JamRoomCard key={jam.id} {...jam} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to start jamming?</h2>
          <p className="text-gray-300 mb-8">
            Join musicians from around the world and create something amazing together.
          </p>
          
          <Button size="lg" asChild>
            <Link to="/signup">Create Your First Jam Room</Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
