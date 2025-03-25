
import React from "react";
import StatCard from "./StatCard";
import { UserProfile } from "@/types/profile";
import { Trophy, Medal, Reward } from "@/components/profile/ProfileIcons";

interface StatsSectionProps {
  profile: UserProfile;
}

const StatsSection = ({ profile }: StatsSectionProps) => {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-4">Stats</h2>
      
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Bosses Defeated"
          value={profile.bosses_defeated.toString()}
          icon={<Trophy />}
        />
        <StatCard
          label="Rewards Earned"
          value={profile.rewards_earned.toString()}
          icon={<Reward />}
        />
        <StatCard
          label="Player Level"
          value={profile.level.toString()}
          icon={<Medal />}
        />
      </div>
    </section>
  );
};

export default StatsSection;
