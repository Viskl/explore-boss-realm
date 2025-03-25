
import React from "react";
import SettingItem from "./SettingItem";
import { Settings } from "lucide-react";
import { Bell, MapPin, Lock } from "@/components/profile/ProfileIcons";

const SettingsSection = () => {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-4">Settings</h2>
      
      <div className="space-y-2 rounded-lg border overflow-hidden">
        <SettingItem
          label="Notification Settings"
          icon={<Bell />}
        />
        <SettingItem
          label="Location Services"
          icon={<MapPin />}
        />
        <SettingItem
          label="Privacy Settings"
          icon={<Lock />}
        />
        <SettingItem
          label="App Preferences"
          icon={<Settings size={16} />}
        />
      </div>
    </section>
  );
};

export default SettingsSection;
