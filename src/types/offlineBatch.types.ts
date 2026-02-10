import type { TOfflineClass } from "./offlineClass.types";

export type TOfflineBatch = {
    _id: string;
    title: string;
    classId: TOfflineClass;
    students: string[];
    isDeleted: boolean;
    deletedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
    slug?: string;
    __v?: number;
};
