import { baseApi } from "../api/baseApi";

export const articleService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createArticle: builder.mutation({
            query: (data) => {
                return {
                    url: "/articles",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["articles"],
        }),
        getArticles: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/articles",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["articles"],
        }),
        getArticle: builder.query({
            query: (id) => {
                return {
                    url: `/articles/${id}`,
                    method: "GET",
                };
            },
        }),
        updateArticle: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/articles/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["articles"],
        }),
        deleteArticle: builder.mutation({
            query: (id) => {
                return {
                    url: `/articles/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["articles"],
        }),
    }),
});
