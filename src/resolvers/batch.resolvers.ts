import z from "zod";

const createBatchValidationSchema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    course: z.string(),
    branch: z.string().nullable(),
});

const updateBatchValidationSchema = z.object({
    name: z.string().optional(),
    branch: z.string().nullable().optional(),
});

export const BatchResolvers = {
    createBatchValidationSchema,
    updateBatchValidationSchema,
};
