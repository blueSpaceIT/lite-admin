import z from "zod";

// signin validation
const signinValidationSchema = z.object({
    phone: z
        .string()
        .min(11, { message: "Phone must be 11 digit" })
        .max(11, { message: "Phone must be 11 digit" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 character" }),
});

// forget password validation
const forgetPasswordValidationSchema = z.object({
    phone: z
        .string()
        .min(11, { message: "Phone must be 11 digit" })
        .max(11, { message: "Phone must be 11 digit" }),
});

// reset password validation
const resetPasswordValidationSchema = z.object({
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 character" }),
});

export const AuthResolvers = {
    signinValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
};
