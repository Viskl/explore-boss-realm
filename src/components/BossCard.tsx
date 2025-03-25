
import { useNavigate } from "react-router-dom";
import { MapPin, Trophy, Users, Clock } from "lucide-react";
import Button from "./Button";

interface BossCardProps {
  id: string;
  name: string;
  image: string;
  location: string;
  difficulty: "rare" | "epic" | "legendary";
  reward: string;
  teamSize: number;
  timeLimit: string;
  distance?: string;
}

const BossCard = ({
  id,
  name,
  image,
  location,
  difficulty,
  reward,
  teamSize,
  timeLimit,
  distance,
}: BossCardProps) => {
  const navigate = useNavigate();
  
  const difficultyColors = {
    rare: "bg-boss-rare",
    epic: "bg-boss-epic",
    legendary: "bg-boss-legendary",
  };
  
  const difficultyLabels = {
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
  };
  
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-card border animate-in">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${difficultyColors[difficulty]}`}>
            {difficultyLabels[difficulty]}
          </span>
          
          {distance && (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-black/40 text-white backdrop-blur-sm">
              {distance}
            </span>
          )}
        </div>
        
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white text-shadow">{name}</h3>
          <div className="flex items-center text-white/90 text-sm mt-1">
            <MapPin size={14} className="mr-1" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/50">
            <Trophy size={18} className="text-primary mb-1" />
            <span className="text-xs font-medium">{reward}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/50">
            <Users size={18} className="text-primary mb-1" />
            <span className="text-xs font-medium">{teamSize} players</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/50">
            <Clock size={18} className="text-primary mb-1" />
            <span className="text-xs font-medium">{timeLimit}</span>
          </div>
        </div>
        
        <Button
          fullWidth
          onClick={() => navigate(`/boss/${id}`)}
        >
          View Challenge
        </Button>
      </div>
    </div>
  );
};

export default BossCard;
