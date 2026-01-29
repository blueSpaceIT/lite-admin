import { baseApi } from "../api/baseApi";

export const purchaseService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createPurchase: builder.mutation({
            query: (data) => {
                return {
                    url: "/purchases",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["purchases"],
        }),
        getPurchases: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/purchases",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["purchases"],
        }),
        getDuePurchases: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/purchases/due-purchases",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["due-purchases"],
        }),
        getPurchase: builder.query({
            query: (id) => {
                return {
                    url: `/purchases/${id}`,
                    method: "GET",
                };
            },
        }),
        updatePurchase: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/purchases/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["purchases"],
        }),
        deletePurchase: builder.mutation({
            query: (id) => {
                return {
                    url: `/purchases/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["purchases"],
        }),
    }),
});
