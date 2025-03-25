
import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => {
  return (
    <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        {icon}
      </div>
      <span className="text-xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

export default StatCard;
