import type { TAdmin } from "./admin.types";
import type { TNewsCategory } from "./newsCategory.types";

export type TNews = {
    _id: string;
    id: string;
    name: string;
    description: string;
    category: TNewsCategory;
    tags?: string[];
    status: "Active" | "Inactive";
    image: string;
    author: TAdmin;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
