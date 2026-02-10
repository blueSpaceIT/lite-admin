import z from "zod";

const createOfflineBatchValidationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    classId: z.string().min(1, "Class is required"),
});

const updateOfflineBatchValidationSchema = z.object({
    title: z.string().optional(),
    classId: z.string().optional(),
});

export const OfflineBatchResolvers = {
    createOfflineBatchValidationSchema,
    updateOfflineBatchValidationSchema,
};
