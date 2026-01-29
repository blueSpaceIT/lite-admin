import type { TAdmin, TAdminRole } from "../types";

export const accessPermission = (
    user: TAdmin | null,
    userRoles: TAdminRole[]
) => {
    if (user && userRoles && !userRoles.includes(user?.role)) {
        return false;
    }
    return true;
};
