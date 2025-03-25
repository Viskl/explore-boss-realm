
import { useState } from "react";
import { Trophy, Calendar, Check, Clock } from "lucide-react";
import QRCode from "@/components/QRCode";

// Mock data for rewards
const REWARDS = [
  {
    id: "r1",
    bossName: "Crystal Golem",
    business: {
      name: "Starbucks",
      offer: "15% Off Any Drink",
      validUntil: "Sep 30, 2023",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png"
    },
    status: "active",
    earnedDate: "Aug 12, 2023"
  },
  {
    id: "r2",
    bossName: "Shadow Drake",
    business: {
      name: "Cheesecake Factory",
      offer: "Free Appetizer with Entrée",
      validUntil: "Oct 15, 2023",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/The_Cheesecake_Factory_Logo_2023.svg/2560px-The_Cheesecake_Factory_Logo_2023.svg.png"
    },
    status: "active",
    earnedDate: "Aug 20, 2023"
  },
  {
    id: "r3",
    bossName: "Meadow Spirit",
    business: {
      name: "Jamba Juice",
      offer: "Buy One Get One Free",
      validUntil: "Aug 5, 2023",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Jamba_2017.svg/2560px-Jamba_2017.svg.png"
    },
    status: "expired",
    earnedDate: "Aug 1, 2023"
  }
];

const Rewards = () => {
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const activeRewards = REWARDS.filter(reward => reward.status === "active");
  const expiredRewards = REWARDS.filter(reward => reward.status === "expired");
  
  const selectedRewardData = REWARDS.find(reward => reward.id === selectedReward);
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {!selectedReward ? (
        <div className="px-6 py-8 max-w-lg mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold">Your Rewards</h1>
            <p className="text-muted-foreground">Redeem special offers from local businesses</p>
          </header>
          
          {activeRewards.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <Trophy size={18} className="mr-2 text-primary" />
                Active Rewards
              </h2>
              
              <div className="space-y-4">
                {activeRewards.map(reward => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    onClick={() => setSelectedReward(reward.id)}
                  />
                ))}
              </div>
            </section>
          )}
          
          {expiredRewards.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <Calendar size={18} className="mr-2 text-muted-foreground" />
                Expired Rewards
              </h2>
              
              <div className="space-y-4 opacity-70">
                {expiredRewards.map(reward => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    onClick={() => {}}
                    expired
                  />
                ))}
              </div>
            </section>
          )}
          
          {REWARDS.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 mx-auto bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                <Trophy size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">No rewards yet</h3>
              <p className="text-muted-foreground mb-4">
                Defeat bosses around town to earn rewards from local businesses.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          <header className="p-4 border-b">
            <button
              className="text-primary font-medium"
              onClick={() => setSelectedReward(null)}
            >
              ← Back to Rewards
            </button>
          </header>
          
          <div className="flex-1 flex items-center justify-center p-6">
            {selectedRewardData && (
              <div className="w-full max-w-md text-center">
                <div className="mb-4">
                  <h2 className="text-xl font-bold">{selectedRewardData.business.offer}</h2>
                  <p className="text-sm text-muted-foreground">
                    Earned from defeating {selectedRewardData.bossName}
                  </p>
                </div>
                
                <QRCode
                  value={`bosshunt:reward:${selectedRewardData.id}`}
                  business={selectedRewardData.business}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface RewardCardProps {
  reward: typeof REWARDS[0];
  onClick: () => void;
  expired?: boolean;
}

const RewardCard = ({ reward, onClick, expired = false }: RewardCardProps) => {
  return (
    <div 
      className={`bg-card border rounded-lg p-4 flex items-center gap-4 transition-all duration-200
                ${expired ? "opacity-70" : "hover:shadow-md cursor-pointer"}`}
      onClick={expired ? undefined : onClick}
    >
      <div className="w-12 h-12 flex-shrink-0 rounded-full border overflow-hidden">
        <img 
          src={reward.business.logo} 
          alt={reward.business.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{reward.business.offer}</h3>
        <p className="text-xs text-muted-foreground mb-1">{reward.business.name}</p>
        
        <div className="flex items-center text-xs">
          {expired ? (
            <span className="flex items-center text-red-500">
              <Clock size={12} className="mr-1" />
              Expired on {reward.business.validUntil}
            </span>
          ) : (
            <span className="flex items-center text-green-600">
              <Check size={12} className="mr-1" />
              Valid until {reward.business.validUntil}
            </span>
          )}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {reward.earnedDate}
      </div>
    </div>
  );
};

export default Rewards;
