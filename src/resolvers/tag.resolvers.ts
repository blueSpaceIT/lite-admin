import z from "zod";

const createTagValidationSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
});

const updateTagValidationSchema = z.object({
    name: z.string().optional(),
});

export const TagResolvers = {
    createTagValidationSchema,
    updateTagValidationSchema,
};
