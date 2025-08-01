import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/user';

export const referralEarningsApi = createApi({
  reducerPath: 'referralEarningsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['ReferralTotal'], // 👈 for cache invalidation
  endpoints: (builder) => ({
    // GET yesterday's earnings
    getYesterdayReferralTotal: builder.query<
      { totalEarnings: number; date: string; count: number },
      string
    >({
      query: (userId) => `referralEarningsTotal?userId=${userId}`,
      providesTags: ['ReferralTotal'],
    }),

    // PATCH to mark yesterday's earnings as claimed
    claimYesterdayReferralEarnings: builder.mutation<
      { message: string; updatedCount: number; date: string },
      string // userId
    >({
      query: (userId) => ({
        url: `claimeReferralEarnings?userId=${userId}`, // your PATCH route
        method: 'PATCH',
      }),
      invalidatesTags: ['ReferralTotal'], //  triggers refetch of getYesterdayReferralTotal
    }),
  }),
});

export const {
  useGetYesterdayReferralTotalQuery,
  useClaimYesterdayReferralEarningsMutation,
} = referralEarningsApi;
