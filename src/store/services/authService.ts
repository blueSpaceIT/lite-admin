import { baseApi } from "../api/baseApi";

export const authService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signin: builder.mutation({
            query: (credentials) => {
                return {
                    url: "/auth/signin/admin",
                    method: "POST",
                    body: credentials,
                };
            },
        }),
        getMe: builder.query({
            query: () => {
                return {
                    url: "/auth/me/admin",
                    method: "GET",
                };
            },
        }),
        forgetPassword: builder.mutation({
            query: (data) => {
                return {
                    url: "/auth/forget-password/admin",
                    method: "POST",
                    body: data,
                };
            },
        }),
        resetPassword: builder.mutation({
            query: ({ token, ...data }) => {
                return {
                    url: "/auth/reset-password/admin",
                    method: "POST",
                    body: data,
                    headers: {
                        authorization: token,
                    },
                };
            },
        }),
    }),
});
