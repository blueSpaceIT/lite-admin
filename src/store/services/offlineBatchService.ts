import { baseApi } from "../api/baseApi";

export const offlineBatchService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createOfflineBatch: builder.mutation({
            query: (data) => ({
                url: "/offline-batches",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["offline-batches"],
        }),
        getOfflineBatches: builder.query({
            query: (params) => ({
                url: "/offline-batches",
                method: "GET",
                params,
            }),
            providesTags: ["offline-batches"],
        }),
        getOfflineBatch: builder.query({
            query: (id) => ({
                url: `/offline-batches/${id}`,
                method: "GET",
            }),
            providesTags: ["offline-batches"],
        }),
        updateOfflineBatch: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/offline-batches/${id}/update`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["offline-batches"],
        }),
        deleteOfflineBatch: builder.mutation({
            query: (id) => ({
                url: `/offline-batches/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["offline-batches"],
        }),
    }),
});
