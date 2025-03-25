
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";
import BossCard from "./BossCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MapboxMapProps {
  bosses: any[];
  onSlideChange: (index: number) => void;
  activeSlideIndex: number;
}

const MAPBOX_TOKEN_KEY = 'mapbox_token';

const MapboxMap = ({ bosses, onSlideChange, activeSlideIndex }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem(MAPBOX_TOKEN_KEY) || "";
  });
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const navigate = useNavigate();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tokenInputValue, setTokenInputValue] = useState("");

  // Function to load the map
  const initializeMap = (token: string) => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: userLocation || [-74.5, 40], // Default center
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
      
      // Add markers for bosses
      bosses.forEach((boss) => {
        // Convert percentage positions to longitude/latitude
        // This is a simplification - in a real app, you'd have actual geo coordinates
        const longitude = -74.5 + (boss.position.x / 100) * 0.1;
        const latitude = 40 + (boss.position.y / 100) * 0.1;
        
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

      // If we have user location, center map on it
      if (userLocation) {
        map.current!.flyTo({
          center: userLocation,
          zoom: 15
        });
      }
    });
  };

  const saveAndInitializeMap = () => {
    if (tokenInputValue) {
      localStorage.setItem(MAPBOX_TOKEN_KEY, tokenInputValue);
      setMapboxToken(tokenInputValue);
      
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
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && mapboxToken) {
      initializeMap(mapboxToken);
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation, mapboxToken]);

  return (
    <div className="relative h-full w-full">
      {/* Mapbox token input if not set */}
      {!mapboxToken && (
        <div className="absolute inset-0 bg-background/95 z-50 flex flex-col items-center justify-center p-6">
          <div className="bg-card w-full max-w-md p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-xl font-bold mb-4">Enter Mapbox API Token</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Please enter your Mapbox public token to load the map.
              You can get one for free at <a href="https://mapbox.com/" target="_blank" rel="noreferrer" className="text-primary underline">mapbox.com</a>
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
    </div>
  );
};

export default MapboxMap;
