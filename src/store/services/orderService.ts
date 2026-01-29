import { baseApi } from "../api/baseApi";

export const orderService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (data) => {
                return {
                    url: "/orders",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["orders"],
        }),
        getOrders: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/orders",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["orders"],
        }),
        getOrder: builder.query({
            query: (id) => {
                return {
                    url: `/orders/${id}`,
                    method: "GET",
                };
            },
        }),
        updateOrder: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/orders/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["orders"],
        }),
        deleteOrder: builder.mutation({
            query: (id) => {
                return {
                    url: `/orders/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["orders"],
        }),
    }),
});
