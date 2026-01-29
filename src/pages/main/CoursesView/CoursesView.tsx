import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type {
    TCourse,
    TData,
    TError,
    TMeta,
    TModule,
    TTableData,
    TTableHeadingData,
} from "../../../types";
import { courseService } from "../../../store/services/courseService";
import { useError } from "../../../hooks";
import { Tag } from "antd";
import { Button } from "@headlessui/react";
import { FaTrashAlt } from "react-icons/fa";
import { moduleService } from "../../../store/services/moduleService";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Table from "../../../components/common/Table/Table";
import Loader from "../../../components/common/Loader/Loader";
import ModuleCreateModal from "./components/ModuleCreateModal";
import ModuleUpdateModal from "./components/ModuleUpdateModal";
import CourseDetailsUpdateModal from "./components/CourseDetailsUpdateModal";
import CourseBatch from "./components/CourseBatch";

const ActionBtns = ({ item }: { item: TModule }) => {
    const [deleteModule] = moduleService.useDeleteModuleMutation();

    const deleteStatusHandler = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete ${item.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteModule(item.id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<TModule>) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Item has been deleted.",
                        icon: "success",
                    });
                }
            }
        });
    };

    return (
        <div className="flex justify-center items-center gap-3">
            <ModuleUpdateModal module={item} />

            <Button
                type="button"
                onClick={deleteStatusHandler}
                className="text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
            >
                <FaTrashAlt className="w-4 h-4" />
            </Button>
        </div>
    );
};

const CoursesView = () => {
    const { courseID } = useParams();
    const [course, setCourse] = useState<TCourse | null>(null);
    const [modules, setModules] = useState<TModule[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });

    const { data, isSuccess, isError, error } =
        courseService.useGetCourseQuery(courseID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setCourse(data?.data);
        }
    }, [isSuccess, data]);

    const [searchParams, setSearchParams] = useSearchParams();
    const {
        data: modulesData,
        isSuccess: modulesSuccess,
        isLoading,
        isFetching,
    } = moduleService.useGetModulesQuery(
        searchParams
            ? [...searchParams, ["course", course?._id]]
            : [["course", course?._id]],
        { skip: !course?._id }
    );

    useEffect(() => {
        if (modulesSuccess && modulesData?.success) {
            setModules(modulesData?.data?.result);
            setMeta(modulesData?.data?.meta);
        }
    }, [modulesSuccess, modulesData]);

    const tableHeadingData: TTableHeadingData = ["Name", "Action"];
    const tableData: TTableData = [];
    modules.forEach((item: TModule) =>
        tableData.push([
            <Link to={`/module/${item.id}`}>{item?.name}</Link>,
            <ActionBtns item={item} />,
        ])
    );

    return (
        <div className="mb-10">
            {course ? (
                <div>
                    <div className="flex items-start gap-3 pb-4 border-b border-slate-400">
                        <div className="w-28 md:w-40 rounded-xl overflow-hidden">
                            <img src={course?.image} alt="" />
                        </div>
                        <div>
                            <h4 className="text-sm md:text-base font-semibold mb-2">
                                {course?.name}
                            </h4>
                            <div className="flex mb-2">
                                <Tag
                                    color={`${
                                        course?.type === "Online"
                                            ? "cyan"
                                            : "magenta"
                                    }`}
                                    className="text-xs"
                                >
                                    {course?.type}
                                </Tag>
                                <Tag
                                    color={`${
                                        course?.status === "Active"
                                            ? "lime"
                                            : "volcano"
                                    }`}
                                    className="text-xs ml-2"
                                >
                                    {course?.status}
                                </Tag>
                            </div>
                            <div className="flex items-center gap-2 text-xs md:text-sm">
                                {course?.price === 0 ? (
                                    <span className="text-xs text-lime-500">
                                        Free
                                    </span>
                                ) : course?.offerPrice !== 0 ? (
                                    <div className="flex items-center gap-1">
                                        <span className="text-red-500 line-through">
                                            BDT {course?.price}/-
                                        </span>
                                        <span className="text-slate-600 font-semibold">
                                            BDT {course?.offerPrice}/-
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-slate-600 font-semibold">
                                        BDT {course?.price}/-
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-2 mt-6 mb-2">
                        <Link to={`/courses/${courseID}/reviews`}>
                            <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                                Course Reviews
                            </Button>
                        </Link>
                        <CourseDetailsUpdateModal course={course} />
                    </div>

                    {course?.details && (
                        <div className="flex flex-wrap justify-start items-center gap-2 mb-6 pb-5 border-b border-slate-400">
                            <p>C: {course?.details?.totalClasses || 0} |</p>
                            <p>
                                LC: {course?.details?.totalLiveClasses || 0} |
                            </p>
                            <p>L: {course?.details?.totalLectures || 0} |</p>
                            <p>N: {course?.details?.totalNotes || 0} |</p>
                            <p>E: {course?.details?.totalExams || 0}</p>
                        </div>
                    )}

                    {course.type === "Offline" && (
                        <CourseBatch course={course} />
                    )}

                    <div className="flex justify-end items-center gap-2 my-6">
                        <ModuleCreateModal courseID={course?.id} />
                    </div>

                    <Table
                        title="Modules"
                        data={tableData}
                        headingData={tableHeadingData}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        meta={meta}
                        loading={isFetching || isLoading}
                        path={`/course/${courseID}`}
                    />
                </div>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default CoursesView;
