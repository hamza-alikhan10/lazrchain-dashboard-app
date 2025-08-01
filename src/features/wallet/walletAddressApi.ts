// src/features/wallet/walletAddressApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/user";

export const walletAddressApi = createApi({
  reducerPath: "walletApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: 'include', }),
  endpoints: (builder) => ({
    // POST: Save Wallet Address
    saveWalletAddress: builder.mutation<
      { success: boolean; message: string },
      { email: string; walletAddress: string }
    >({
      query: (data) => ({
        url: "/walletAddress",
        method: "POST",
        body: data,
      }),
    }),

    // GET: Referral Code by Email
    getReferralCode: builder.query<
      { success: boolean; referralCode: string },
      { email: string }
    >({
      query: ({ email }) => ({
        url: `/referralLink?email=${email}`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks
export const {
  useSaveWalletAddressMutation,
  useGetReferralCodeQuery,
} = walletAddressApi;
