import { useState, useEffect } from "react";
import { ArrowUp, Compass, List, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import BossCard from "@/components/BossCard";
import { useNavigate } from "react-router-dom";
import MapboxMap from "@/components/MapboxMap";
import { useToast } from "@/components/ui/use-toast";

// Mock data for bosses with proper typing
const BOSSES = [
  {
    id: "b1",
    name: "Crystal Golem",
    image: "https://images.unsplash.com/photo-1551396089-31f85ca7d9dd?q=80&w=2574&auto=format&fit=crop",
    location: "Central Park",
    difficulty: "rare" as const,
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
    difficulty: "epic" as const,
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
    difficulty: "legendary" as const,
    position: { x: 75, y: 70 },
    reward: "50% Off",
    teamSize: 3,
    timeLimit: "20 min",
    distance: "1.2 mi",
  },
];

const Map = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [mapKey, setMapKey] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate loading the map
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSlideChange = (index: number) => {
    setActiveSlideIndex(index);
  };

  const resetMap = () => {
    toast({
      title: "Map Reset",
      description: "Reloading map...",
    });
    setMapKey(prev => prev + 1); // Force component remount
  };
  
  return (
    <div className="relative h-full w-full">
      {/* Map View */}
      {viewMode === "map" && (
        <div className="relative h-full w-full overflow-hidden">
          {isLoading ? (
            <div className="h-full w-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-muted-foreground/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          ) : (
            <>
              {/* Mapbox Map Component */}
              <MapboxMap 
                key={`map-${mapKey}`} // Force remount when key changes
                bosses={BOSSES} 
                onSlideChange={handleSlideChange}
                activeSlideIndex={activeSlideIndex}
              />
              
              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white rounded-full shadow-md h-12 w-12"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-5 w-5 text-primary" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white rounded-full shadow-md h-12 w-12"
                  onClick={resetMap}
                  title="Reset Map"
                >
                  <RefreshCw className="h-5 w-5 text-primary" />
                </Button>
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
                className="gap-2"
              >
                <Filter size={16} />
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
      
      {/* Back to top button */}
      {viewMode === "map" && (
        <button
          className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-primary text-primary-foreground
                   flex items-center justify-center shadow-lg z-10"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Map;
