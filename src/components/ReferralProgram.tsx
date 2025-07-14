import React from 'react';
import { useUserData } from '@/hooks/useUserData';

interface ReferralProgramProps {
  referrals: any[];
}

const ReferralProgram: React.FC<ReferralProgramProps> = ({ referrals }) => {
  const { user, generateReferralCode, claimReferralBonus } = useUserData();

  const handleGenerateCode = async () => {
    const link = await generateReferralCode();
    if (link) alert(`Your referral link is: ${link}`);
  };

  const handleClaimBonus = async () => {
    await claimReferralBonus();
    alert('Referral bonus claimed, check your balance!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Referral Program</h2>
      <p className="mb-4">Invite friends to LazrChain and earn a percentage of their daily rewards!</p>
      
      <div className="mb-6">
        <button
          onClick={handleGenerateCode}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Referral Link
        </button>
        {user?.referral_link && (
          <div className="mt-2">
            <p>Your Referral Link: <span className="font-mono">{user.referral_link}</span></p>
            <button
              onClick={() => navigator.clipboard.writeText(user.referral_link)}
              className="ml-2 bg-gray-200 px-2 py-1 rounded"
            >
              Copy
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Referral Bonuses</h3>
        <ul className="list-disc pl-5">
          <li>$10 - $100 Balance: Earn 8% of referral rewards</li>
          <li>$100 - $500 Balance: Earn 15% of referral rewards</li>
          <li>$500 - $1500 Balance: Earn 18% of referral rewards</li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Your Referrals</h3>
        {referrals.length > 0 ? (
          <ul className="list-disc pl-5">
            {referrals.map((ref) => (
              <li key={ref.id}>Referred User ID: {ref.referred_user_id}, Code: {ref.referral_code}</li>
            ))}
          </ul>
        ) : (
          <p>No referrals yet.</p>
        )}
      </div>

      <button
        onClick={handleClaimBonus}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        disabled={referrals.length === 0}
      >
        Claim Referral Bonus
      </button>
    </div>
  );
};

export default ReferralProgram;