import type { TProductCategory } from "./productCategory.types";

export type TProductDescription = {
    key: string;
    value: string;
};

export type TProduct = {
    id: string;
    name: string;
    shortDescription?: string;
    description: TProductDescription[];
    category: TProductCategory;
    price: number;
    offerPrice?: number;
    stock: "In stock" | "Stock out";
    status: "Active" | "Inactive";
    isBestSelling: boolean;
    isPopular: boolean;
    image: string;
    fullPDF?: string;
    shortPDF?: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
