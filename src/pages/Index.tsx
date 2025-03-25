
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, MapPin, Trophy, Sparkles } from "lucide-react";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  
  useEffect(() => {
    // If user is already authenticated, redirect to the map page
    if (user) {
      navigate("/map");
    }
  }, [user, navigate]);
  
  const onboardingSteps = [
    {
      icon: <Compass size={48} className="text-primary" />,
      title: "Discover AR Bosses",
      description: "Explore the real world to find hidden AR boss challenges waiting to be defeated."
    },
    {
      icon: <MapPin size={48} className="text-primary" />,
      title: "Visit Real Locations",
      description: "Bosses are located at interesting places around your city. Explore and conquer!"
    },
    {
      icon: <Trophy size={48} className="text-primary" />,
      title: "Earn Real Rewards",
      description: "Defeat bosses to collect QR codes that unlock special offers at local businesses."
    }
  ];
  
  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/map");
    }
  };
  
  const currentContent = onboardingSteps[currentStep];
  
  return (
    <div className="flex flex-col min-h-screen justify-between bg-gradient-to-b from-background to-secondary/30">
      <header className="px-6 pt-12 pb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles size={28} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">BossHunt</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/auth")}
        >
          Sign In
        </Button>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-md mx-auto flex flex-col items-center text-center">
          <div className="mb-6 w-16 h-16 rounded-full bg-secondary/80 flex items-center justify-center">
            {currentContent.icon}
          </div>
          
          <h2 className="text-2xl font-bold mb-3">{currentContent.title}</h2>
          <p className="text-muted-foreground mb-8">{currentContent.description}</p>
          
          <div className="flex gap-2 mb-10">
            {onboardingSteps.map((_, index) => (
              <div 
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? "w-8 bg-primary" 
                    : "w-3 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          
          <div className="w-full space-y-4">
            <Button
              fullWidth
              size="lg"
              onClick={handleNext}
            >
              {currentStep < onboardingSteps.length - 1 ? "Continue" : "Start Hunting"}
            </Button>
            
            {currentStep < onboardingSteps.length - 1 && (
              <Button
                fullWidth
                variant="ghost"
                onClick={() => navigate("/map")}
              >
                Skip Introduction
              </Button>
            )}
          </div>
        </div>
      </main>
      
      <footer className="px-6 py-4 text-center text-sm text-muted-foreground">
        <p>© 2023 BossHunt. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
