import { baseApi } from "../api/baseApi";

export const courseReviewService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCourseReviews: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/course-reviews",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["courseReviews"],
        }),
        getCourseReview: builder.query({
            query: (id) => {
                return {
                    url: `/course-reviews/${id}`,
                    method: "GET",
                };
            },
        }),
        updateCourseReview: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/course-reviews/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["courseReviews"],
        }),
        deleteCourseReview: builder.mutation({
            query: (id) => {
                return {
                    url: `/course-reviews/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["courseReviews"],
        }),
    }),
});
