import type { TCourse } from "./course.types";
import type { TStudent } from "./student.types";

export type TCourseReview = {
    _id: string;
    id: string;
    course: TCourse;
    student: TStudent;
    status: "Approved" | "Pending" | "Rejected";
    rating: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
};
