import { baseApi } from "../api/baseApi";

export const courseService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: (data) => {
                return {
                    url: "/courses",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["courses"],
        }),
        getCourses: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/courses",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["courses"],
        }),
        getCourse: builder.query({
            query: (id) => {
                return {
                    url: `/courses/${id}`,
                    method: "GET",
                };
            },
        }),
        updateCourse: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/courses/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["courses"],
        }),
        updateCourseDetails: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/courses/${id}/update-details`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["courses"],
        }),
        deleteCourse: builder.mutation({
            query: (id) => {
                return {
                    url: `/courses/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["courses"],
        }),
    }),
});
