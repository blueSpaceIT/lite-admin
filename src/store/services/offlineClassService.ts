import { baseApi } from "../api/baseApi";

export const offlineClassService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createOfflineClass: builder.mutation({
            query: (data) => {
                return {
                    url: "/class",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["class"],
        }),
        getOfflineClasses: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/class",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["class"],
        }),
        getOfflineClass: builder.query({
            query: (id) => {
                return {
                    url: `/class/${id}`,
                    method: "GET",
                };
            },
        }),
        updateOfflineClass: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/class/${id}`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["class"],
        }),
        deleteOfflineClass: builder.mutation({
            query: (id) => {
                return {
                    url: `/class/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["class"],
        }),
    }),
});
