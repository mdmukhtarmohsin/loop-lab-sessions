
import React from "react";
import { Link } from "react-router-dom";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

const NotFoundCustom: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <Music size={64} className="text-soundboard-purple mb-6" />
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-gray-400 mb-8">
            Oops! The jam session you're looking for doesn't exist or has ended.
          </p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFoundCustom;
