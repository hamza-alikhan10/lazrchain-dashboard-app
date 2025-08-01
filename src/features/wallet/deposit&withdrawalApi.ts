import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/user';

export const yieldAndDepositApi = createApi({
  reducerPath: 'yieldAndDepositApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: 'include', }),
  tagTypes: ['Yield', 'TotalYield'], // For cache invalidation and refetch

  endpoints: (builder) => ({
    // Mutation: Confirm Deposit
    depositUSDT: builder.mutation<
      {
        success: boolean;
        message: string;
        txHash: string;
        userWallet: string;
        amount: number;
        totalDeposited: number;
        interestRate: number;
        date: string;
      },
      {
        walletAddress: string;
        txHash: string;
        amount: number;
      }
    >({
      query: (body) => ({
        url: '/deposits',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Yield', 'TotalYield'], // 👈 triggers refetch of both
    }),

        // Mutation: Withdraw USDT
    withdrawUSDT: builder.mutation<
      {
        success: boolean;
        txHash: string;
        amount: number;
        message: string;
        updatedReferralEarning?: number;
        updatedDeposit?: number;
      },
      {
        userId: string;
        amount: number;
      }
    >({
      query: (body) => ({
        url: '/withdrawal',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TotalYield'], // 👈 refetch total-yield only
    }),

    // Query: Get user's virtual yield
    getUserYield: builder.query<
      {
        yield: number;
        details: {
          txHash: string;
          amount: number;
          depositedAt: string;
          virtualYield: number;
        }[];
      },
      string // userId
    >({
      query: (userId) => ({
        url: `/yield?userId=${userId}`,
        method: 'GET',
      }),
      providesTags: ['Yield'], // Cache tag for auto-refetch
    }),

    // ✅ New Query: Get user's total yield (referral + deposit)
    getTotalYield: builder.query<
      {
        success: boolean;
        totalDeposited: number;
        totalReferralEarning: number;
        totalYield: number;
      },
      string // userId
    >({
      query: (userId) => ({
        url: `/total-yield?userId=${userId}`,
        method: 'GET',
      }),
      providesTags: ['TotalYield'], // 👈 will be refetched when invalidated
    })

  }),
});

export const {
  useDepositUSDTMutation,
  useGetUserYieldQuery,
  useWithdrawUSDTMutation,
  useGetTotalYieldQuery,
} = yieldAndDepositApi;
