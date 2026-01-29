import { baseApi } from "../api/baseApi";

export const mediaService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createMedia: builder.mutation({
            query: (data) => {
                return {
                    url: "/media",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["media"],
        }),
        getMedium: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/media",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["media"],
        }),
        getMedia: builder.query({
            query: (id) => {
                return {
                    url: `/media/${id}`,
                    method: "GET",
                };
            },
        }),
        deleteMedia: builder.mutation({
            query: (id) => {
                return {
                    url: `/media/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["media"],
        }),
    }),
});
