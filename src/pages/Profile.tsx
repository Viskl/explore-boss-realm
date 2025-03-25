
import { useState } from "react";
import { User, Medal, Settings, LogOut, ChevronRight, Edit, Camera } from "lucide-react";
import Button from "@/components/Button";

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  if (!isLoggedIn) {
    return <LoginView onLogin={() => setIsLoggedIn(true)} />;
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
              <User size={40} className="text-muted-foreground" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="ml-4">
            <h2 className="text-xl font-bold">Hunter123</h2>
            <p className="text-sm text-muted-foreground">hunter@example.com</p>
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
              value="12"
              icon={<Trophy />}
            />
            <StatCard
              label="Rewards Earned"
              value="10"
              icon={<Reward />}
            />
            <StatCard
              label="Player Level"
              value="6"
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
          onClick={() => setIsLoggedIn(false)}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView = ({ onLogin }: LoginViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Sign In</h1>
          <p className="text-muted-foreground">
            Continue your boss hunting journey
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <a href="#" className="text-sm text-primary">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <Button
            fullWidth
            size="lg"
            isLoading={isLoading}
            onClick={handleLogin}
          >
            Sign In
          </Button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Button
              fullWidth
              variant="outline"
              leftIcon={<Google />}
            >
              Google
            </Button>
          </div>
          
          <p className="text-center text-sm mt-6">
            Don't have an account?{" "}
            <a href="#" className="text-primary font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Icon components
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

const Google = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="#EA4335"
      d="M5.3 11.7c0-.7.1-1.3.3-1.9l-3-2.3C1.9 8.9 1.5 10.4 1.5 12s.4 3.1 1.1 4.5l3-2.3c-.2-.6-.3-1.3-.3-2"
    />
    <path
      fill="#FBBC05"
      d="M12 5.5c1.5 0 2.8.5 3.8 1.5l2.5-2.5C16.5 2.7 14.4 1.5 12 1.5c-3.6 0-6.7 2-8.2 5l3 2.3c.7-2.1 2.7-3.8 5.2-3.8"
    />
    <path
      fill="#4285F4"
      d="M12 18.5c-2.5 0-4.5-1.6-5.2-3.8l-3 2.3c1.6 3 4.6 5 8.2 5 2.2 0 4.3-1 5.8-2.7L15 16.4c-1 .7-2.1 1.1-3 1.1"
    />
    <path
      fill="#34A853"
      d="M18.5 12c0-.6-.1-1.2-.2-1.8h-6.3v3.8h3.6c-.3 1.3-1.1 2.4-2.1 3.1l2.8 2.2c1.7-1.6 2.7-4 2.7-6.8"
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
