import { baseApi } from "../api/baseApi";
import qs from "qs";

export const accountService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createAccount: builder.mutation({
            query: (data) => {
                return {
                    url: "/accounts",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["accounts"],
        }),
        getAccounts: builder.query({
            query: (data) => {
                const params = Object.fromEntries(data || []);
                const queryString = qs.stringify(params, { encode: false });

                return {
                    url: `/accounts?${queryString}`,
                    method: "GET",
                };
            },
            providesTags: ["accounts"],
        }),
        getAccount: builder.query({
            query: (id) => {
                return {
                    url: `/accounts/${id}`,
                    method: "GET",
                };
            },
        }),
        getAccountSummary: builder.query({
            query: ({ id, startDate, endDate }) => {
                return {
                    url: `/accounts/${id}/${startDate}/${endDate}`,
                    method: "GET",
                };
            },
        }),
        getAccountSummaryForAdmin: builder.query({
            query: ({ startDate, endDate }) => {
                return {
                    url: `/accounts/${startDate}/${endDate}/for-admin`,
                    method: "GET",
                };
            },
        }),
        getAccountYearSummaryForAdmin: builder.query({
            query: (year) => {
                return {
                    url: `/accounts/${year}/year-summary/for-admin`,
                    method: "GET",
                };
            },
        }),
        updateAccount: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/accounts/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["accounts"],
        }),
    }),
});
