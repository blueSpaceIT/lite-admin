import type { TAdmin } from "./admin.types";
import type { TTag } from "./tag.types";

export interface IBaseQuestion {
    _id: string;
    id: string;
    question: string;
    explaination?: string;
    tags?: TTag[];
    createdBy: TAdmin;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IQuestionMCQ extends IBaseQuestion {
    type: "MCQ";
    options: string[];
    answer: string;
}

export interface IQuestionCQ extends IBaseQuestion {
    type: "CQ";
    answer: string;
}

export interface IQuestionGaps extends IBaseQuestion {
    type: "GAPS";
    answer: string[];
}

export type TQuestion = IQuestionMCQ | IQuestionCQ | IQuestionGaps;
