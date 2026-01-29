import z from "zod";

// payment details validation
const paymentDetailsValidationSchema = z.object({
    method: z.enum(["Cash", "Bkash", "Nagad", "Rocket"], {
        message: "Method is invalid",
    }),
    amount: z.number(),
    account: z.string().optional(),
    trxID: z.string().optional(),
});

// create purchase validation
const createPurchaseValidationSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    phone: z
        .string()
        .min(11, { message: "Phone should be 11 digit" })
        .max(11, { message: "Phone should be 11 digit" }),
    course: z.string().nullable(),
    batch: z.string().nullable().optional(),
    price: z.number(),
    coupon: z.string().optional(),
    discountReason: z.string().optional(),
    discount: z.number().optional(),
    branch: z.string().nullable(),
    dueDate: z.iso.datetime({ offset: true }).nullable().optional(),
    status: z
        .enum(["Active", "Pending", "Course Out"], {
            message: "Status is invalid",
        })
        .optional(),
    paymentDetails: z.array(paymentDetailsValidationSchema).optional(),
});

// update purchase validation
const updatePurchaseValidationSchema = z.object({
    paymentDetails: paymentDetailsValidationSchema.optional(),
    dueDate: z.iso.datetime({ offset: true }).nullable().optional(),
});

export const PurchaseResolvers = {
    createPurchaseValidationSchema,
    updatePurchaseValidationSchema,
};
