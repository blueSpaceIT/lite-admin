import type { TCourse } from "./course.types";
import type { TCourseContent } from "./courseContent.types";
import type { TQuestion } from "./question.types";
import type { TStudent } from "./student.types";

export type TAnswer = {
    question: TQuestion;
    answer: string;
    mark?: number;
};

export type TCQAnswer = {
    question: TQuestion;
    answer: string[];
    mark?: number;
};

export type TExamAttempt = {
    _id: string;
    course: TCourse;
    exam: TCourseContent;
    student: TStudent;
    type: "MCQ" | "CQ" | "GAP";
    answers?: TAnswer[] | TCQAnswer[];
    right?: number;
    wrong?: number;
    totalMarks: number;
    obtainedMarks: number;
    isChecked: boolean;
    isPassed: boolean;
    isLive: boolean;
    startTime: Date;
    endTime: Date;
    submitTime: Date;
    createdAt?: Date;
    updatedAt?: Date;
};
