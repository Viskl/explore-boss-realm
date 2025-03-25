import { useState, useEffect } from "react";
import { User, Medal, Settings, LogOut, ChevronRight, Edit, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
        
        <div className="mb-8 flex items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden border">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-muted-foreground" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="ml-4">
            <h2 className="text-xl font-bold">{profile.username}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <button className="mt-1 text-xs text-primary flex items-center">
              <Edit size={12} className="mr-1" />
              Edit Profile
            </button>
          </div>
        </div>
        
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4">Stats</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Bosses Defeated"
              value={profile.bosses_defeated.toString()}
              icon={<Trophy />}
            />
            <StatCard
              label="Rewards Earned"
              value={profile.rewards_earned.toString()}
              icon={<Reward />}
            />
            <StatCard
              label="Player Level"
              value={profile.level.toString()}
              icon={<Medal />}
            />
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4">Settings</h2>
          
          <div className="space-y-2 rounded-lg border overflow-hidden">
            <SettingItem
              label="Notification Settings"
              icon={<Bell />}
            />
            <SettingItem
              label="Location Services"
              icon={<MapPin />}
            />
            <SettingItem
              label="Privacy Settings"
              icon={<Lock />}
            />
            <SettingItem
              label="App Preferences"
              icon={<Settings />}
            />
          </div>
        </section>
        
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

const LoadingView = () => (
  <div className="min-h-screen bg-background px-6 py-8 max-w-lg mx-auto">
    <header className="mb-8">
      <Skeleton className="h-8 w-40 mb-2" />
      <Skeleton className="h-4 w-60" />
    </header>
    
    <div className="mb-8 flex items-center">
      <Skeleton className="w-20 h-20 rounded-full" />
      <div className="ml-4 space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    
    <section className="mb-8">
      <Skeleton className="h-6 w-24 mb-4" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
      </div>
    </section>
    
    <section className="mb-8">
      <Skeleton className="h-6 w-24 mb-4" />
      <Skeleton className="h-14 rounded-lg mb-2" />
      <Skeleton className="h-14 rounded-lg mb-2" />
      <Skeleton className="h-14 rounded-lg mb-2" />
      <Skeleton className="h-14 rounded-lg" />
    </section>
    
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

const Trophy = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-yellow-500">
    <path
      fill="currentColor"
      d="M5 3h14c.6 0 1 .4 1 1v3c0 3.3-2.7 6-6 6h-4c-3.3 0-6-2.7-6-6V4c0-.6.4-1 1-1zm11.5 10.5c2-1.2 3.5-3.2 3.5-5.5V5H4v3c0 2.3 1.5 4.3 3.5 5.5C8.5 14.3 10.1 15 12 15s3.5-.7 4.5-1.5zM8 15v1c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-1h-8z"
    />
    <path
      fill="currentColor"
      d="M10 20h4v3h-4z"
    />
  </svg>
);

const Bell = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-500">
    <path
      fill="currentColor"
      d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.6-4.5-6.3V4c0-.8-.7-1.5-1.5-1.5S10.5 3.2 10.5 4v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z"
    />
  </svg>
);

const MapPin = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-500">
    <path
      fill="currentColor"
      d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z"
    />
  </svg>
);

const Lock = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-500">
    <path
      fill="currentColor"
      d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.7 1.3-3 3-3s3 1.3 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
    />
  </svg>
);

const Reward = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-500">
    <path
      fill="currentColor"
      d="M19.8 5H18V3c0-.6-.4-1-1-1H7c-.6 0-1 .4-1 1v2H4.2c-1.2 0-2.2 1-2.2 2.2v1.6c0 1.1.9 2.2 2 2.2h.5L6 20.8c.1.6.6 1.2 1.3 1.2h9.5c.7 0 1.2-.6 1.3-1.2l1.5-9.8h.5c1.1 0 2-.9 2-2.2V7.2C22 6 21 5 19.8 5zM8 4h8v1H8V4zm9.4 16H6.6l-1.4-9h13.6l-1.4 9zM20 8.8h-1-16V7.2c0-.1.1-.2.2-.2h16.6c.1 0 .2.1.2.2v1.6z"
    />
  </svg>
);

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => {
  return (
    <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        {icon}
      </div>
      <span className="text-xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

interface SettingItemProps {
  label: string;
  icon: React.ReactNode;
}

const SettingItem = ({ label, icon }: SettingItemProps) => {
  return (
    <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors border-b last:border-b-0">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          {icon}
        </div>
        <span>{label}</span>
      </div>
      <ChevronRight size={18} className="text-muted-foreground" />
    </button>
  );
};

export default Profile;
