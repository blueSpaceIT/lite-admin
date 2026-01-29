import type { TCourse } from "./course.types";
import type { TModule } from "./module.types";
import type { TQuestion } from "./question.types";

export type TLiveClass = {
    title: string;
    description?: string;
    joinURL: string;
    joinID?: string;
    passcode?: string;
    startTime: Date;
    endTime: Date;
};

export type TLecture = {
    title: string;
    server: "YouTube" | "Vimeo" | "Bunny";
    video: string;
    duration: {
        hours: number;
        minutes: number;
        seconds: number;
    };
    isFree: boolean;
    tags: string[];
};

export type TNote = {
    title: string;
    description?: string;
    pdfURL: string;
};

export type TExam = {
    title: string;
    description?: string;
    type: "MCQ" | "CQ" | "Gaps";
    totalQuestions: number;
    totalMarks: number;
    passingMarks: number;
    positiveMarks: number;
    negativeMarks: number;
    duration: {
        hours: number;
        minutes: number;
        seconds: number;
    };
    result: boolean;
    validity: Date;
    questions?: TQuestion[];
};

export type TCourseContent = {
    _id: string;
    id: string;
    course: TCourse;
    module: TModule;
    type: "Live Class" | "Lecture" | "Note" | "Exam";
    content: {
        liveClass?: TLiveClass;
        lecture?: TLecture;
        note?: TNote;
        exam?: TExam;
    };
    status: "Active" | "Inactive";
    scheduledAt?: Date;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
