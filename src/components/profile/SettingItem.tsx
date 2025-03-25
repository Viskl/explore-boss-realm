
import React from "react";
import { ChevronRight } from "lucide-react";

interface SettingItemProps {
  label: string;
  icon: React.ReactNode;
}

const SettingItem = ({ label, icon }: SettingItemProps) => {
  return (
    <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors border-b last:border-b-0">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          {icon}
        </div>
        <span>{label}</span>
      </div>
      <ChevronRight size={18} className="text-muted-foreground" />
    </button>
  );
};

export default SettingItem;
