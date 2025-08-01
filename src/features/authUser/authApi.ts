import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/user";


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: 'include', }),
  endpoints: (builder) => ({

    //SignUp request
    signup: builder.mutation({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),

    //LogIn request
    signin: builder.mutation({
      query: (body) => ({
        url: '/auth/signin',
        method: 'POST',
        body,
      }),
    }),

    //  Verify Auth
    verifyAuth: builder.query<{
        isAuthenticated: boolean;
        id?: string;
        email?: string;
        error?: string;
      }, void>({
        query: () => 'auth/verify',
    }),

    // Logout request
    logout: builder.mutation<{ message: string; isAuthenticated: boolean }, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),

  }),
});

export const { useSignupMutation, useSigninMutation, useVerifyAuthQuery, useLogoutMutation } = authApi;
