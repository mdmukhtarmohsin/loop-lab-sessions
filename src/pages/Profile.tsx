
import React from "react";
import { Music, Mic, Download, Clock } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JamRoomCard, { JamRoomProps } from "@/components/jam/JamRoomCard";

const Profile: React.FC = () => {
  // Mock user data
  const user = {
    name: "Audio Explorer",
    username: "audioexplorer",
    joinDate: "January 2023",
    bio: "Musician, producer, and collaborative jam enthusiast. Let's make some music together!",
    stats: {
      jamRoomsHosted: 12,
      loopsRecorded: 47,
      mixdownExports: 8,
      avgLoopsPerSession: 3.9,
    },
  };
  
  // Mock data for user's jam rooms
  const userJams: JamRoomProps[] = [
    {
      id: "user-jam-1",
      title: "Funk Session #12",
      bpm: 110,
      key: "Dm",
      isPublic: true,
      host: user.username,
      activeUsers: 2,
      trackCount: 5,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: "user-jam-2",
      title: "Ambient Space Loops",
      bpm: 70,
      key: "C",
      isPublic: false,
      host: user.username,
      activeUsers: 1,
      trackCount: 3,
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - User info and stats */}
          <div className="w-full md:w-1/3">
            <div className="bg-soundboard-darkblue rounded-lg p-6 mb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 bg-soundboard-purple/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">{user.name.charAt(0)}</span>
                </div>
                
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-400">@{user.username}</p>
                <p className="text-sm text-gray-500 mt-1">Member since {user.joinDate}</p>
              </div>
              
              <p className="text-sm text-gray-300 mb-6">
                {user.bio}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-gray-400">Jam Rooms Hosted</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center">
                      <Music className="h-5 w-5 text-soundboard-purple mr-2" />
                      <span className="text-2xl font-bold">{user.stats.jamRoomsHosted}</span>
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
                      <span className="text-2xl font-bold">{user.stats.loopsRecorded}</span>
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
                      <span className="text-2xl font-bold">{user.stats.mixdownExports}</span>
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
                      <span className="text-2xl font-bold">{user.stats.avgLoopsPerSession}</span>
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
              
              <div className="space-y-4">
                {userJams.map((jam) => (
                  <JamRoomCard key={jam.id} {...jam} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
