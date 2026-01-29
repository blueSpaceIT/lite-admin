export type TGuardian = {
    name?: string;
    phone?: string;
};

export type TStudent = {
    _id: string;
    id: string;
    name: string;
    phone: string;
    password: string;
    otp: string;
    nid?: string;
    address?: string;
    guardian?: TGuardian;
    school?: string;
    college?: string;
    role: "student";
    status: "Active" | "Inactive";
    image?: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
