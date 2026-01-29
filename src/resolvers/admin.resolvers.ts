import z from "zod";
import { USER_ROLES_ARRAY } from "../constants";

// create admin validation
const createAdminValidationSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    phone: z
        .string()
        .min(11, { message: "Phone must be 11 digit" })
        .max(11, { message: "Phone must be 11 digit" }),
    password: z.string().optional(),
    branch: z.string().nullable().optional(),
    designation: z.string().min(1, { message: "Designation cannot be empty" }),
    nid: z.string().optional(),
    address: z.string().optional(),
    role: z.enum([...USER_ROLES_ARRAY], { message: "Role is invalid" }),
    image: z.string().optional(),
});

// update admin validation
const updateAdminValidationSchema = z.object({
    name: z.string().optional(),
    branch: z.string().nullable().optional(),
    designation: z.string().optional(),
    quote: z.string().optional(),
    nid: z.string().optional(),
    address: z.string().optional(),
    role: z
        .enum([...USER_ROLES_ARRAY], { message: "Role is invalid" })
        .optional(),
    status: z
        .enum(["Active", "Inactive"], { message: "Status is invalid" })
        .optional(),
    image: z.string().optional(),
});

// update admin password validation
const updateAdminPasswordValidationSchema = z.object({
    oldPassword: z
        .string()
        .min(8, { message: "Old password must be at least 8 character" }),
    newPassword: z
        .string()
        .min(8, { message: "New password must be at least 8 character" }),
});

export const AdminResolvers = {
    createAdminValidationSchema,
    updateAdminValidationSchema,
    updateAdminPasswordValidationSchema,
};
