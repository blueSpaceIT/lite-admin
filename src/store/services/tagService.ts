import { baseApi } from "../api/baseApi";

export const tagService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createTag: builder.mutation({
            query: (data) => {
                return {
                    url: "/tags",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["tags"],
        }),
        getTags: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/tags",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["tags"],
        }),
        getTag: builder.query({
            query: (id) => {
                return {
                    url: `/tags/${id}`,
                    method: "GET",
                };
            },
        }),
        updateTag: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/tags/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["tags"],
        }),
        deleteTag: builder.mutation({
            query: (id) => {
                return {
                    url: `/tags/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["tags"],
        }),
    }),
});
