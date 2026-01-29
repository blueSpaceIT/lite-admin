import { baseApi } from "../api/baseApi";

export const branchService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBranch: builder.mutation({
            query: (data) => {
                return {
                    url: "/branches",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["branches"],
        }),
        getBranches: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/branches",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["branches"],
        }),
        getBranch: builder.query({
            query: (id) => {
                return {
                    url: `/branches/${id}`,
                    method: "GET",
                };
            },
        }),
        updateBranch: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/branches/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["branches"],
        }),
        deleteBranch: builder.mutation({
            query: (id) => {
                return {
                    url: `/branches/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["branches"],
        }),
    }),
});
