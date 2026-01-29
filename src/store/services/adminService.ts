import { baseApi } from "../api/baseApi";

export const adminService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createAdmin: builder.mutation({
            query: (data) => {
                return {
                    url: "/admins",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["admins"],
        }),
        getAdmins: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/admins",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["admins"],
        }),
        getDeletedAdmins: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/admins/deleted-admins",
                    method: "GET",
                    params,
                };
            },
        }),
        getAdmin: builder.query({
            query: (id) => {
                return {
                    url: `/admins/${id}`,
                    method: "GET",
                };
            },
        }),
        updateAdmin: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/admins/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["admins"],
        }),
        updateAdminPassword: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/admins/${id}/update-password`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["admins"],
        }),
        deleteAdmin: builder.mutation({
            query: (id) => {
                return {
                    url: `/admins/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["admins"],
        }),
        deletePermanentAdmin: builder.mutation({
            query: (id) => {
                return {
                    url: `/admins/${id}/delete-permanent`,
                    method: "DELETE",
                };
            },
        }),
    }),
});
