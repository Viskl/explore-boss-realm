
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";
import BossCard from "./BossCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, MapPin } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LocationPermissionPrompt from "./LocationPermissionPrompt";

interface MapboxMapProps {
  bosses: any[];
  onSlideChange: (index: number) => void;
  activeSlideIndex: number;
  customMapboxToken?: string;
}

// Rzeszow, Poland coordinates
const RZESZOW_LNG = 22.0047;
const RZESZOW_LAT = 50.0412;

// Default Mapbox token
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoiYWxleC1sb3ZhYmxlIiwiYSI6ImNsb2c2MmdpajBnOXUya3BiYmQ5OXpobDIifQ.Nmh-GJyh1C6KDjDoMHi4Yw';

const MapboxMap = ({ bosses, onSlideChange, activeSlideIndex, customMapboxToken }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const geolocateControl = useRef<mapboxgl.GeolocateControl | null>(null);
  const navigate = useNavigate();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isPermissionPromptOpen, setIsPermissionPromptOpen] = useState(false);
  const [locationPermissionState, setLocationPermissionState] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const { toast } = useToast();

  // Clean up function to remove map instance
  const cleanUpMap = () => {
    if (map.current) {
      console.log("Cleaning up map instance");
      map.current.remove();
      map.current = null;
    }
  };

  // Show permission prompt after a short delay
  useEffect(() => {
    if (mapLoaded && locationPermissionState === 'unknown') {
      const timer = setTimeout(() => {
        setIsPermissionPromptOpen(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [mapLoaded, locationPermissionState]);

  useEffect(() => {
    // Don't initialize if already initialized or container not available
    if (!mapContainer.current || map.current) return;
    
    try {
      console.log("Initializing map with token:", customMapboxToken ? "Custom token" : "Default token");
      
      // Use custom token if provided, otherwise use default
      const token = customMapboxToken || DEFAULT_MAPBOX_TOKEN;
      mapboxgl.accessToken = token;
      
      // Create the map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [RZESZOW_LNG, RZESZOW_LAT], // Rzeszow, Poland
        zoom: 13
      });
      
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add geolocate control
      geolocateControl.current = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });
      
      map.current.addControl(geolocateControl.current);
      
      // When map is loaded
      map.current.on('load', () => {
        console.log('Map loaded successfully!');
        setMapLoaded(true);
        setMapError(null);
        
        // Add markers for bosses around Rzeszow
        bosses.forEach((boss) => {
          // Create random position near Rzeszow
          const offsetLng = (boss.position.x / 1000);
          const offsetLat = (boss.position.y / 1000);
          const longitude = RZESZOW_LNG + offsetLng;
          const latitude = RZESZOW_LAT + offsetLat;
          
          // Create marker element
          const el = document.createElement('div');
          el.className = `boss-marker ${boss.difficulty}`;
          
          // Set marker style
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.border = '2px solid white';
          
          // Set color based on difficulty
          if (boss.difficulty === "rare") {
            el.style.backgroundColor = '#3b82f6'; // blue-500
          } else if (boss.difficulty === "epic") {
            el.style.backgroundColor = '#8b5cf6'; // purple-500
          } else {
            el.style.backgroundColor = '#f59e0b'; // amber-500
          }
          
          // Add click event
          el.addEventListener('click', () => {
            navigate(`/boss/${boss.id}`);
          });
          
          // Add marker to map
          if (map.current) {
            new mapboxgl.Marker(el)
              .setLngLat([longitude, latitude])
              .addTo(map.current);
          }
        });
      });
      
      // Listen for geolocate events to update permission state
      if (geolocateControl.current) {
        geolocateControl.current.on('geolocate', () => {
          console.log('Location found and tracking');
          setLocationPermissionState('granted');
        });
        
        geolocateControl.current.on('error', (e) => {
          console.error('Geolocate error:', e);
          if (e.error?.code === 1) { // Permission denied
            setLocationPermissionState('denied');
          }
        });
      }
      
      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        const errorMessage = e.error?.message || 'There was an error loading the map. Please refresh the page.';
        setMapError(errorMessage);
        toast({
          title: 'Map Error',
          description: errorMessage,
          variant: 'destructive'
        });
      });
      
    } catch (error: any) {
      console.error('Error initializing map:', error);
      const errorMsg = error?.message || 'Failed to initialize the map. Please check your connection.';
      setMapError(errorMsg);
      toast({
        title: 'Map Error',
        description: errorMsg,
        variant: 'destructive'
      });
    }
    
    // Cleanup
    return cleanUpMap;
  }, [bosses, navigate, toast, customMapboxToken]);

  const handleLocationAllow = () => {
    console.log("Location permission allowed by user");
    setLocationPermissionState('granted');
    setIsPermissionPromptOpen(false);
    
    // Trigger the geolocate control
    if (geolocateControl.current && map.current) {
      geolocateControl.current.trigger();
    }
  };

  const handleLocationDeny = () => {
    console.log("Location permission denied by user");
    setLocationPermissionState('denied');
    setIsPermissionPromptOpen(false);
    
    toast({
      title: 'Location Access Denied',
      description: 'You can still explore the map, but your current location won\'t be shown.',
      variant: 'default'
    });
  };

  if (mapError) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="mb-4 max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Map Error</AlertTitle>
          <AlertDescription>
            {mapError}
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground mb-2">
          The map couldn't load due to an API token issue. You might need to use your own Mapbox token.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Map container */}
      <div ref={mapContainer} className="h-full w-full" />
      
      {/* Location permission dialog */}
      <LocationPermissionPrompt
        open={isPermissionPromptOpen}
        onOpenChange={setIsPermissionPromptOpen}
        onAllow={handleLocationAllow}
        onDeny={handleLocationDeny}
      />
      
      {/* Location info banner when denied */}
      {locationPermissionState === 'denied' && mapLoaded && (
        <div className="absolute top-4 left-4 right-4 mx-auto max-w-sm bg-background/95 border border-border rounded-lg shadow-lg p-3 z-20">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Location access is disabled</p>
              <p className="text-xs text-muted-foreground">Enable location services to see your position on the map</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
                onClick={() => setIsPermissionPromptOpen(true)}
              >
                Enable Location
              </Button>
            </div>
          </div>
        </div>
      )}
      
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
