
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";
import BossCard from "./BossCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface MapboxMapProps {
  bosses: any[];
  onSlideChange: (index: number) => void;
  activeSlideIndex: number;
}

// Fixed token that works for demo purposes
const MAPBOX_TOKEN_KEY = 'mapbox_token';
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoiYWxleC1sb3ZhYmxlIiwiYSI6ImNsb2c2MmdpajBnOXUya3BiYmQ5OXpobDIifQ.Nmh-GJyh1C6KDjDoMHi4Yw';

// Default coordinates for Rzeszow, Poland
const DEFAULT_LONGITUDE = 22.0047;
const DEFAULT_LATITUDE = 50.0412;

const MapboxMap = ({ bosses, onSlideChange, activeSlideIndex }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem(MAPBOX_TOKEN_KEY) || DEFAULT_MAPBOX_TOKEN;
  });
  const [userLocation, setUserLocation] = useState<[number, number]>([DEFAULT_LONGITUDE, DEFAULT_LATITUDE]);
  const navigate = useNavigate();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tokenInputValue, setTokenInputValue] = useState(DEFAULT_MAPBOX_TOKEN);
  const [mapError, setMapError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to load the map
  const initializeMap = (token: string) => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = token;
      
      console.log("Initializing map with center:", userLocation);
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: userLocation,
        zoom: 13
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }));

      map.current.on("load", () => {
        setMapLoaded(true);
        setMapError(null);
        console.log("Map loaded successfully");
        
        // Add markers for bosses
        bosses.forEach((boss, index) => {
          // Convert percentage positions to longitude/latitude - adding to the user location
          // This is a simplification - in a real app, you'd have actual geo coordinates
          const longitude = userLocation[0] + (boss.position.x / 1000);
          const latitude = userLocation[1] + (boss.position.y / 1000);
          
          console.log(`Adding boss marker ${boss.name} at: [${longitude}, ${latitude}]`);
          
          // Create a marker element
          const el = document.createElement("div");
          el.className = `boss-marker-element ${boss.difficulty}`;
          el.innerHTML = `<div class="w-5 h-5 rounded-full bg-${
            boss.difficulty === "rare" ? "blue" : 
            boss.difficulty === "epic" ? "purple" : "amber"
          }-500 z-10 border-2 border-white"></div>`;
          
          el.addEventListener("click", () => {
            navigate(`/boss/${boss.id}`);
          });
          
          // Add marker to map
          new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .addTo(map.current!);
        });
      });

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e);
        setMapError("There was an error loading the map. Please check your token.");
        toast({
          title: "Map Error",
          description: "There was an error loading the map. Please try refreshing the page.",
          variant: "destructive"
        });
      });

    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map");
      toast({
        title: "Map Error",
        description: "Failed to initialize the map. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  };

  const saveAndInitializeMap = () => {
    if (tokenInputValue) {
      localStorage.setItem(MAPBOX_TOKEN_KEY, tokenInputValue);
      setMapboxToken(tokenInputValue);
      
      // Clear existing map if any
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        initializeMap(tokenInputValue);
      }, 100);
    }
  };

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          console.log("User location found:", [longitude, latitude]);
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Continue with default location if user location fails
          toast({
            title: "Location Not Found",
            description: "Using default location in Rzeszow, Poland. You can play around this area.",
          });
        }
      );
    } else {
      console.log("Geolocation not supported, using default coordinates");
    }
  }, []);

  useEffect(() => {
    if (mapboxToken) {
      // Small delay to ensure the container is ready
      const timer = setTimeout(() => {
        initializeMap(mapboxToken);
      }, 100);
      
      return () => {
        clearTimeout(timer);
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    }
  }, [mapboxToken, userLocation]);

  // Store the default token in localStorage when component mounts
  useEffect(() => {
    if (!localStorage.getItem(MAPBOX_TOKEN_KEY) && DEFAULT_MAPBOX_TOKEN) {
      localStorage.setItem(MAPBOX_TOKEN_KEY, DEFAULT_MAPBOX_TOKEN);
    }
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Mapbox token input if not set or if there was an error */}
      {(!mapboxToken || mapError) && (
        <div className="absolute inset-0 bg-background/95 z-50 flex flex-col items-center justify-center p-6">
          <div className="bg-card w-full max-w-md p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-xl font-bold mb-4">Enter Mapbox API Token</h2>
            {mapError && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
                <p className="text-sm font-medium">{mapError}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-4">
              Using default location: Rzeszow, Poland. Bosses will appear nearby.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mapbox-token">Mapbox Token</Label>
                <Input
                  id="mapbox-token"
                  type="text"
                  className="w-full"
                  placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6..."
                  value={tokenInputValue}
                  onChange={(e) => setTokenInputValue(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={saveAndInitializeMap}
                disabled={!tokenInputValue}
              >
                Load Map
              </Button>
              {mapError && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setMapError(null)}
                >
                  Close and Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="h-full w-full" />

      {/* Bottom info panel with carousel */}
      {mapLoaded && (
        <div className="absolute bottom-20 left-0 right-0 px-4">
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="font-bold text-lg text-white drop-shadow-md">Nearby Bosses</h2>
            <span className="text-sm text-white/90 drop-shadow-md">{bosses.length} found</span>
          </div>
          
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
              {bosses.map((boss, index) => (
                <div 
                  key={boss.id} 
                  className="min-w-[300px] snap-center first:ml-2 last:mr-2"
                  onClick={() => onSlideChange(index)}
                >
                  <div className={`transition-all duration-200 ${activeSlideIndex === index ? 'scale-100' : 'scale-95 opacity-80'}`}>
                    <BossCard {...boss} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination indicators */}
            <div className="flex justify-center gap-1.5 mt-2">
              {bosses.map((_, index) => (
                <button
                  key={index}
                  className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
                    activeSlideIndex === index ? 'bg-white' : 'bg-white/40'
                  }`}
                  onClick={() => onSlideChange(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CSS for hiding scrollbar */}
      <style>
        {`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        `}
      </style>
    </div>
  );
};

export default MapboxMap;
