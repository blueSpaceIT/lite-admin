export type TBranch = {
    _id: string;
    id: string;
    name: string;
    code: string;
    address: string;
    mapURL?: string;
    status: "Active" | "Inactive";
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
