import { baseApi } from "../api/baseApi";

export const examService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createExam: builder.mutation({
            query: (data) => {
                return {
                    url: "/course-contents/create-exam",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["exams", "courseContents"],
        }),
        getExams: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/course-contents/exams",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["exams", "courseContents"],
        }),
        getExam: builder.query({
            query: (id) => {
                return {
                    url: `/course-contents/exams/${id}`,
                    method: "GET",
                };
            },
        }),
        updateExam: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/course-contents/exams/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["exams", "courseContents"],
        }),
        deleteExam: builder.mutation({
            query: (id) => {
                return {
                    url: `/course-contents/exams/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["exams", "courseContents"],
        }),
    }),
});
