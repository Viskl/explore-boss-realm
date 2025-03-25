
import { useState } from "react";
import { MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface LocationPermissionPromptProps {
  onAllow: () => void;
  onDeny: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LocationPermissionPrompt = ({
  onAllow,
  onDeny,
  open,
  onOpenChange,
}: LocationPermissionPromptProps) => {
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestLocation = async () => {
    try {
      setIsRequesting(true);
      
      if (!navigator.geolocation) {
        toast({
          title: "Geolocation Not Supported",
          description: "Your browser doesn't support geolocation.",
          variant: "destructive",
        });
        onDeny();
        return;
      }
      
      // Request permission
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Permission granted
          toast({
            title: "Location Access Granted",
            description: "You can now see nearby bosses on the map."
          });
          onAllow();
        },
        (error) => {
          // Permission denied or error
          const errorMessages = {
            1: "You denied location access. Some features may not work correctly.",
            2: "Location information is unavailable.",
            3: "The request to get your location timed out."
          };
          
          toast({
            title: "Location Access Error",
            description: errorMessages[error.code as 1|2|3] || "An unknown error occurred.",
            variant: "destructive",
          });
          onDeny();
        },
        { enableHighAccuracy: true }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request location permission.",
        variant: "destructive",
      });
      onDeny();
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Enable Location Access
          </AlertDialogTitle>
          <AlertDialogDescription>
            To see nearby bosses and your current position on the map, we need permission 
            to access your location. This data is only used to show your position on the map.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex flex-col gap-4 py-3">
          <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-md text-sm">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Privacy Note</p>
              <p className="text-muted-foreground">
                Your location data is processed locally and is not stored or shared with any third parties.
              </p>
            </div>
          </div>
        </div>
        
        <AlertDialogFooter className="sm:justify-between gap-2">
          <AlertDialogCancel onClick={onDeny}>
            Not Now
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-primary"
            onClick={handleRequestLocation}
            disabled={isRequesting}
          >
            {isRequesting ? "Requesting..." : "Allow Location Access"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LocationPermissionPrompt;
