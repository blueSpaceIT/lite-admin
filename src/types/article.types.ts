import type { TAdmin } from "./admin.types";
import type { TArticleCategory } from "./articleCategory.types";

export type TArticle = {
    id: string;
    name: string;
    description: string;
    category: TArticleCategory;
    tags?: string[];
    featured: boolean;
    status: "Active" | "Inactive";
    image: string;
    author: TAdmin;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
