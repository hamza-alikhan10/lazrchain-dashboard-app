import { useEffect } from "react";
import { useGetReferralCodeQuery } from "@/features/wallet/walletAddressApi";
import { useGetReferralBonusTiersQuery } from "@/features/Ref_Rew_Tiers/tiers";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setReferralCode } from "@/features/wallet/refferalLinkSlice";

import { useGetUserReferralDataQuery } from "@/features/wallet/dailyEarningsApi";

import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Star, Copy } from "lucide-react";

const ReferralTierSkeleton = () => (
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


const tierVisuals = [
  {
    icon: Users,
    gradient: "from-green-400 to-teal-500",
  },
  {
    icon: TrendingUp,
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    icon: Star,
    gradient: "from-purple-400 to-violet-500",
  },
];

const ReferralProgram = () => {
  const referralCode = useAppSelector((state) => state.referral.referralCode);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { userEmail, userId } = useAppSelector((state) => state.auth);
  const {
    data: referralStats,
    error: referralError,
    isLoading: referralLoading,
  } = useGetUserReferralDataQuery(userId, { skip: !userId });

  const { data: codeData, isLoading: isReferralCodeLoading } = useGetReferralCodeQuery(
    { email: userEmail },
    { skip: !userEmail || !!referralCode }
  );

  const {
    data: tierData,
    isLoading: isTiersLoading,
    error: tierError,
  } = useGetReferralBonusTiersQuery();

  const mergeTierData = (tiersFromApi: typeof tierData.tiers) => {
    return tiersFromApi.map((tier, index) => ({
      ...tier,
      ...tierVisuals[index % tierVisuals.length], // fallback cyclically if >3
    }));
  };

  useEffect(() => {
    if (referralError) {
      toast({
        title: "Referral Fetch Failed",
        description: "Unable to load referral data.",
        variant: "destructive",
      });
    }
  }, [referralError]);

  useEffect(() => {
    if (codeData?.referralCode && !referralCode) {
      dispatch(setReferralCode(codeData.referralCode));
    }
  }, [codeData, dispatch, referralCode]);

  useEffect(() => {
    if (tierError) {
      toast({
        title: "Error",
        description: "Failed to fetch referral tiers.",
        variant: "destructive",
      });
    }
  }, [tierError]);

  const onCopied = (link: string) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Referral link has been copied to clipboard.",
          duration: 3000,
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Could not copy the referral link.",
          duration: 3000,
        });
      });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Users className="w-6 h-6 mr-3 text-green-500 dark:text-green-400" />
            Referral Program
          </CardTitle>
          <CardDescription>
            Build your network and earn daily from your referrals' rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Your Referral Link:
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <input
                  readOnly
                  value={isReferralCodeLoading ? "Loading..." : referralCode || ""}
                  className="flex-1 text-xs sm:text-sm text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-11 sm:h-12 rounded-xl px-3 py-2 font-mono border"
                />
                <Button
                  onClick={() => onCopied(referralCode)}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl"
                >
                  <Copy className="w-4 h-4 mr-2" /> Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Referral Bonus Tiers
            </h3>
            <div className="grid gap-4">
                {isTiersLoading
                  ? Array(3).fill(0).map((_, i) => <ReferralTierSkeleton key={i} />)
                  : mergeTierData(tierData?.tiers || []).map((tier, index) => (
                      <Card key={index} className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
                        <div className={`h-2 bg-gradient-to-r ${tier.gradient}`} />
                        <CardContent className="p-4 sm:p-6 flex items-start space-x-4">
                          <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-r ${tier.gradient}`}>
                            {tier.icon && <tier.icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base sm:text-lg font-bold mb-2 text-gray-900 dark:text-white">
                              ${tier.minInvestment} - ${tier.maxInvestment}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              {tier.description}
                            </p>
                            <Badge className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 font-semibold">
                              {tier.referralPercentage}% of Referral's Daily Reward
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
              </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center shadow-xl p-6">
              <div className="text-3xl font-bold mb-1">{referralStats?.totalReferrals ?? 0}</div>
              <div className="text-sm opacity-90">Total Referrals</div>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center shadow-xl p-6">
              <div className="text-3xl font-bold mb-1">${referralStats?.dailyEarnings.toFixed(3) ?? "0.0000"}</div>
              <div className="text-sm opacity-90">Daily Earnings</div>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center shadow-xl p-6">
              <div className="text-3xl font-bold mb-1">{referralStats?.activeReferrals ?? 0}</div>
              <div className="text-sm opacity-90">Active Referrals</div>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">Referral Performance</CardTitle>
          <CardDescription>
            Track your referrals and their daily contributions
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-700 dark:text-gray-200">
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Investment</th>
                <th className="px-4 py-3 text-left">Daily Reward</th>
                <th className="px-4 py-3 text-left">Your Earnings</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
         <tbody>
            {referralStats?.referrals?.length > 0 ? (
              referralStats.referrals.map((ref, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {ref.email}
                  </td>
                  <td className="px-4 py-3 font-bold text-green-600 dark:text-green-400">
                    {ref.investment}
                  </td>
                  <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">
                    {ref.reward}
                  </td>
                  <td className="px-4 py-3 font-bold text-purple-600 dark:text-purple-400">
                    {ref.earnings}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
                        ref.status === "Active"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-300 italic"
                >
                  No referrals yet
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralProgram;
