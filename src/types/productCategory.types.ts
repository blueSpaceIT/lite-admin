export type TProductCategory = {
    _id: string;
    id: string;
    name: string;
    status: "Active" | "Inactive";
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
