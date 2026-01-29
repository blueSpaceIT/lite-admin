import type { TCoupon } from "./coupon.types";
import type { TProduct } from "./product.types";

export type TPaymentDetails = {
    method: "Cash" | "Bkash" | "Nagad" | "Rocket";
    amount: number;
    account?: string;
    trxID?: string;
    paidAt?: Date;
};

export type TOrderProduct = {
    product: TProduct;
    price: number;
    quantity: number;
};

export type TOrder = {
    id: string;
    name: string;
    phone: string;
    orderType: "hardcopy" | "ebook";
    address?: string;
    area?: "Dhaka" | "Dhaka Out" | "Office Pickup";
    status:
        | "Pending"
        | "On Hold"
        | "Accepted"
        | "Cancelled"
        | "Out for delivery"
        | "Delivered";
    payStatus: "Paid" | "Pending" | "Refunded";
    payMethod: "Cash On Delivery" | "Payment Gateway";
    subtotal: number;
    discount?: number;
    deliveryCharge?: number;
    totalAmount: number;
    paidAmount: number;
    products: TOrderProduct[];
    paymentDetails?: TPaymentDetails[];
    discountReason?: string;
    coupon?: TCoupon;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
