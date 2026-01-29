import { baseApi } from "../api/baseApi";

export const noteService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createNote: builder.mutation({
            query: (data) => {
                return {
                    url: "/course-contents/create-note",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["notes", "courseContents"],
        }),
        getNotes: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/course-contents/notes",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["notes", "courseContents"],
        }),
        getNote: builder.query({
            query: (id) => {
                return {
                    url: `/course-contents/notes/${id}`,
                    method: "GET",
                };
            },
        }),
        updateNote: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/course-contents/notes/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["notes", "courseContents"],
        }),
        deleteNote: builder.mutation({
            query: (id) => {
                return {
                    url: `/course-contents/notes/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["notes", "courseContents"],
        }),
    }),
});
