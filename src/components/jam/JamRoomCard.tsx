
import React from "react";
import { Link } from "react-router-dom";
import { Music, Users, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface JamRoomProps {
  id: string;
  title: string;
  bpm: number;
  key: string;
  isPublic: boolean;
  host: string;
  activeUsers: number;
  trackCount: number;
  createdAt: string;
}

const JamRoomCard: React.FC<JamRoomProps> = ({
  id,
  title,
  bpm,
  key,
  isPublic,
  host,
  activeUsers,
  trackCount,
  createdAt,
}) => {
  // Format relative time (e.g., "2 hours ago")
  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <Card className="overflow-hidden hover:border-soundboard-purple transition-all duration-200">
      <CardContent className="p-0">
        <Link to={`/jam/${id}`} className="block p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-sm text-gray-400">Hosted by {host}</p>
            </div>
            
            <Badge variant={isPublic ? "outline" : "secondary"}>
              {isPublic ? "Public" : "Private"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center">
              <Users size={16} className="mr-1 text-gray-400" />
              <span className="text-sm">{activeUsers} active</span>
            </div>
            
            <div className="flex items-center">
              <Music size={16} className="mr-1 text-gray-400" />
              <span className="text-sm">{trackCount} tracks</span>
            </div>
            
            <div className="flex items-center">
              <Clock size={16} className="mr-1 text-gray-400" />
              <span className="text-sm">{getRelativeTime(createdAt)}</span>
            </div>
          </div>
        </Link>
      </CardContent>
      
      <CardFooter className="px-6 py-3 bg-secondary flex justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">BPM: {bpm}</span>
          <div className="w-[1px] h-4 bg-gray-600"></div>
          <span className="text-xs font-medium">Key: {key}</span>
        </div>
        
        <Link to={`/jam/${id}`} className="text-soundboard-purple text-sm font-medium hover:underline">
          Join Session
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JamRoomCard;
