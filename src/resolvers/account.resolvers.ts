import z from "zod";

const createAccountValidationSchema = z.object({
    type: z.enum(["Earning", "Expense"]),
    reason: z.array(z.string()).nullable(),
    method: z.enum(["Cash", "SSLCommerz", "Bank", "Bkash", "Nagad", "Rocket"]),
    amount: z.number(),
    branch: z.string(),
});

const updateAccountValidationSchema = z.object({
    type: z.enum(["Earning", "Expense"]).optional(),
    reason: z.array(z.string()).optional(),
    method: z
        .enum(["Cash", "SSLCommerz", "Bank", "Bkash", "Nagad", "Rocket"])
        .optional(),
    amount: z.number().optional(),
    branch: z.string().optional(),
});

export const AccountResolvers = {
    createAccountValidationSchema,
    updateAccountValidationSchema,
};
