
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import { Music } from "lucide-react";

const Auth: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // Redirect to home if already logged in
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-soundboard-purple/20 mb-4">
            <Music size={48} className="text-soundboard-purple" />
          </div>
          <h1 className="text-3xl font-bold mb-2">SoundBoard</h1>
          <p className="text-gray-400">
            Collaborative jam sessions made simple
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : (
          <AuthForm />
        )}
      </div>
    </div>
  );
};

export default Auth;
