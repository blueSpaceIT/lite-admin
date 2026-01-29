import type { ReactNode } from "react";
import { useAppSelector } from "../store/hook";
import { useCurrentUser } from "../store/slices/authSlice";
import { Navigate } from "react-router-dom";
import type { TAdminRole } from "../types";

type Props = {
    userRoles: TAdminRole[];
    children: ReactNode;
};

const ProtectedRoute = ({ userRoles, children }: Props) => {
    const user = useAppSelector(useCurrentUser);

    if (user && userRoles && !userRoles.includes(user?.role)) {
        return <Navigate to={"/forbidden"} />;
    }

    return children;
};

export default ProtectedRoute;
