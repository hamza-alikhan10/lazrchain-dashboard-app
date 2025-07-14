import { useState, useEffect } from 'react';

export interface UserBalance {
  usdt_balance: number;
}

export interface PastEarning {
  date: string;
  daily_earnings: number;
  referral_earnings?: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'reward';
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

export interface Referral {
  id: string;
  email: string;
  joined_date: string;
  total_earnings: number;
  status: 'active' | 'inactive';
}

export interface User {
  id: string;
  email: string;
  referral_link?: string;
}

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'user@lazrchain.com',
  referral_link: ''
};

const mockUserBalance: UserBalance = {
  usdt_balance: 250.75
};

const generatePastEarnings = (): PastEarning[] => {
  const earnings: PastEarning[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    earnings.push({
      date: date.toLocaleDateString(),
      daily_earnings: Math.random() * 5 + 1, // Random between 1-6 USDT
      referral_earnings: Math.random() < 0.3 ? Math.random() * 2 : 0 // 30% chance of referral earnings
    });
  }
  
  return earnings;
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 100,
    date: new Date().toLocaleDateString(),
    status: 'completed'
  },
  {
    id: '2',
    type: 'reward',
    amount: 2.5,
    date: new Date(Date.now() - 86400000).toLocaleDateString(),
    status: 'completed'
  },
  {
    id: '3',
    type: 'withdrawal',
    amount: 50,
    date: new Date(Date.now() - 172800000).toLocaleDateString(),
    status: 'completed'
  }
];

const mockReferrals: Referral[] = [
  {
    id: '1',
    email: 'friend1@example.com',
    joined_date: '2024-01-15',
    total_earnings: 15.50,
    status: 'active'
  },
  {
    id: '2',
    email: 'friend2@example.com',
    joined_date: '2024-01-20',
    total_earnings: 8.25,
    status: 'active'
  },
  {
    id: '3',
    email: 'friend3@example.com',
    joined_date: '2024-02-01',
    total_earnings: 3.75,
    status: 'inactive'
  }
];

export const useUserData = () => {
  const [user, setUser] = useState<User>(mockUser);
  const [userBalance, setUserBalance] = useState<UserBalance>(mockUserBalance);
  const [pastEarnings] = useState<PastEarning[]>(generatePastEarnings());
  const [todayEarnings, setTodayEarnings] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [referrals] = useState<Referral[]>(mockReferrals);
  const [lastRewardClaim] = useState<number>(Date.now() - 3600000); // 1 hour ago
  const [loading] = useState<boolean>(false);

  // Calculate today's earnings based on past earnings
  useEffect(() => {
    const today = pastEarnings[pastEarnings.length - 1];
    if (today) {
      setTodayEarnings(today.daily_earnings + (today.referral_earnings || 0));
    }
  }, [pastEarnings]);

  const updateBalance = (amount: number) => {
    setUserBalance(prev => ({
      ...prev,
      usdt_balance: Math.max(0, prev.usdt_balance + amount)
    }));
  };

  const claimReward = async (amount: number, type: 'deposit' | 'withdrawal' | 'reward') => {
    // Update balance
    updateBalance(amount);
    
    // Add transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: Math.abs(amount),
      date: new Date().toLocaleDateString(),
      status: 'completed'
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    return Promise.resolve();
  };

  const generateReferralCode = () => {
    const code = `LAZR${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const referralLink = `https://lazrchain.app/ref/${code}`;
    setUser(prev => ({ ...prev, referral_link: referralLink }));
    return referralLink;
  };

  const claimReferralBonus = async () => {
    const bonusAmount = 5; // Fixed bonus amount
    updateBalance(bonusAmount);
    return Promise.resolve();
  };

  const refreshData = async () => {
    // Simulate data refresh
    return Promise.resolve();
  };

  return {
    user,
    userBalance,
    pastEarnings,
    todayEarnings,
    transactions,
    referrals,
    lastRewardClaim,
    loading,
    updateBalance,
    claimReward,
    generateReferralCode,
    claimReferralBonus,
    refreshData
  };
};