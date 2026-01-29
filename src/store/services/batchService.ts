import { baseApi } from "../api/baseApi";

export const batchService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBatch: builder.mutation({
            query: (data) => {
                return {
                    url: "/batches",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["batches"],
        }),
        getBatches: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/batches",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["batches"],
        }),
        getBatch: builder.query({
            query: (id) => {
                return {
                    url: `/batches/${id}`,
                    method: "GET",
                };
            },
        }),
        updateBatch: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/batches/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["batches"],
        }),
        deleteBatch: builder.mutation({
            query: (id) => {
                return {
                    url: `/batches/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["batches"],
        }),
    }),
});
