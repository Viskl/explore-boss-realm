
import React from "react";
import StatCard from "./StatCard";
import { UserProfile } from "@/types/profile";
import { Trophy, Medal, Reward, Sword } from "@/components/profile/ProfileIcons";

interface StatsSectionProps {
  profile: UserProfile;
}

const StatsSection = ({ profile }: StatsSectionProps) => {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-4">Stats</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
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
      </div>
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Player Level"
          value={profile.level.toString()}
          icon={<Medal />}
        />
        <StatCard
          label="Swipes Performed"
          value={profile.swipes_performed.toString()}
          icon={<Sword />}
        />
      </div>
    </section>
  );
};

export default StatsSection;
