import z from "zod";

// create news validation
const createNewsValidationSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    description: z.string().min(1, { message: "Name cannot be empty" }),
    category: z.string().nullable(),
    tags: z.array(z.string()).optional(),
    status: z
        .enum(["Active", "Inactive"], { message: "Status is invalid" })
        .optional(),
    image: z.string().min(1, { message: "Image cannot be empty" }),
    author: z.string().min(1, { message: "Author cannot be empty" }),
});

// update news validation
const updateNewsValidationSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    category: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
    status: z
        .enum(["Active", "Inactive"], { message: "Status is invalid" })
        .optional(),
    image: z.string().optional(),
});

export const NewsResolvers = {
    createNewsValidationSchema,
    updateNewsValidationSchema,
};
