import { baseApi } from "../api/baseApi";

export const sliderService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSliderGallery: builder.mutation({
            query: (data) => {
                return {
                    url: "/sliders/create-gallery",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["sliders"],
        }),
        createSlider: builder.mutation({
            query: (data) => {
                return {
                    url: "/sliders/create-slider",
                    method: "POST",
                    body: data,
                };
            },
        }),
        getSliderGalleries: builder.query({
            query: (data) => {
                const params = new URLSearchParams();
                if (data?.length > 0) {
                    data.forEach((item: [string, string]) => {
                        params.append(item[0], item[1]);
                    });
                }

                return {
                    url: "/sliders",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["sliders"],
        }),
        getSlider: builder.query({
            query: (id) => {
                return {
                    url: `/sliders/${id}`,
                    method: "GET",
                };
            },
        }),
        updateSliderGallery: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/sliders/${id}/update`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["sliders"],
        }),
        deleteSliderGallery: builder.mutation({
            query: (id) => {
                return {
                    url: `/sliders/${id}/delete`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["sliders"],
        }),
    }),
});
