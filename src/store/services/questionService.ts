import { baseApi } from "../api/baseApi";

export const questionService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createQuestion: builder.mutation({
            query: (data) => {
                return {
                    url: "/questions",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["questions"],
        }),
        getQuestions: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/questions",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["questions"],
        }),
        getQuestionsByTags: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/questions/filter-tags",
                    method: "GET",
                    params,
                };
            },
        }),
        getQuestionsByTagsInDepth: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/questions/filter-tags-depth",
                    method: "GET",
                    params,
                };
            },
        }),
        getQuestion: builder.query({
            query: (id) => {
                return {
                    url: `/questions/${id}`,
                    method: "GET",
                };
            },
        }),
        updateQuestion: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/questions/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["questions"],
        }),
        deleteQuestion: builder.mutation({
            query: (id) => {
                return {
                    url: `/questions/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["questions"],
        }),
    }),
});
