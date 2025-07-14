import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Coins, Star, Zap, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RewardsProps {
  userBalance?: { usdt_balance: number };
  referralEarnings: number;
  lastRewardClaim: number; // Changed to number (timestamp)
  onClaimReward: (amount: number) => void;
}

const Rewards = ({ userBalance, referralEarnings, lastRewardClaim, onClaimReward }: RewardsProps) => {
  const { toast } = useToast();

  const investmentStrategy = [
    { min: 10, max: 100, minYield: 0.5, maxYield: 2, label: '$10 - $100', description: 'Earn daily yields.', icon: Coins, gradient: 'from-green-400 to-emerald-500' },
    { min: 100, max: 500, minYield: 2, maxYield: 4, label: '$100 - $500', description: 'Higher earning potential.', icon: Zap, gradient: 'from-blue-400 to-cyan-500' },
    { min: 500, max: 1500, minYield: 4, maxYield: 6, label: '$500 - $1500', description: 'Maximum yields.', icon: Star, gradient: 'from-purple-400 to-pink-500' },
  ];

  const getRewardPercentage = (balance: number) => {
    if (balance >= 10 && balance <= 100) return 1.5;
    if (balance > 100 && balance <= 500) return 2.5;
    if (balance > 500 && balance <= 1500) return 3.5;
    return 0;
  };

  const rewards = [
    {
      type: 'Balance Reward',
      amount: (userBalance?.usdt_balance || 0) * (getRewardPercentage(userBalance?.usdt_balance || 0) / 100),
      claimed: false,
      icon: DollarSign,
      gradient: 'from-green-400 to-emerald-500',
      canClaim: Date.now() - lastRewardClaim >= 24 * 60 * 60 * 1000,
    },
    {
      type: 'Referral Bonus',
      amount: referralEarnings,
      claimed: false,
      icon: Users,
      gradient: 'from-blue-400 to-cyan-500',
      canClaim: Date.now() - lastRewardClaim >= 24 * 60 * 60 * 1000,
    },
  ].filter((r) => r.amount > 0);

  const handleClaimReward = (index: number) => {
    const reward = rewards[index];
    if (reward.canClaim) {
      onClaimReward(reward.amount);
      toast({ title: 'Reward Claimed', description: `Claimed ${reward.amount.toFixed(4)} USDT.` });
    } else {
      const hoursLeft = Math.ceil((24 * 60 * 60 * 1000 - (Date.now() - lastRewardClaim)) / (1000 * 60 * 60));
      toast({ variant: 'destructive', title: 'Cannot Claim', description: `Wait ${hoursLeft} hours.` });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20">
        <CardHeader>
          <CardTitle className="flex items-center"><Gift className="w-6 h-6 mr-3" />Available Rewards</CardTitle>
          <CardDescription>Claim every 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          {rewards.length > 0 ? (
            <div className="grid gap-4">
              {rewards.map((reward, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${reward.gradient} rounded-xl flex items-center justify-center`}>
                        <reward.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-base">{reward.type}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">${reward.amount.toFixed(4)} USDT</div>
                        {!reward.canClaim && <div className="text-xs text-orange-600 dark:text-orange-400">{Math.ceil((24 * 60 * 60 * 1000 - (Date.now() - lastRewardClaim)) / (1000 * 60 * 60))} hours left</div>}
                      </div>
                    </div>
                    <Button onClick={() => handleClaimReward(index)} disabled={!reward.canClaim} className={`w-full sm:w-auto ${reward.canClaim ? `bg-gradient-to-r ${reward.gradient} text-white` : 'bg-gray-300 text-gray-500'}`}>
                      {reward.canClaim ? 'Claim Reward' : 'Not Available'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No rewards available at this time.</p>
          )}
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center"><Coins className="w-6 h-6 mr-3" />Investment Strategy Tiers</CardTitle>
          <CardDescription>Maximize your returns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {investmentStrategy.map((strategy, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800">
                <CardContent className="p-4 flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${strategy.gradient} rounded-2xl flex items-center justify-center`}>
                    <strategy.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold">{strategy.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{strategy.description}</p>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">{strategy.minYield}% - {strategy.maxYield}% Daily</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rewards;