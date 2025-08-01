import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/user';


export const dailyEarnings = createApi({
  reducerPath: 'dailyEarnings',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: 'include', }),
  endpoints: (builder) => ({

    getUserDailyEarnings: builder.query<
      { date: string; profitAmount: number }[],
      string // userId
    >({
      query: (userId) => `/dailyEarnings?userId=${userId}`,
    }),

    getUserReferralData: builder.query<
      {
        totalReferrals: number;
        dailyEarnings: number;
        activeReferrals: number;
        referrals: {
          email: string;
          investment: string;
          reward: string;
          earnings: string;
          status: "Active" | "Pending" | "Inactive";
        }[];
      },
      string // userId
    >({
      query: (userId) => `/referral?userId=${userId}`,
    }),
  }),
});

export const { useGetUserDailyEarningsQuery, useGetUserReferralDataQuery } = dailyEarnings;
