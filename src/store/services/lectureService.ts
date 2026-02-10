import { baseApi } from "../api/baseApi";

export const lectureService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =========================
       CHUNK UPLOAD (NEW)
    ========================= */

    uploadChunk: builder.mutation({
      query: ({ uploadId, chunkIndex, chunk }) => ({
        // ✅ use full local URL
        url: "https://api.liteedu.com/chunk-upload",
        method: "POST",
        body: chunk,
        headers: {
          uploadid: uploadId,
          chunkindex: String(chunkIndex),
          "content-type": "application/octet-stream",
        },
      }),
    }),

    finalizeUpload: builder.mutation({
      query: ({ uploadId, fileName }) => ({
        url: "https://api.liteedu.com/finalize-upload",
        method: "POST",
        body: { uploadId, fileName },
      }),
    }),

    /* =========================
       LECTURE CRUD (EXISTING)
    ========================= */

    createLecture: builder.mutation({
      query: (data) => ({
        url: "/course-contents/create-lecture",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["lectures", "courseContents"],
    }),

    getLectures: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data?.length > 0) {
          data.forEach((item: [string, string]) => {
            params.append(item[0], item[1]);
          });
        }
        return {
          url: "/course-contents/lectures",
          method: "GET",
          params,
        };
      },
      providesTags: ["lectures", "courseContents"],
    }),

    getLecture: builder.query({
      query: (id) => ({
        url: `/course-contents/lectures/${id}`,
        method: "GET",
      }),
    }),

    updateLecture: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/course-contents/lectures/${id}/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["lectures", "courseContents"],
    }),

    deleteLecture: builder.mutation({
      query: (id) => ({
        url: `/course-contents/lectures/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["lectures", "courseContents"],
    }),
  }),
});

/* =========================
   EXPORT HOOKS
========================= */

export const {
  useUploadChunkMutation,
  useFinalizeUploadMutation,
  useCreateLectureMutation,
  useGetLecturesQuery,
  useGetLectureQuery,
  useUpdateLectureMutation,
  useDeleteLectureMutation,
} = lectureService;
