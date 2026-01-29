import type { TBranch } from "./branch.types";

export type TMethod =
    | "Cash"
    | "SSLCommerz"
    | "Bank"
    | "Bkash"
    | "Nagad"
    | "Rocket";

export type TAccount = {
    _id: string;
    id: string;
    type: "Earning" | "Expense";
    reason: string[];
    method: TMethod;
    amount: number;
    branch: TBranch;
    createdAt?: Date;
    updatedAt?: Date;
};
