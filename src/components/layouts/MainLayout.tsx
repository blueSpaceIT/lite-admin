import { Link, Navigate, Outlet } from "react-router-dom";
import profileImg from "/profile.png";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
    signout,
    useCurrentToken,
    useCurrentUser,
} from "../../store/slices/authSlice";
import { Toaster } from "react-hot-toast";
import { FaHome } from "react-icons/fa";
import { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

const SignoutModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();
    const signoutHandler = () => {
        setIsOpen(false);
        dispatch(signout());
    };

    return (
        <div>
            <Button
                onClick={() => setIsOpen(true)}
                className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer"
            >
                Signout
            </Button>

            <Dialog
                open={isOpen}
                as="div"
                className="relative z-40 focus:outline-none"
                onClose={() => setIsOpen(false)}
            >
                <div className="fixed inset-0 z-50 w-screen bg-black/40 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle
                                as="h3"
                                className="text-base/7 font-medium text-rose-600"
                            >
                                Signout Modal
                            </DialogTitle>
                            <p className="mt-2 text-sm/6 text-slate-800">
                                Are you sure you want to signout?
                            </p>
                            <div className="flex justify-end items-center gap-2 mt-4">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-slate-200 px-3 py-1.5 text-sm/6 font-semibold text-slate-700 shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white cursor-pointer"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-rose-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white cursor-pointer"
                                    onClick={signoutHandler}
                                >
                                    Signout!
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

const MainLayout = () => {
    const user = useAppSelector(useCurrentUser);
    const token = useAppSelector(useCurrentToken);
    if (!token) {
        return <Navigate to={"/auth/signin"} replace={true} />;
    }

    return (
        <div className="max-w-[1440px] 2xl:w-full 2xl:mx-auto mx-5">
            <Toaster />

            <div className="flex justify-between items-center py-2 mb-8">
                <Link to={"/"}>
                    <Button className="w-8 h-8 flex justify-center items-center border-2 border-slate-950 rounded-full cursor-pointer">
                        <FaHome />
                    </Button>
                </Link>

                <div className="w-max flex justify-end items-center gap-2">
                    <Link to={"/settings"}>
                        <div className="max-w-10 w-full h-10 overflow-hidden rounded-full">
                            <img
                                src={user?.image || profileImg}
                                alt=""
                                className="w-full h-full object-center object-cover"
                            />
                        </div>
                    </Link>

                    <SignoutModal />
                </div>
            </div>

            <div className="w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
