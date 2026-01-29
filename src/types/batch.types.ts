import type { TBranch } from "./branch.types";
import type { TCourse } from "./course.types";

export type TBatch = {
    _id: string;
    id: string;
    name: string;
    course: TCourse;
    branch: TBranch;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
