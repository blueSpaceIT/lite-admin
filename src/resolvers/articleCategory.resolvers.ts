import z from "zod";

// create article category validation
const createArticleCategoryValidationSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    description: z.string().min(1, { message: "Description cannot be empty" }),
    image: z.string().optional(),
});

// update article category validation
const updateArticleCategoryValidationSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    status: z
        .enum(["Active", "Inactive"], { message: "Status is invalid" })
        .optional(),
    image: z.string().optional(),
});

export const ArticleCategoryResolvers = {
    createArticleCategoryValidationSchema,
    updateArticleCategoryValidationSchema,
};
