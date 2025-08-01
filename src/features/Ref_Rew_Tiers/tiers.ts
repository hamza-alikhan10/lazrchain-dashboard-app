// src/features/Ref_Rew_Tiers/referralBonusApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/user";

export const tiersApi = createApi({
  reducerPath: 'tiersApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: 'include', }),
  endpoints: (builder) => ({

    // Referral Bonus Tiers
    getReferralBonusTiers: builder.query<
      {
        success: boolean;
        tiers: {
          _id: string;
          tierName: string;
          minInvestment: number;
          maxInvestment: number;
          referralPercentage: number;
          description: string;
          createdAt: string;
          updatedAt: string;
        }[];
      },
      void
    >({
      query: () => ({
        url: '/referralTier',
        method: 'GET',
      }),
    }),

    // Investment Tiers
    getInvestmentTiers: builder.query<
      {
        success: boolean;
        tiers: {
          _id: string;
          tierName: string;
          min: number;
          max: number;
          dailyYieldMin: number;
          dailyYieldMax: number;
          description: string;
          createdAt: string;
          updatedAt: string;
        }[];
      },
      void
    >({
      query: () => ({
        url: '/investmentTier',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetReferralBonusTiersQuery,
  useGetInvestmentTiersQuery,
} = tiersApi;
