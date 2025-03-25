
import { useNavigate } from "react-router-dom";
import { MapPin, Trophy, Users, Clock, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface BossCardProps {
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
    rare: "bg-blue-500 text-white",
    epic: "bg-purple-500 text-white",
    legendary: "bg-amber-500 text-white",
  };
  
  const difficultyLabels = {
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
  };
  
  return (
    <div className="overflow-hidden rounded-xl bg-white border shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Difficulty badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`px-3 py-1 font-medium ${difficultyColors[difficulty]}`}>
            {difficultyLabels[difficulty]}
          </Badge>
        </div>
        
        {/* Distance badge if available */}
        {distance && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-black/50 text-white backdrop-blur-sm border-none">
              {distance}
            </Badge>
          </div>
        )}
        
        {/* Name and location overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <div className="flex items-center text-white/90 text-sm mt-1">
            <MapPin size={14} className="mr-1" />
            <span>{location}</span>
          </div>
        </div>
      </div>
      
      {/* Details section */}
      <div className="p-3">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex flex-col items-center justify-center py-2 rounded-lg bg-gray-100">
            <Trophy size={18} className="text-blue-500 mb-1" />
            <span className="text-xs font-medium">{reward}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center py-2 rounded-lg bg-gray-100">
            <Users size={18} className="text-blue-500 mb-1" />
            <span className="text-xs font-medium">{teamSize} {teamSize === 1 ? 'player' : 'players'}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center py-2 rounded-lg bg-gray-100">
            <Clock size={18} className="text-blue-500 mb-1" />
            <span className="text-xs font-medium">{timeLimit}</span>
          </div>
        </div>
        
        <Button
          className="w-full"
          onClick={() => navigate(`/boss/${id}`)}
        >
          View Challenge
        </Button>
      </div>
    </div>
  );
};

export default BossCard;
