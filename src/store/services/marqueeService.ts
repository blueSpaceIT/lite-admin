import { baseApi } from "../api/baseApi";

export const marqueeService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createMarquee: builder.mutation({
            query: (data) => {
                return {
                    url: "/marquee",
                    method: "POST",
                    body: data,
                };
            },
        }),
        getMarquee: builder.query({
            query: (id) => {
                return {
                    url: `/marquee/${id}`,
                    method: "GET",
                };
            },
        }),
    }),
});
