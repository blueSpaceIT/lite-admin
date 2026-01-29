import z from "zod";

// create course category validation
const createCourseCategoryValidationSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    image: z.string().optional(),
});

// update course category validation
const updateCourseCategoryValidationSchema = z.object({
    name: z.string().optional(),
    status: z
        .enum(["Active", "Inactive"], { message: "Status is invalid" })
        .optional(),
    image: z.string().optional(),
});

export const CourseCategoryResolvers = {
    createCourseCategoryValidationSchema,
    updateCourseCategoryValidationSchema,
};
