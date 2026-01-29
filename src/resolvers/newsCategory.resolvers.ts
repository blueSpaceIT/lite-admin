import z from "zod";

// create news category validation
const createNewsCategoryValidationSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
});

// update news category validation
const updateNewsCategoryValidationSchema = z.object({
    name: z.string().optional(),
    status: z
        .enum(["Active", "Inactive"], { message: "Status is invalid" })
        .optional(),
});

export const NewsCategoryResolvers = {
    createNewsCategoryValidationSchema,
    updateNewsCategoryValidationSchema,
};
