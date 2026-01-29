import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type {
    TCourseContent,
    TData,
    TError,
    TMeta,
    TModule,
    TTableData,
    TTableHeadingData,
} from "../../../types";
import { moduleService } from "../../../store/services/moduleService";
import { useError } from "../../../hooks";
import { courseContentService } from "../../../store/services/courseContentService";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Button } from "@headlessui/react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import Loader from "../../../components/common/Loader/Loader";
import Table from "../../../components/common/Table/Table";
import type { MenuProps } from "antd";
import { Dropdown, Tag } from "antd";
import { FaCheck, FaLock } from "react-icons/fa6";
import { MdLeaderboard } from "react-icons/md";

const ActionBtns = ({
    item,
    moduleID,
}: {
    item: TCourseContent;
    moduleID: string;
}) => {
    const [updateCourseContent] =
        courseContentService.useUpdateCourseContentMutation();
    const [deleteCourseContent] =
        courseContentService.useDeleteCourseContentMutation();

    const updateStatusHandler = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to change status of this ${item.type}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await updateCourseContent({
                    id: item.id,
                    status: item.status === "Active" ? "Inactive" : "Active",
                });
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<TCourseContent>) {
                    Swal.fire({
                        title: "Updated!",
                        text: "Item has been updated.",
                        icon: "success",
                    });
                }
            }
        });
    };

    const deleteStatusHandler = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete ${item.type}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteCourseContent(item.id);
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

    const to =
        item?.type === "Live Class"
            ? `/module/${moduleID}/update-live-class/${item.id}`
            : item?.type === "Lecture"
            ? `/module/${moduleID}/update-lecture/${item.id}`
            : item?.type === "Note"
            ? `/module/${moduleID}/update-note/${item.id}`
            : `/module/${moduleID}/update-exam/${item.id}`;

    return (
        <div className="flex justify-center items-center gap-3">
            {item?.type === "Exam" && (
                <Link to={`/result/${item.id}`}>
                    <Button className="text-pink-600 bg-pink-100 hover:bg-pink-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer">
                        <MdLeaderboard className="w-4 h-4" />
                    </Button>
                </Link>
            )}
            <Link to={to}>
                <Button className="text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer">
                    <FaRegEdit className="w-4 h-4" />
                </Button>
            </Link>
            <Button
                type="button"
                onClick={updateStatusHandler}
                className="text-lime-600 bg-lime-100 hover:bg-lime-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
            >
                {item.status === "Active" ? (
                    <FaLock className="w-4 h-4" />
                ) : (
                    <FaCheck className="w-4 h-4" />
                )}
            </Button>
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

const CreateCourseContentButton = ({ item }: { item: TModule }) => {
    const items: MenuProps["items"] = [
        {
            label: (
                <Link to={`/module/${item.id}/create-live-class`}>
                    Live Class
                </Link>
            ),
            key: "1",
        },
        {
            label: (
                <Link to={`/module/${item.id}/create-lecture`}>
                    Recorded Class
                </Link>
            ),
            key: "2",
        },
        {
            label: <Link to={`/module/${item.id}/create-note`}>Note</Link>,
            key: "3",
        },
        {
            label: <Link to={`/module/${item.id}/create-exam`}>Exam</Link>,
            key: "4",
        },
    ];

    const menuProps = {
        items,
    };

    return (
        <Dropdown.Button menu={menuProps} trigger={["click"]} className="w-max">
            Create
        </Dropdown.Button>
    );
};

const useContentTableData = (
    moduleID: string,
    courseContents: TCourseContent[]
) => {
    const tableData: TTableData = [];
    courseContents.forEach((item: TCourseContent) => {
        const name =
            item?.type === "Live Class"
                ? item.content.liveClass?.title
                : item?.type === "Lecture"
                ? item.content.lecture?.title
                : item?.type === "Note"
                ? item.content.note?.title
                : item.content.exam?.title;
        const urlType =
            item?.type === "Live Class"
                ? "live-class"
                : item?.type === "Lecture"
                ? "lecture"
                : item?.type === "Note"
                ? "note"
                : "exam";

        tableData.push([
            <Link to={`/${urlType}/${item.id}`}>{name}</Link>,
            item?.type === "Live Class" ? (
                <Tag color="magenta">{item?.type}</Tag>
            ) : item?.type === "Lecture" ? (
                <Tag color="green">{"Recorded Class"}</Tag>
            ) : item?.type === "Note" ? (
                <Tag color="blue">{item?.type}</Tag>
            ) : (
                <Tag color="volcano">{item?.type}</Tag>
            ),
            item?.status === "Active" ? (
                <Tag color="green">{item?.status}</Tag>
            ) : (
                <Tag color="volcano">{item?.status}</Tag>
            ),
            <ActionBtns item={item} moduleID={moduleID as string} />,
        ]);
    });
    return tableData;
};

const ModulesView = () => {
    const { moduleID } = useParams();
    const [module, setModule] = useState<TModule | null>(null);
    const [courseContents, setCourseContents] = useState<TCourseContent[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });

    const { data, isSuccess, isError, error } =
        moduleService.useGetModuleQuery(moduleID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setModule(data?.data);
        }
    }, [isSuccess, data]);

    const [searchParams, setSearchParams] = useSearchParams();
    const {
        data: courseContentsData,
        isSuccess: courseContentsSuccess,
        isLoading,
        isFetching,
    } = courseContentService.useGetCourseContentsQuery(
        searchParams
            ? [...searchParams, ["module", module?._id]]
            : [["course", module?._id]],
        { skip: !module?._id }
    );

    useEffect(() => {
        if (courseContentsSuccess && courseContentsData?.success) {
            setCourseContents(courseContentsData?.data?.result);
            setMeta(courseContentsData?.data?.meta);
        }
    }, [courseContentsSuccess, courseContentsData]);

    const tableHeadingData: TTableHeadingData = [
        "Name",
        "Type",
        "Status",
        "Action",
    ];
    const tableData: TTableData = useContentTableData(
        moduleID as string,
        courseContents
    );

    return (
        <div className="mb-10">
            {module ? (
                <div>
                    <div className="pb-4 border-b border-slate-400">
                        <div>
                            <h4 className="text-sm md:text-base font-semibold mb-2">
                                {module?.name} - {module?.course?.name}
                            </h4>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-2 my-6">
                        <CreateCourseContentButton item={module} />
                    </div>

                    <Table
                        title="Course Contents"
                        data={tableData}
                        headingData={tableHeadingData}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        meta={meta}
                        loading={isFetching || isLoading}
                        path={`/module/${moduleID}`}
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

export default ModulesView;
