
export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  level: number;
  bosses_defeated: number;
  rewards_earned: number;
  created_at: string;
  updated_at: string;
}
