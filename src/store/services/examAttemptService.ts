import { baseApi } from "../api/baseApi";

export const examAttemptService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getExamAttempts: builder.query({
            query: (id) => {
                return {
                    url: `/exam-attempts/${id}/for-admin`,
                    method: "GET",
                };
            },
            providesTags: ["examAttempts"],
        }),
        getExamAttempt: builder.query({
            query: ({ userID, examID }) => {
                return {
                    url: `/exam-attempts/${userID}/${examID}`,
                    method: "GET",
                };
            },
        }),
        updateCQMark: builder.mutation({
            query: ({ userID, examID, data }) => {
                console.log("Payload in service:", { userID, examID, data });
                return {
                    url: `/exam-attempts/${userID}/${examID}/update-cq-mark`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["examAttempts"],
        }),
    }),
});
