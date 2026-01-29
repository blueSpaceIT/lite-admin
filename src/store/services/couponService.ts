import { baseApi } from "../api/baseApi";

export const couponService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCoupon: builder.mutation({
            query: (data) => {
                return {
                    url: "/coupons",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["coupons"],
        }),
        getCoupons: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/coupons",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["coupons"],
        }),
        getCoupon: builder.query({
            query: (id) => {
                return {
                    url: `/coupons/${id}`,
                    method: "GET",
                };
            },
        }),
        updateCoupon: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/coupons/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["coupons"],
        }),
        deleteCoupon: builder.mutation({
            query: (id) => {
                return {
                    url: `/coupons/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["coupons"],
        }),
    }),
});
