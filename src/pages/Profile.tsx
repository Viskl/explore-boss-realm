
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ProfileCard from "@/components/profile/ProfileCard";
import StatsSection from "@/components/profile/StatsSection";
import SettingsSection from "@/components/profile/SettingsSection";
import LoadingView from "@/components/profile/LoadingView";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profileLoading, setProfileLoading] = useState(true);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    // Reset loading state when auth state changes
    if (!authLoading) {
      // Short timeout to ensure UI renders smoothly
      const timer = setTimeout(() => {
        setProfileLoading(false);
      }, 500);
      
      if (!user) {
        navigate("/auth");
      }
      
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, navigate]);
  
  // Check if we're still loading auth or profile data
  const isLoading = authLoading || profileLoading;
  
  if (isLoading) {
    return <LoadingView />;
  }
  
  if (!user) {
    return null; // Will redirect to auth due to useEffect
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-background px-6 py-8">
        <h2 className="text-xl font-bold text-center">Profile Not Found</h2>
        <p className="text-muted-foreground text-center mt-2">
          There was an issue loading your profile. Please try signing out and back in.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            leftIcon={<LogOut size={16} />}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-6 py-8 max-w-lg mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account</p>
        </header>
        
        <ProfileCard profile={profile} userEmail={user.email} />
        <StatsSection profile={profile} />
        <SettingsSection />
        
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full justify-start"
          leftIcon={<LogOut size={16} />}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
