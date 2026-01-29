import z from "zod";

const discountValidationSchema = z.object({
    type: z.enum(["Fixed", "Percentage"], { message: "Type is invalid" }),
    amount: z.number().nonnegative(),
});

// create coupon validation
const createCouponValidationSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    discount: discountValidationSchema,
    issuedAt: z.iso.datetime({ offset: true }),
    expiredAt: z.iso.datetime({ offset: true }),
});

// update coupon validation
const updateCouponValidationSchema = z.object({
    name: z.string().optional(),
    discount: discountValidationSchema.optional(),
    issuedAt: z.iso.datetime({ offset: true }).nullable().optional(),
    expiredAt: z.iso.datetime({ offset: true }).nullable().optional(),
});

export const CouponResolvers = {
    createCouponValidationSchema,
    updateCouponValidationSchema,
};
