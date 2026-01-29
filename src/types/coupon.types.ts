export type TCoupon = {
    _id: string;
    id: string;
    name: string;
    discount: {
        type: "Fixed" | "Percentage";
        amount: number;
    };
    issuedAt: Date;
    expiredAt: Date;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
