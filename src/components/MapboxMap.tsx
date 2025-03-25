
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

// Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWxleC1sb3ZhYmxlIiwiYSI6ImNsb2c2MmdpajBnOXUya3BiYmQ5OXpobDIifQ.Nmh-GJyh1C6KDjDoMHi4Yw';

// Rzeszow, Poland coordinates
const RZESZOW_LNG = 22.0047;
const RZESZOW_LAT = 50.0412;

const MapboxMap = ({ bosses, onSlideChange, activeSlideIndex }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const navigate = useNavigate();
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    try {
      // Set the token
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
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
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }));
      
      // When map is loaded
      map.current.on('load', () => {
        setMapLoaded(true);
        console.log('Map loaded successfully!');
        
        // Add markers for bosses around Rzeszow
        bosses.forEach((boss) => {
          // Create random position near Rzeszow
          const offsetLng = (boss.position.x / 1000);
          const offsetLat = (boss.position.y / 1000);
          const longitude = RZESZOW_LNG + offsetLng;
          const latitude = RZESZOW_LAT + offsetLat;
          
          // Create marker element
          const el = document.createElement('div');
          el.className = `boss-marker-element ${boss.difficulty}`;
          el.innerHTML = `<div class="w-5 h-5 rounded-full bg-${
            boss.difficulty === "rare" ? "blue" : 
            boss.difficulty === "epic" ? "purple" : "amber"
          }-500 z-10 border-2 border-white"></div>`;
          
          // Add click event
          el.addEventListener('click', () => {
            navigate(`/boss/${boss.id}`);
          });
          
          // Add marker to map
          new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .addTo(map.current!);
        });
      });
      
      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        toast({
          title: 'Map Error',
          description: 'There was an error loading the map. Please refresh the page.',
          variant: 'destructive'
        });
      });
      
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: 'Map Error',
        description: 'Failed to initialize the map. Please check your connection.',
        variant: 'destructive'
      });
    }
    
    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [bosses, navigate, toast]);

  return (
    <div className="relative h-full w-full">
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
