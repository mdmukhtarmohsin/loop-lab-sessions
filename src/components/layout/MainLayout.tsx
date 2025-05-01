
import React from "react";
import { Link } from "react-router-dom";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Mock user state - in a real app, this would come from auth context
  const isLoggedIn = false;
  
  return (
    <div className="min-h-screen bg-soundboard-dark flex flex-col">
      <header className="border-b border-secondary">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Music className="h-6 w-6 text-soundboard-purple" />
            <span className="font-bold text-xl">SoundBoard</span>
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <Link to="/explore" className="text-gray-300 hover:text-white">
                  Explore
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/how-it-works" className="text-gray-300 hover:text-white">
                  How It Works
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button variant="outline" asChild>
                  <Link to="/new-jam">New Jam Room</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/profile">Profile</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="border-t border-secondary py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} SoundBoard. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
