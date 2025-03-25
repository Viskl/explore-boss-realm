
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, Circle, X } from "lucide-react";

interface HotspotMarkerProps {
  id: string;
  position: { x: number; y: number };
  difficulty: "rare" | "epic" | "legendary";
  name: string;
  distance?: string;
  challengeType?: "quiz" | "tictactoe";
}

const HotspotMarker = ({ id, position, difficulty, name, distance, challengeType = "quiz" }: HotspotMarkerProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  // Colors for different boss difficulty levels
  const difficultyColors = {
    rare: "bg-blue-500",
    epic: "bg-purple-500",
    legendary: "bg-amber-500",
  };
  
  const getChallengeIcon = () => {
    if (challengeType === "tictactoe") {
      return (
        <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 bg-white rounded-full p-0.5 border border-gray-300 shadow-sm">
          <X size={10} className="text-red-500" />
        </div>
      );
    } else {
      return (
        <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 bg-white rounded-full p-0.5 border border-gray-300 shadow-sm">
          <BrainCircuit size={10} className="text-blue-500" />
        </div>
      );
    }
  };
  
  return (
    <div 
      className="boss-marker group cursor-pointer absolute"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onClick={() => navigate(`/boss/${id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Marker point */}
      <div className={`w-5 h-5 rounded-full ${difficultyColors[difficulty]} z-10 border-2 border-white relative`}>
        <span className="sr-only">{name}</span>
        {getChallengeIcon()}
      </div>
      
      {/* Tooltip label */}
      {isHovered && (
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
