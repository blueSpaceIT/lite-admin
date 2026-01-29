import { baseApi } from "../api/baseApi";

export const productService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createProduct: builder.mutation({
            query: (data) => {
                return {
                    url: "/products",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["products"],
        }),
        getProducts: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/products",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["products"],
        }),
        getProduct: builder.query({
            query: (id) => {
                return {
                    url: `/products/${id}`,
                    method: "GET",
                };
            },
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/products/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["products"],
        }),
        deleteProduct: builder.mutation({
            query: (id) => {
                return {
                    url: `/products/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["products"],
        }),
    }),
});
