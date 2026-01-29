import z from "zod";

// create product category validation
const createProductCategoryValidationSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
});

// update product category validation
const updateProductCategoryValidationSchema = z.object({
    name: z.string().optional(),
    status: z
        .enum(["Active", "Inactive"], { message: "Status is invalid" })
        .optional(),
});

export const ProductCategoryResolvers = {
    createProductCategoryValidationSchema,
    updateProductCategoryValidationSchema,
};
