import type { TBatch } from "./batch.types";
import type { TBranch } from "./branch.types";
import type { TCoupon } from "./coupon.types";
import type { TCourse } from "./course.types";
import type { TPaymentDetails } from "./order.types";
import type { TStudent } from "./student.types";

export type TPurchase = {
    _id: string;
    id: string;
    student: TStudent;
    course: TCourse;
    batch?: TBatch;
    branch: TBranch;
    status: "Active" | "Pending" | "Course Out";
    payStatus: "Paid" | "Pending" | "Partial" | "Refunded";
    price: number;
    subtotal: number;
    discount: number;
    totalAmount: number;
    paidAmount: number;
    dueDate?: Date;
    paymentDetails?: TPaymentDetails[];
    discountReason?: string;
    coupon?: TCoupon;
    expiredAt: Date;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TCreatePurchase = {
    name: string;
    phone: string;
    course: string;
    batch: string;
    branch: string;
    price: number;
    coupon?: string;
    discountReason?: string;
    discount?: number;
    status?: "Active" | "Pending" | "Course Out";
    paymentDetails?: TPaymentDetails[];
    dueDate?: Date;
};
