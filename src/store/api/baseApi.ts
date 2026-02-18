import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { baseQueryWithRefreshToken } from "./customBaseQuery";

export const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set("authorization", `bearer ${token}`);
        }
        return headers;
    },
});

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithRefreshToken,
    tagTypes: [
        "accounts",
        "admins",
        "articles",
        "articleCategories",
        "batches",
        "branches",
        "courses",
        "coupons",
        "courseCategories",
        "courseContents",
        "courseReviews",
        "liveClasses",
        "lectures",
        "notes",
        "exams",
        "examAttempts",
        "media",
        "modules",
        "news",
        "newsCategories",
        "orders",
        "products",
        "productCategories",
        "due-purchases",
        "purchases",
        "questions",
        "questionStores",
        "sliders",
        "students",
        "tags",
        "class",
        "offline-batches",
        "offline-enrollments",
        "home-video-sections",
    ],
    endpoints: () => ({}),
});
