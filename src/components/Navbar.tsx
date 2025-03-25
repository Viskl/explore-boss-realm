
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Trophy, User, Search } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Check if we're on the onboarding page
  const isOnboarding = location.pathname === "/";
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  if (isOnboarding) return null;
  
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 px-4 
        transition-all duration-300 ease-in-out z-50
        ${isScrolled ? "glassmorphism shadow-lg" : "bg-background/90 backdrop-blur-sm border-t"}`}
    >
      <NavItem 
        icon={<MapPin size={24} />}
        label="Map"
        isActive={location.pathname === "/map"}
        onClick={() => navigate("/map")}
      />
      <NavItem 
        icon={<Search size={24} />}
        label="Discover"
        isActive={location.pathname.startsWith("/boss")}
        onClick={() => navigate("/boss/featured")}
      />
      <NavItem 
        icon={<Trophy size={24} />}
        label="Rewards"
        isActive={location.pathname === "/rewards"}
        onClick={() => navigate("/rewards")}
      />
      <NavItem 
        icon={<User size={24} />}
        label="Profile"
        isActive={location.pathname === "/profile"}
        onClick={() => navigate("/profile")}
      />
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all duration-200
        ${isActive 
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground"}`}
    >
      <div 
        className={`transition-all duration-200 ${isActive ? "scale-110" : ""}`}
      >
        {icon}
      </div>
      <span className="text-xs mt-1 font-medium">{label}</span>
      {isActive && (
        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 animate-pulse-subtle" />
      )}
    </button>
  );
};

export default Navbar;
