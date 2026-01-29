import { baseApi } from "../api/baseApi";

export const liveClassService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createLiveClass: builder.mutation({
            query: (data) => {
                return {
                    url: "/course-contents/create-live-class",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["liveClasses", "courseContents"],
        }),
        getLiveClasses: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/course-contents/live-classes",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["liveClasses", "courseContents"],
        }),
        getLiveClass: builder.query({
            query: (id) => {
                return {
                    url: `/course-contents/live-classes/${id}`,
                    method: "GET",
                };
            },
        }),
        updateLiveClass: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/course-contents/live-classes/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["liveClasses", "courseContents"],
        }),
        deleteLiveClass: builder.mutation({
            query: (id) => {
                return {
                    url: `/course-contents/live-classes/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["liveClasses", "courseContents"],
        }),
    }),
});
