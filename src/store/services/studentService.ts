import { baseApi } from "../api/baseApi";

export const studentService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createStudent: builder.mutation({
            query: (data) => {
                return {
                    url: "/students",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["students"],
        }),
        upsertStudent: builder.mutation({
            query: (data) => {
                return {
                    url: "/students",
                    method: "PUT",
                    body: data,
                };
            },
            invalidatesTags: ["students"],
        }),
        getStudents: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/students",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["students"],
        }),
        getStudent: builder.query({
            query: (id) => {
                return {
                    url: `/students/${id}`,
                    method: "GET",
                };
            },
        }),
        updateStudent: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/students/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["students"],
        }),
        updateStudentPassword: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/students/${id}/update-password`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["students"],
        }),
        deleteStudent: builder.mutation({
            query: (id) => {
                return {
                    url: `/students/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["students"],
        }),
    }),
});
