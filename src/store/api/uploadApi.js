import { apiSlice } from "../../slice/baseUrl";

const createUploadMutation = (url, tag) => ({
  query: (data) => ({
    url,
    method: "POST",
    body: data,
  }),
  invalidatesTags: [tag],
});

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation(
      createUploadMutation("/images/upload", "image"),
    ),
    uploadPdf: builder.mutation(createUploadMutation("/pdf/upload", "pdf")),
  }),
  overrideExisting: false,
});

export const { useUploadImageMutation, useUploadPdfMutation } = uploadApi;
