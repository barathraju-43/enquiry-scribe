import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import RecipeGenerator from '@/components/RecipeGenerator';
import UserNav from '@/components/UserNav';
import heroImage from '@/assets/hero-cooking.jpg';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            SmartPantry AI
          </h1>
          <UserNav />
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-64 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/60" />
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center space-y-4 px-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                AI Recipe Generator
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl">
                Turn your ingredients into culinary masterpieces with AI-powered recipe suggestions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-16">
        <RecipeGenerator />
      </div>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Powered by AI • Made with ❤️ for home cooks everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;