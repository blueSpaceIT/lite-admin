import { USER_ROLES } from "../constants";
import type { TBranch } from "./branch.types";

export type TAdminRole = keyof typeof USER_ROLES;

export type TAdmin = {
    _id: string;
    id: string;
    name: string;
    phone: string;
    password: string;
    otp: string;
    branch?: TBranch;
    designation: string;
    quote?: string;
    nid?: string;
    address?: string;
    role: TAdminRole;
    status: "Active" | "Inactive";
    image?: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
