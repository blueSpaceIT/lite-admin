import { baseApi } from "../api/baseApi";

export const courseContentService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCourseContents: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/course-contents",
                    method: "GET",
                    params,
                };
            },
            providesTags: [
                "courseContents",
                "liveClasses",
                "lectures",
                "notes",
                "exams",
            ],
        }),
        updateCourseContent: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/course-contents/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: [
                "courseContents",
                "liveClasses",
                "lectures",
                "notes",
                "exams",
            ],
        }),
        deleteCourseContent: builder.mutation({
            query: (id) => {
                return {
                    url: `/course-contents/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: [
                "courseContents",
                "liveClasses",
                "lectures",
                "notes",
                "exams",
            ],
        }),
    }),
});
