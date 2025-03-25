
import { useState, useEffect } from "react";
import { ArrowUp, Compass, List, Filter, RefreshCw, MapPin, X, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import BossCard from "@/components/BossCard";
import { useNavigate } from "react-router-dom";
import MapboxMap from "@/components/MapboxMap";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

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
  const [mapboxToken, setMapboxToken] = useState<string | undefined>(() => {
    // Try to get token from localStorage
    return localStorage.getItem('mapbox_token') || undefined;
  });
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [tokenInputValue, setTokenInputValue] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate loading the map
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Initialize token input value
    if (mapboxToken) {
      setTokenInputValue(mapboxToken);
    }
    
    return () => clearTimeout(timer);
  }, [mapboxToken]);
  
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

  const saveMapboxToken = () => {
    if (tokenInputValue.trim()) {
      localStorage.setItem('mapbox_token', tokenInputValue);
      setMapboxToken(tokenInputValue);
      setIsTokenDialogOpen(false);
      setMapKey(prev => prev + 1); // Force map reload with new token
      toast({
        title: "Token Saved",
        description: "Your Mapbox token has been saved and will be used for map views.",
      });
    } else {
      toast({
        title: "Token Required",
        description: "Please enter a valid Mapbox token.",
        variant: "destructive"
      });
    }
  };

  const openTokenDialog = () => {
    setTokenInputValue(mapboxToken || '');
    setIsTokenDialogOpen(true);
  };
  
  const clearMapboxToken = () => {
    localStorage.removeItem('mapbox_token');
    setMapboxToken(undefined);
    setTokenInputValue('');
    setMapKey(prev => prev + 1); // Force map reload with default token
    toast({
      title: "Token Removed",
      description: "Using default Mapbox token now.",
    });
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
                customMapboxToken={mapboxToken}
              />
              
              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
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
                
                {/* Location button */}
                <Button
                  variant="default"
                  size="icon"
                  className="bg-primary rounded-full shadow-md h-12 w-12 ring-2 ring-white"
                  onClick={() => {
                    const el = document.querySelector('.mapboxgl-ctrl-geolocate') as HTMLElement;
                    if (el) el.click();
                  }}
                  title="Center on My Location"
                >
                  <Navigation className="h-5 w-5 text-primary-foreground" />
                </Button>
                
                {/* Make this button more prominent */}
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white rounded-full shadow-md h-12 w-12"
                  onClick={openTokenDialog}
                  title="Set Mapbox Token"
                >
                  <MapPin className="h-5 w-5 text-primary" />
                </Button>
                
                {mapboxToken && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white rounded-full shadow-md h-12 w-12"
                    onClick={clearMapboxToken}
                    title="Clear Custom Token"
                  >
                    <X className="h-5 w-5 text-destructive" />
                  </Button>
                )}
              </div>
              
              {/* Token notice */}
              {!mapboxToken && (
                <div className="absolute bottom-4 left-4 right-4 mx-auto max-w-md bg-background/90 p-4 rounded-lg shadow-lg border border-border z-30">
                  <p className="text-sm font-medium mb-2">Map not loading correctly?</p>
                  <p className="text-xs text-muted-foreground mb-3">You might need to provide your own Mapbox token.</p>
                  <Button 
                    size="sm" 
                    onClick={openTokenDialog}
                    className="w-full"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Set Mapbox Token
                  </Button>
                </div>
              )}
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
                   flex items-center justify-center shadow-lg z-30"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Mapbox Token Dialog - Make it more user-friendly */}
      <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Mapbox Token</DialogTitle>
            <DialogDescription>
              To use Mapbox features, you need to provide your own access token.
              You can get one by signing up at <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mapbox-token">Public Access Token</Label>
              <Input 
                id="mapbox-token" 
                placeholder="pk.eyJ1..." 
                value={tokenInputValue}
                onChange={(e) => setTokenInputValue(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use your public token (starts with 'pk.'). Never share your secret token.
              </p>
            </div>
            
            {/* Add steps to get token */}
            <div className="space-y-2 border-t pt-4">
              <p className="text-sm font-medium">How to get a Mapbox token:</p>
              <ol className="text-xs text-muted-foreground space-y-1 pl-4 list-decimal">
                <li>Create an account at <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a></li>
                <li>Go to your account dashboard</li>
                <li>Navigate to "Access tokens"</li>
                <li>Copy your default public token or create a new one</li>
                <li>Paste it above</li>
              </ol>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsTokenDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={saveMapboxToken}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Map;
