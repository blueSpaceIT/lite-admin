import z from "zod";

// create module validation
const createModuleValidationSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    course: z.string(),
});

// update module validation
const updateModuleValidationSchema = z.object({
    name: z.string().optional(),
});

export const ModuleResolvers = {
    createModuleValidationSchema,
    updateModuleValidationSchema,
};
