import type { TCourse } from "./course.types";

export type TModule = {
    _id: string;
    id: string;
    name: string;
    course: TCourse;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
