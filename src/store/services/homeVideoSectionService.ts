import { baseApi } from "../api/baseApi";

export const homeVideoSectionService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createHomeVideoSection: builder.mutation({
            query: (data) => {
                return {
                    url: "/home-video-sections",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["home-video-sections"],
        }),
        getHomeVideoSections: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/home-video-sections",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["home-video-sections"],
        }),
        getSingleHomeVideoSection: builder.query({
            query: (id) => {
                return {
                    url: `/home-video-sections/${id}`,
                    method: "GET",
                };
            },
            providesTags: ["home-video-sections"],
        }),
        updateHomeVideoSection: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/home-video-sections/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["home-video-sections"],
        }),
        deleteHomeVideoSection: builder.mutation({
            query: (id) => {
                return {
                    url: `/home-video-sections/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["home-video-sections"],
        }),
    }),
});
