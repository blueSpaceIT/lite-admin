import z from "zod";

// create article validation
const createArticleValidationSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    description: z.string().min(1, { message: "Name cannot be empty" }),
    category: z.string().nullable(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    status: z
        .enum(["Active", "Inactive"], { message: "Status is invalid" })
        .optional(),
    image: z.string().min(1, { message: "Image cannot be empty" }),
    author: z.string().min(1, { message: "Author cannot be empty" }),
});

// update article validation
const updateArticleValidationSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    category: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    status: z
        .enum(["Active", "Inactive"], { message: "Status is invalid" })
        .optional(),
    image: z.string().optional(),
});

export const ArticleResolvers = {
    createArticleValidationSchema,
    updateArticleValidationSchema,
};
