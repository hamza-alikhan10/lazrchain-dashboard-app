import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  Clock, 
  Star, 
  Trophy,
  Zap,
  Target,
  CheckCircle,
  Lock,
  Coins
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserBalance {
  usdt_balance: number;
}

interface RewardsProps {
  userBalance: UserBalance;
  referralEarnings: number;
  lastRewardClaim: Date | null;
  onClaimReward: (amount: number) => void;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  requirement: string;
  reward: number;
  type: 'daily' | 'milestone' | 'achievement';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  claimed: boolean;
  icon: any;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const Rewards = ({ userBalance, referralEarnings, lastRewardClaim, onClaimReward }: RewardsProps) => {
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<string>('');
  const [canClaimDaily, setCanClaimDaily] = useState(false);
  const { toast } = useToast();

  // Calculate time until next daily reward
  useEffect(() => {
    const updateTimer = () => {
      if (lastRewardClaim) {
        const nextClaimTime = new Date(lastRewardClaim.getTime() + 24 * 60 * 60 * 1000);
        const now = new Date();
        const timeDiff = nextClaimTime.getTime() - now.getTime();

        if (timeDiff <= 0) {
          setCanClaimDaily(true);
          setTimeUntilNextClaim('');
        } else {
          setCanClaimDaily(false);
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          setTimeUntilNextClaim(`${hours}h ${minutes}m ${seconds}s`);
        }
      } else {
        setCanClaimDaily(true);
        setTimeUntilNextClaim('');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lastRewardClaim]);

  // Define rewards based on user progress
  const rewards: Reward[] = [
    {
      id: 'daily',
      title: 'Daily Bonus',
      description: 'Claim your daily USDT bonus',
      requirement: 'Available every 24 hours',
      reward: 1.0,
      type: 'daily',
      progress: canClaimDaily ? 1 : 0,
      maxProgress: 1,
      unlocked: true,
      claimed: !canClaimDaily,
      icon: Gift,
      rarity: 'common'
    },
    {
      id: 'first_deposit',
      title: 'First Deposit Bonus',
      description: 'Bonus for your first deposit',
      requirement: 'Make your first deposit',
      reward: 5.0,
      type: 'milestone',
      progress: userBalance.usdt_balance > 0 ? 1 : 0,
      maxProgress: 1,
      unlocked: true,
      claimed: userBalance.usdt_balance === 0,
      icon: Star,
      rarity: 'rare'
    },
    {
      id: 'balance_100',
      title: 'Century Club',
      description: 'Reach $100 USDT balance',
      requirement: 'Maintain $100+ balance',
      reward: 10.0,
      type: 'milestone',
      progress: Math.min(userBalance.usdt_balance, 100),
      maxProgress: 100,
      unlocked: true,
      claimed: userBalance.usdt_balance < 100,
      icon: Trophy,
      rarity: 'epic'
    },
    {
      id: 'referral_master',
      title: 'Referral Master',
      description: 'Earn $25 from referrals',
      requirement: 'Total referral earnings',
      reward: 15.0,
      type: 'achievement',
      progress: Math.min(referralEarnings, 25),
      maxProgress: 25,
      unlocked: true,
      claimed: referralEarnings < 25,
      icon: Target,
      rarity: 'epic'
    },
    {
      id: 'diamond_hands',
      title: 'Diamond Hands',
      description: 'Reach $500 USDT balance',
      requirement: 'Maintain $500+ balance',
      reward: 50.0,
      type: 'milestone',
      progress: Math.min(userBalance.usdt_balance, 500),
      maxProgress: 500,
      unlocked: userBalance.usdt_balance >= 100,
      claimed: userBalance.usdt_balance < 500,
      icon: Zap,
      rarity: 'legendary'
    }
  ];

  const handleClaimReward = (reward: Reward) => {
    onClaimReward(reward.reward);
    toast({
      title: 'Reward Claimed!',
      description: `You received ${reward.reward} USDT for ${reward.title}`,
      duration: 3000,
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const totalAvailableRewards = rewards.filter(r => r.unlocked && r.progress >= r.maxProgress && !r.claimed).length;
  const totalClaimedRewards = rewards.filter(r => r.claimed || (r.progress >= r.maxProgress && r.type !== 'daily')).length;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-crypto hover:card-glow transition-all duration-300">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center text-lg">
              <Gift className="w-5 h-5 mr-2" />
              Available Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">{totalAvailableRewards}</div>
            <p className="text-sm text-muted-foreground mt-1">Ready to claim</p>
          </CardContent>
        </Card>

        <Card className="card-crypto hover:card-glow transition-all duration-300">
          <CardHeader className="bg-gradient-success text-success-foreground rounded-t-lg">
            <CardTitle className="flex items-center text-lg">
              <CheckCircle className="w-5 h-5 mr-2" />
              Claimed Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">{totalClaimedRewards}</div>
            <p className="text-sm text-muted-foreground mt-1">Total achievements</p>
          </CardContent>
        </Card>

        <Card className="card-crypto hover:card-glow transition-all duration-300">
          <CardHeader className="bg-gradient-secondary text-secondary-foreground rounded-t-lg">
            <CardTitle className="flex items-center text-lg">
              <Coins className="w-5 h-5 mr-2" />
              Rewards Value
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">
              ${rewards.reduce((sum, r) => r.claimed || (r.progress >= r.maxProgress && r.type !== 'daily') ? sum + r.reward : sum, 0).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Total USDT earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Reward Section */}
      <Card className="card-crypto">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-foreground">
            <Gift className="w-6 h-6 mr-2 text-primary" />
            Daily Reward
          </CardTitle>
          <CardDescription>
            Claim your daily bonus every 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Daily Bonus</h3>
                <p className="text-muted-foreground">+1.0 USDT</p>
              </div>
            </div>
            <div className="text-right">
              {canClaimDaily ? (
                <Button 
                  onClick={() => handleClaimReward(rewards[0])}
                  className="btn-crypto"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Claim Now
                </Button>
              ) : (
                <div>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    Next reward in
                  </div>
                  <div className="text-lg font-bold text-foreground">{timeUntilNextClaim}</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Rewards */}
      <Card className="card-crypto">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-foreground">
            <Trophy className="w-6 h-6 mr-2 text-primary" />
            All Rewards
          </CardTitle>
          <CardDescription>
            Complete milestones and achievements to earn USDT rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rewards.map((reward) => {
              const Icon = reward.icon;
              const isCompleted = reward.progress >= reward.maxProgress;
              const canClaim = reward.unlocked && isCompleted && !reward.claimed && reward.type !== 'daily';
              const isDailyClaimed = reward.type === 'daily' && !canClaimDaily;

              return (
                <div 
                  key={reward.id}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    !reward.unlocked 
                      ? 'bg-muted/30 border-muted' 
                      : isCompleted 
                        ? 'bg-success/10 border-success/30 shadow-glow' 
                        : 'bg-card border-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        !reward.unlocked ? 'bg-muted' : getRarityColor(reward.rarity)
                      }`}>
                        {reward.unlocked ? (
                          <Icon className="w-6 h-6 text-white" />
                        ) : (
                          <Lock className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${getRarityTextColor(reward.rarity)}`}>
                          {reward.title}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs capitalize ${getRarityTextColor(reward.rarity)} border-current`}
                        >
                          {reward.rarity}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">+{reward.reward} USDT</div>
                      {isCompleted && (reward.claimed || isDailyClaimed) && (
                        <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Claimed
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                  <p className="text-xs text-muted-foreground mb-3">{reward.requirement}</p>

                  {reward.unlocked && reward.maxProgress > 1 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{reward.progress.toFixed(1)} / {reward.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(reward.progress / reward.maxProgress) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}

                  {canClaim && (
                    <Button 
                      onClick={() => handleClaimReward(reward)}
                      className="w-full btn-success"
                      size="sm"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Claim Reward
                    </Button>
                  )}

                  {!reward.unlocked && (
                    <div className="text-xs text-muted-foreground italic">
                      Complete previous milestones to unlock
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rewards;