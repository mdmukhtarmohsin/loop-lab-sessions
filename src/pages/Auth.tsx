
import React from "react";
import { Navigate } from "react-router-dom";
import { Music } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";

const Auth: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-soundboard-purple mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Music size={40} className="text-soundboard-purple" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to SoundBoard</h1>
          <p className="text-gray-400 max-w-md">
            Join our community of musicians to collaborate, create, and share music together in real-time.
          </p>
        </div>
        
        <AuthForm />
        
        <p className="mt-8 text-sm text-gray-500 max-w-md text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy.
          SoundBoard is a platform for musical collaboration and creativity.
        </p>
      </div>
      
      <footer className="border-t border-border py-6 bg-soundboard-dark">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} SoundBoard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
