
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
  
  // Colors for different boss difficulty levels
  const difficultyColors = {
    rare: "bg-blue-500",
    epic: "bg-purple-500",
    legendary: "bg-amber-500",
  };
  
  return (
    <div 
      className="boss-marker group cursor-pointer"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onClick={() => navigate(`/boss/${id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Marker point */}
      <div className={`w-5 h-5 rounded-full ${difficultyColors[difficulty]} z-10 border-2 border-white`}>
        <span className="sr-only">{name}</span>
      </div>
      
      {/* Tooltip label */}
      {(isHovered || true) && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 
                      bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm
                      whitespace-nowrap z-20 shadow-md min-w-[120px] text-center">
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
