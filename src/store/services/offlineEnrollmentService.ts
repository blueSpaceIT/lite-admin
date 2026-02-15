import { baseApi } from "../api/baseApi";

export const offlineEnrollmentService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createOfflineEnrollment: builder.mutation({
            query: (data) => ({
                url: "/offline-enrollments/create-enrollment",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["offline-enrollments"],
        }),
        getOfflineEnrollments: builder.query({
            query: (params) => ({
                url: "/offline-enrollments",
                method: "GET",
                params,
            }),
            providesTags: ["offline-enrollments"],
        }),
        getOfflineEnrollment: builder.query({
            query: (id) => ({
                url: `/offline-enrollments/${id}`,
                method: "GET",
            }),
            providesTags: ["offline-enrollments"],
        }),
        updateOfflineEnrollment: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/offline-enrollments/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["offline-enrollments"],
        }),
        deleteOfflineEnrollment: builder.mutation({
            query: (id) => ({
                url: `/offline-enrollments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["offline-enrollments"],
        }),
        addOfflinePayment: builder.mutation({
            query: (data) => ({
                url: "/offline-enrollments/add-payment",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["offline-enrollments"],
        }),
        getOfflineFinancialSummary: builder.query({
            query: () => ({
                url: "/offline-enrollments/financial-summary",
                method: "GET",
            }),
            providesTags: ["offline-enrollments"],
        }),
        getMonthlyOfflineFinancialSummary: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.month) {
                    queryParams.append("month", params.month);
                }
                if (params?.year) {
                    queryParams.append("year", params.year);
                }
                return {
                    url: "/offline-enrollments/financial-summary-monthly",
                    method: "GET",
                    params: queryParams,
                };
            },
            providesTags: ["offline-enrollments"],
        }),
        getOfflineReports: builder.query({
            query: () => ({
                url: "/offline-enrollments/reports",
                method: "GET",
            }),
            providesTags: ["offline-enrollments"],
        }),
    }),
});

export const {
    useCreateOfflineEnrollmentMutation,
    useGetOfflineEnrollmentsQuery,
    useGetOfflineEnrollmentQuery,
    useUpdateOfflineEnrollmentMutation,
    useDeleteOfflineEnrollmentMutation,
    useAddOfflinePaymentMutation,
    useGetOfflineFinancialSummaryQuery,
    useGetMonthlyOfflineFinancialSummaryQuery,
    useGetOfflineReportsQuery,
} = offlineEnrollmentService;
