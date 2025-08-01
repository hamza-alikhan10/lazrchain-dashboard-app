import { useState, useEffect } from "react";
import { useUserData } from "@/hooks/useUserData";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Coins, Star, Zap, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGetInvestmentTiersQuery } from "@/features/Ref_Rew_Tiers/tiers";
import { useGetYesterdayReferralTotalQuery, useClaimYesterdayReferralEarningsMutation } from "@/features/referral/referralApi";

import { useAppSelector } from "@/store/hooks";

const staticStrategyVisuals = [
  { icon: Coins, gradient: 'from-green-400 to-emerald-500' },
  { icon: Zap, gradient: 'from-blue-400 to-cyan-500' },
  { icon: Star, gradient: 'from-purple-400 to-pink-500' },
];

const mergeInvestmentTiers = (tiers) => {
  return tiers.map((tier, i) => ({
    ...tier,
    icon: staticStrategyVisuals[i % staticStrategyVisuals.length].icon,
    gradient: staticStrategyVisuals[i % staticStrategyVisuals.length].gradient,
    label: `$${tier.min} - $${tier.max}`,
    minYield: tier.dailyYieldMin,
    maxYield: tier.dailyYieldMax,
  }));
};

const StrategySkeleton = () => ( 
  <Card className="bg-white dark:bg-gray-500 shadow-lg overflow-hidden animate-pulse">
    <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300" />
    <CardContent className="p-4 sm:p-6 flex items-start space-x-4">
      <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-r from-gray-200 to-gray-300" />
      <div className="flex-1 space-y-5 mt-2">
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-300 rounded" />
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-300 rounded" />
        <div className="h-6 w-40 bg-green-100 dark:bg-green-700/20 border border-green-200 dark:border-green-700 rounded" />
      </div>
    </CardContent>
  </Card>
);

const RewardsPage = () => {
  const { toast } = useToast();
  const { userBalance, pastEarnings, lastRewardClaim, claimReward } = useUserData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { userId } = useAppSelector((state) => state.auth);

  const { data: tierData, error: tierError, isLoading: tierLoading } = useGetInvestmentTiersQuery();
  const [claimReferralEarnings, { isLoading: isClaiming }] = useClaimYesterdayReferralEarningsMutation();

  //get all the referral earnings for yesterday
  const {
    data: referralTotalData,
    error: referralTotalError,
    isLoading: referralTotalLoading,
  } = useGetYesterdayReferralTotalQuery(userId, { skip: !userId });

  useEffect(() => {
  if (referralTotalError) {
    toast({
      variant: "destructive",
      title: "Referral Earnings Error",
      description:
        'data' in referralTotalError ? (referralTotalError?.data as any)?.description : "Unable to load referral rewards for yesterday.",
      duration: 3000,
    });
  }
}, [referralTotalError, toast]);

  useEffect(() => {
    if (tierError) {
      toast({
        variant: "destructive",
        title: "Error loading investment tiers",
        description: "Something went wrong while fetching strategy tiers.",
      });
    }
  }, [tierError]);

  const referralEarnings = referralTotalData?.totalEarnings ?? 0;

  const rewards = [
    {
      type: 'Referral Bonus',
      amount: referralEarnings,
      claimed: false,
      icon: Users,
      gradient: 'from-blue-400 to-cyan-500',
      canClaim: Date.now() - lastRewardClaim >= 24 * 60 * 60 * 1000,
    },
  ].filter((r) => r.amount > 0);

 const handleClaimReward = async () => {
  // if (referralEarnings <= 0) {
  //   toast({
  //     variant: 'destructive',
  //     title: 'Not Available',
  //     description: 'No earnings to claim for yesterday.',
  //   });
  //   return;
  // }

  try {
    const res = await claimReferralEarnings(userId).unwrap();
    toast({
      title: 'Reward Claimed',
      description: `Successfully claimed yesterday's referral earnings.`,
      duration: 3000,
    });
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Claim Failed',
      description:
        'data' in error ? (error.data as any)?.description : 'Unable to claim referral earnings.',
      duration: 3000,
    });
  }
};


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-semibold">
            <Gift className="w-6 h-6 mr-3 text-yellow-500" />Available Rewards (Every 24 Hours)
          </CardTitle>
          <CardDescription>Claim every 24 hours</CardDescription>
        </CardHeader>

        <CardContent className="shadow-lg rounded-b-[11px]">
          <div className="grid gap-4">
            <Card className="pt-2 bg-gradient-to-r from-blue-400 to-cyan-500 dark:bg-gray-800">
              <CardContent className="p-4 py-5 flex bg-white rounded-b-[11px] shadow-lg flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center pl-2 space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-base">Referral Bonus</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ${referralEarnings.toFixed(4)} USDT Reward
                    </div>
                  </div>
                </div>

              <Button
                  onClick={handleClaimReward}
                  disabled={referralEarnings <= 0 || isClaiming}
                  className={`w-full mr-2 sm:w-auto ${
                    referralEarnings > 0
                      ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {isClaiming ? 'Claiming...' : referralEarnings > 0 ? 'Claim Reward' : 'Not Available'}
                </Button>

              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-semibold">
            <Coins className="w-6 h-6 mr-3 text-yellow-500" />Investment Strategy Tiers
          </CardTitle>
          <CardDescription className="text-md text-gray-600">Maximize your returns with strategic investment levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {tierLoading
              ? Array(3).fill(null).map((_, i) => <StrategySkeleton key={i} />)
              : mergeInvestmentTiers(tierData?.tiers || []).map((strategy, index) => (
                <Card key={index} className={`pt-3 bg-gradient-to-r ${strategy.gradient} shadow-lg dark:bg-gray-800`}>
                  <CardContent className="p-4 bg-white rounded-b-[11px] pt-7 pl-7 pb-7 flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${strategy.gradient} scale-110 rounded-2xl flex items-center justify-center`}>
                      <strategy.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="pl-1">
                      <h4 className="text-lg font-[600] -mt-1">{strategy.label}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 pt-2">{strategy.description}</p>
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 mt-3 font-bold text-green-700">
                        {strategy.minYield}% - {strategy.maxYield}% Daily
                      </Badge>
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

export default RewardsPage;
