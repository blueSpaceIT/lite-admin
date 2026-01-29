import type { TAdmin } from "./admin.types";
import type { TCourseCategory } from "./courseCategory.types";

export type TCourseDetails = {
    totalClasses?: number;
    totalLiveClasses?: number;
    totalLectures?: number;
    totalNotes?: number;
    totalExams?: number;
};

export type TCourse = {
    _id: string;
    id: string;
    name: string;
    code: string;
    typeCode: string;
    shortDescription?: string;
    description: string;
    type: "Online" | "Offline";
    category: TCourseCategory;
    teachers: TAdmin[];
    price: number;
    offerPrice?: number;
    details?: TCourseDetails;
    status: "Active" | "Inactive";
    trailer?: string;
    duration: [string, string];
    expiredTime: [number, string];
    reviewed: boolean;
    routine?: string;
    routinePDF?: string;
    image: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
