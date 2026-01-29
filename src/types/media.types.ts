import type { TAdmin } from "./admin.types";
import type { TStudent } from "./student.types";

export type TMedia = {
    id: string;
    admin?: TAdmin;
    student?: TStudent;
    url: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
