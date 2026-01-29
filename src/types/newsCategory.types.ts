export type TNewsCategory = {
    _id: string;
    id: string;
    name: string;
    status: "Active" | "Inactive";
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
