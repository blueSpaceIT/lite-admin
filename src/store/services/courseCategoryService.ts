import { baseApi } from "../api/baseApi";

export const courseCategoryService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCourseCategory: builder.mutation({
            query: (data) => {
                return {
                    url: "/course-categories",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["courseCategories"],
        }),
        getCourseCategories: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/course-categories",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["courseCategories"],
        }),
        getCourseCategory: builder.query({
            query: (id) => {
                return {
                    url: `/course-categories/${id}`,
                    method: "GET",
                };
            },
        }),
        updateCourseCategory: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/course-categories/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["courseCategories"],
        }),
        deleteCourseCategory: builder.mutation({
            query: (id) => {
                return {
                    url: `/course-categories/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["courseCategories"],
        }),
    }),
});
