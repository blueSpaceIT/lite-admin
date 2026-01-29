import { Link } from "react-router-dom";
import { USER_ROLES } from "../../../constants";
import { accessPermission } from "../../../hooks";
import { useAppSelector } from "../../../store/hook";
import { useCurrentUser } from "../../../store/slices/authSlice";
import { Button } from "antd";

const questionBankWidget = [
    {
        create: {
            title: "MCQ Create",
            destination: "/create-mcq",
        },
        read: {
            title: "MCQ Bank",
            destination: "/questions/MCQ",
        },
        permission: [
            USER_ROLES.superAdmin,
            USER_ROLES.admin,
            USER_ROLES.moderator,
            USER_ROLES.teacher,
        ],
    },
    {
        create: {
            title: "CQ Create",
            destination: "/create-cq",
        },
        read: {
            title: "CQ Bank",
            destination: "/questions/CQ",
        },
        permission: [
            USER_ROLES.superAdmin,
            USER_ROLES.admin,
            USER_ROLES.moderator,
            USER_ROLES.teacher,
        ],
    },
    {
        create: {
            title: "GAPS Create",
            destination: "/create-gaps",
        },
        read: {
            title: "GAPS Bank",
            destination: "/questions/GAPS",
        },
        permission: [
            USER_ROLES.superAdmin,
            USER_ROLES.admin,
            USER_ROLES.moderator,
            USER_ROLES.teacher,
        ],
    },
];

const QuestionBank = () => {
    const user = useAppSelector(useCurrentUser);

    return (
        <div className="max-w-[600px] md:w-full md:mx-auto mb-10">
            <div className="flex justify-end items-center gap-2 mb-6">
                <Link to={"/tags"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        Tags
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {questionBankWidget.map((item, index) => {
                    if (accessPermission(user, item.permission)) {
                        return (
                            <div key={index} className="grid gap-2 mb-10">
                                <Link
                                    to={item.create.destination}
                                    className="bg-cyan-100 font-medium text-center px-3 py-6 rounded-xl"
                                >
                                    <p className="text-xs md:text-sm lg:text-lg">
                                        {item.create.title}
                                    </p>
                                </Link>
                                <Link
                                    to={item.read.destination}
                                    className="bg-purple-100 font-medium text-center px-3 py-6 rounded-xl"
                                >
                                    <p className="text-xs md:text-sm lg:text-lg">
                                        {item.read.title}
                                    </p>
                                </Link>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default QuestionBank;
