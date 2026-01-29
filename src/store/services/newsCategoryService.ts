import { baseApi } from "../api/baseApi";

export const newsCategoryService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createNewsCategory: builder.mutation({
            query: (data) => {
                return {
                    url: "/news-categories",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["newsCategories"],
        }),
        getNewsCategories: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/news-categories",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["newsCategories"],
        }),
        getNewsCategory: builder.query({
            query: (id) => {
                return {
                    url: `/news-categories/${id}`,
                    method: "GET",
                };
            },
        }),
        updateNewsCategory: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/news-categories/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["newsCategories"],
        }),
        deleteNewsCategory: builder.mutation({
            query: (id) => {
                return {
                    url: `/news-categories/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["newsCategories"],
        }),
    }),
});
