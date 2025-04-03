import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from "../../utils/getBaseUrl";

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api`,
    credentials: 'include',
    prepareHeaders: (Headers) => {
        // Set Content-Type header
        Headers.set('Content-Type', 'application/json');
        
        const token = localStorage.getItem("token");
        if (token) {
            Headers.set("Authorization", `Bearer ${token}`);
        }
        return Headers;
    }
});

export const bankApi = createApi({
    reducerPath: "bankApi",
    baseQuery,
    tagTypes: ['User', 'Account', 'Transaction'],
    endpoints: (builder) => ({
        // Authentication endpoints
        registerUser: builder.mutation({
            query: (userData) => ({
                url: '/users/create',
                method: 'POST',
                body: userData
            }),
        }),
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: '/users/login',
                method: 'POST',
                body: credentials
            }),
            transformResponse: (response) => {
                if (response.token) {
                    localStorage.setItem('token', response.token);
                }
                return response;
            },
        }),
        getUserDetails: builder.query({
            query: () => '/users/me',
            transformResponse: (response) => {
                // Store some user details in localStorage for easier access
                if (response.user) {
                    localStorage.setItem('firstName', response.user.firstName);
                    localStorage.setItem('lastName', response.user.lastName);
                    localStorage.setItem('email', response.user.email);
                    localStorage.setItem('hasPin', response.user.hasPin ? 'true' : 'false');
                    // Convert ISO date to Date and then store
                    if (response.user.createdAt) {
                        localStorage.setItem('dateJoined', response.user.createdAt);
                    }
                    if (response.user.phone) {
                        localStorage.setItem('phone', response.user.phone);
                    }
                }
                return response.user;
            },
            providesTags: ['User'],
        }),
        
        // Account endpoints
        createAccount: builder.mutation({
            query: (accountData) => ({
                url: '/accounts/create',
                method: 'POST',
                body: accountData
            }),
            invalidatesTags: ['Account'],
        }),
        getAccounts: builder.query({
            query: () => '/accounts/list',
            providesTags: ['Account'],
        }),
        getAccountDetails: builder.query({
            query: (accountId) => `/accounts/${accountId}`,
            providesTags: (result, error, accountId) => [{ type: 'Account', id: accountId }],
        }),
        verifyAccount: builder.query({
            query: (accountNumber) => `/accounts/verify/${accountNumber}`,
            providesTags: ['Account']
        }),
        
        // Transaction endpoints with PIN support
        createTransaction: builder.mutation({
            query: (transactionData) => ({
                url: '/transactions/transfer',
                method: 'POST',
                body: transactionData
            }),
            invalidatesTags: ['Transaction', 'Account'],
        }),
        getTransactionHistory: builder.query({
            query: () => '/transactions/history',
            providesTags: ['Transaction'],
        }),
        setTransactionPin: builder.mutation({
            query: (pinData) => ({
                url: '/transactions/set-pin',
                method: 'POST',
                body: pinData
            }),
            invalidatesTags: ['User', 'Account'],
        }),

        getTransactionPin: builder.query({
            query: (accountNumber) => `/transactions/pin/${accountNumber}`,
            providesTags: ['Account'],
        }),
    }),
});

// Create a logout action that can be dispatched
export const logout = () => {
    return () => {
        localStorage.removeItem('token');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        localStorage.removeItem('dateJoined');
        localStorage.removeItem('hasPin');
    };
};

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGetUserDetailsQuery,
    useCreateAccountMutation,
    useGetAccountsQuery,
    useGetAccountDetailsQuery,
    useCreateTransactionMutation,
    useGetTransactionHistoryQuery,
    useSetTransactionPinMutation,
    useVerifyAccountQuery,
    useGetTransactionPinQuery
} = bankApi;