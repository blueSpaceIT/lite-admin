import { baseApi } from "../api/baseApi";

export const newsService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createNews: builder.mutation({
            query: (data) => {
                return {
                    url: "/news",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["news"],
        }),
        getNewses: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/news",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["news"],
        }),
        getNews: builder.query({
            query: (id) => {
                return {
                    url: `/news/${id}`,
                    method: "GET",
                };
            },
        }),
        updateNews: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/news/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["news"],
        }),
        deleteNews: builder.mutation({
            query: (id) => {
                return {
                    url: `/news/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["news"],
        }),
    }),
});
