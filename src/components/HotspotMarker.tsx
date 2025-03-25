
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface HotspotMarkerProps {
  id: string;
  position: { x: number; y: number };
  difficulty: "rare" | "epic" | "legendary";
  name: string;
  distance?: string;
}

const HotspotMarker = ({ id, position, difficulty, name, distance }: HotspotMarkerProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const difficultyColors = {
    rare: "bg-boss-rare shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    epic: "bg-boss-epic shadow-[0_0_15px_rgba(139,92,246,0.5)]",
    legendary: "bg-boss-legendary shadow-[0_0_15px_rgba(245,158,11,0.5)]",
  };
  
  return (
    <div 
      className="boss-marker group cursor-pointer"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onClick={() => navigate(`/boss/${id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-5 h-5 rounded-full ${difficultyColors[difficulty]} z-10`}>
        <span className="sr-only">{name}</span>
      </div>
      
      {(isHovered || distance) && (
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 
                     bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm
                     whitespace-nowrap animate-fade-in z-20">
          <span className="font-medium">{name}</span>
          {distance && (
            <span className="ml-1 text-xs text-white/80">({distance})</span>
          )}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2
                        bg-black/80 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default HotspotMarker;
