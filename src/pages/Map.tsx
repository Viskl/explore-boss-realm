
import { useState, useEffect } from "react";
import { ArrowUp, Compass, List, Target, Filter } from "lucide-react";
import Button from "@/components/Button";
import HotspotMarker from "@/components/HotspotMarker";
import BossCard from "@/components/BossCard";

// Mock data for bosses
const BOSSES = [
  {
    id: "b1",
    name: "Crystal Golem",
    image: "https://images.unsplash.com/photo-1551396089-31f85ca7d9dd?q=80&w=2574&auto=format&fit=crop",
    location: "Central Park",
    difficulty: "rare",
    position: { x: 35, y: 40 },
    reward: "15% Off",
    teamSize: 1,
    timeLimit: "10 min",
    distance: "0.3 mi",
  },
  {
    id: "b2",
    name: "Shadow Drake",
    image: "https://images.unsplash.com/photo-1560089168-4b1539c9b56e?q=80&w=2564&auto=format&fit=crop",
    location: "Downtown Plaza",
    difficulty: "epic",
    position: { x: 65, y: 30 },
    reward: "Free Item",
    teamSize: 2,
    timeLimit: "15 min",
    distance: "0.8 mi",
  },
  {
    id: "b3",
    name: "Celestial Guardian",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2274&auto=format&fit=crop",
    location: "Harbor View",
    difficulty: "legendary",
    position: { x: 75, y: 70 },
    reward: "50% Off",
    teamSize: 3,
    timeLimit: "20 min",
    distance: "1.2 mi",
  },
];

const Map = () => {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  
  useEffect(() => {
    // Simulate loading the map
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLocateMe = () => {
    setIsLocating(true);
    // Simulate getting user location
    setTimeout(() => {
      setIsLocating(false);
    }, 1500);
  };
  
  return (
    <div className="relative h-full w-full">
      {/* Map View */}
      {viewMode === "map" && (
        <div className="relative h-full w-full bg-muted/30 overflow-hidden">
          {isLoading ? (
            <div className="h-full w-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-muted-foreground/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          ) : (
            <>
              {/* Placeholder for the map - in a real app this would be Google Maps or similar */}
              <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1599930113854-d6d7fd522507?q=80&w=2274&auto=format&fit=crop')] bg-cover bg-center">
                {/* Boss markers */}
                {BOSSES.map((boss) => (
                  <HotspotMarker
                    key={boss.id}
                    id={boss.id}
                    position={boss.position}
                    difficulty={boss.difficulty as "rare" | "epic" | "legendary"}
                    name={boss.name}
                    distance={boss.distance}
                  />
                ))}
                
                {/* Current location marker */}
                <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full bg-blue-500/20 animate-ping" />
                  </div>
                </div>
              </div>
              
              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background shadow-md"
                  onClick={handleLocateMe}
                  isLoading={isLocating}
                >
                  <Target size={20} />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background shadow-md"
                  onClick={() => setViewMode("list")}
                >
                  <List size={20} />
                </Button>
              </div>
              
              {/* Bottom info panel */}
              <div className="absolute bottom-[72px] left-0 right-0 p-4">
                <div className="bg-background/90 backdrop-blur-md rounded-xl p-4 shadow-lg animate-in">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-lg">Nearby Bosses</h2>
                    <span className="text-sm text-muted-foreground">{BOSSES.length} found</span>
                  </div>
                  
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                    {BOSSES.map((boss) => (
                      <div key={boss.id} className="min-w-[250px] snap-start">
                        <BossCard {...boss} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      
      {/* List View */}
      {viewMode === "list" && (
        <div className="h-full w-full bg-background px-4 py-6 overflow-auto">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Nearby Bosses</h1>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("map")}
              >
                <Compass size={20} />
              </Button>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">{BOSSES.length} bosses found</p>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Filter size={16} />}
              >
                Filter
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 pb-20">
              {BOSSES.map((boss) => (
                <BossCard key={boss.id} {...boss} />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {viewMode === "map" && (
        <button
          className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-primary text-primary-foreground
                    flex items-center justify-center shadow-lg z-10 animate-bounce"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Map;
