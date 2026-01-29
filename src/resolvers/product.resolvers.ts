import z from "zod";

const productDescriptionValidationSchema = z.object({
    key: z.string().min(1, "Key cannot be empty"),
    value: z.string().min(1, "Value cannot be empty"),
});

const createProductValidationSchema = z
    .object({
        name: z.string().min(1, "Name cannot be empty"),
        shortDescription: z.string().optional(),
        description: z.array(productDescriptionValidationSchema),
        category: z.string().nullable(),
        price: z.number().nonnegative(),
        offerPrice: z.number().nonnegative().optional(),
        stock: z.enum(["In stock", "Stock out"], {
            message: "Status is invalid",
        }),
        isBestSelling: z.boolean(),
        isPopular: z.boolean(),
        image: z.string().min(1, "Image cannot be empty"),
        fullPDF: z.string().optional(),
        shortPDF: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.offerPrice !== undefined &&
            data.offerPrice > 0 &&
            data.offerPrice >= data.price
        ) {
            ctx.addIssue({
                path: ["offerPrice"],
                code: z.ZodIssueCode.custom,
                message: "Offer price must be less than price",
            });
        }
    });

const updateProductValidationSchema = z
    .object({
        name: z.string().optional(),
        shortDescription: z.string().optional(),
        description: z.array(productDescriptionValidationSchema).optional(),
        category: z.string().nullable().optional(),
        price: z.number().nonnegative().optional(),
        offerPrice: z.number().nonnegative().optional(),
        stock: z
            .enum(["In stock", "Stock out"], {
                message: "Status is invalid",
            })
            .optional(),
        status: z.enum(["Active", "Inactive"]).optional(),
        isBestSelling: z.boolean().optional(),
        isPopular: z.boolean().optional(),
        image: z.string().optional(),
        fullPDF: z.string().optional(),
        shortPDF: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.price !== undefined &&
            data.offerPrice !== undefined &&
            data.offerPrice > 0 &&
            data.offerPrice >= data.price
        ) {
            ctx.addIssue({
                path: ["offerPrice"],
                code: z.ZodIssueCode.custom,
                message: "Offer price must be less than price",
            });
        }
    });

export const ProductResolvers = {
    createProductValidationSchema,
    updateProductValidationSchema,
};
