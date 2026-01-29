import z from "zod";

// order product validation
const orderProductValidationSchema = z.object({
    product: z.string(),
    price: z.number(),
    quantity: z.number(),
});

// payment details validation
const paymentDetailsValidationSchema = z.object({
    method: z.enum(["Cash", "Bkash", "Nagad", "Rocket"], {
        message: "Method is invalid",
    }),
    amount: z.number(),
    account: z.string().optional(),
    trxID: z.string().optional(),
});

// create order validation
const createOrderValidationSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    phone: z
        .string()
        .min(11, { message: "Phone should be 11 digit" })
        .max(11, { message: "Phone should be 11 digit" }),
    orderType: z.enum(["hardcopy", "ebook"], {
        message: "Order type is invalid",
    }),
    address: z.string().optional(),
    area: z
        .enum(["Dhaka", "Dhaka Out", "Office Pickup"], {
            message: "Area is invalid",
        })
        .optional(),
    payMethod: z.enum(["Cash On Delivery", "Payment Gateway"], {
        message: "Pay method is invalid",
    }),
    discount: z.number().optional(),
    coupon: z.string().optional(),
    discountReason: z.string().optional(),
    products: z.array(orderProductValidationSchema),
});

// update order validation
const updateOrderValidationSchema = z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
    area: z
        .enum(["Dhaka", "Dhaka Out", "Office Pickup"], {
            message: "Area is invalid",
        })
        .optional(),
    status: z
        .enum(
            [
                "Pending",
                "On Hold",
                "Accepted",
                "Cancelled",
                "Out for delivery",
                "Delivered",
            ],
            { message: "Status is invalid" }
        )
        .optional(),
    payStatus: z
        .enum(["Paid", "Pending", "Refunded"], {
            message: "Pay status is invalid",
        })
        .optional(),
    paymentDetails: z.array(paymentDetailsValidationSchema).optional(),
});

export const OrderResolvers = {
    createOrderValidationSchema,
    updateOrderValidationSchema,
};
