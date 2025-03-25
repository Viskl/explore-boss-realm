
import React from "react";
import { User, Edit, Camera } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface ProfileCardProps {
  profile: UserProfile;
  userEmail: string | undefined;
}

const ProfileCard = ({ profile, userEmail }: ProfileCardProps) => {
  return (
    <div className="mb-8 flex items-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden border">
          {profile.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile.username} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={40} className="text-muted-foreground" />
          )}
        </div>
        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
          <Camera size={16} />
        </button>
      </div>
      
      <div className="ml-4">
        <h2 className="text-xl font-bold">{profile.username}</h2>
        <p className="text-sm text-muted-foreground">{userEmail}</p>
        <button className="mt-1 text-xs text-primary flex items-center">
          <Edit size={12} className="mr-1" />
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
