import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import { useCurrentToken } from "../../store/slices/authSlice";
import { Toaster } from "react-hot-toast";

const AuthLayout = () => {
    const token = useAppSelector(useCurrentToken);
    if (token) {
        return <Navigate to={"/"} replace={true} />;
    }

    return (
        <div className="max-w-[400px] md:w-full min-h-dvh flex justify-center items-center mx-5 md:mx-auto">
            <Toaster />

            <div className="w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
