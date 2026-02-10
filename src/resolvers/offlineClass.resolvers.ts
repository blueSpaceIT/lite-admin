import z from "zod";

const createOfflineClassValidationSchema = z.object({
    title: z.string().min(1, "Title cannot be empty"),
});

const updateOfflineClassValidationSchema = z.object({
    title: z.string().optional(),
});

export const OfflineClassResolvers = {
    createOfflineClassValidationSchema,
    updateOfflineClassValidationSchema,
};
