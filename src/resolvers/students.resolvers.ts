import z from "zod";

// guardian validation schema
const guardianValidationSchema = z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
});

// create student validation
const createStudentValidationSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    phone: z
        .string()
        .min(11, { message: "Phone must be 11 digit" })
        .max(11, { message: "Phone must be 11 digit" }),
    password: z.string().optional(),
});

// update student validation
const updateStudentValidationSchema = z.object({
    name: z.string().optional(),
    nid: z.string().optional(),
    address: z.string().optional(),
    guardian: guardianValidationSchema.optional(),
    school: z.string().optional(),
    college: z.string().optional(),
    status: z
        .enum(["Active", "Inactive"], { message: "Status is invalid" })
        .optional(),
    image: z.string().optional(),
});

// update student password validation
const updateStudentPasswordValidationSchema = z.object({
    oldPassword: z
        .string()
        .min(8, { message: "Old password must be at least 8 character" }),
    newPassword: z
        .string()
        .min(8, { message: "New password must be at least 8 character" }),
});

export const StudentResolvers = {
    createStudentValidationSchema,
    updateStudentValidationSchema,
    updateStudentPasswordValidationSchema,
};
