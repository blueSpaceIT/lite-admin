import { Tag } from "antd";
import categoryImg from "/category.png";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Table from "../../../components/common/Table/Table";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { FaCheck, FaLock } from "react-icons/fa6";
import { Button } from "@headlessui/react";
import type {
    TCourseCategory,
    TData,
    TError,
    TMeta,
    TTableData,
    TTableHeadingData,
} from "../../../types";
import { courseCategoryService } from "../../../store/services/courseCategoryService";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ActionBtns = ({ item }: { item: TCourseCategory }) => {
    const [updateCourseCategory] =
        courseCategoryService.useUpdateCourseCategoryMutation();
    const [deleteCourseCategory] =
        courseCategoryService.useDeleteCourseCategoryMutation();
    const updateStatusHandler = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to change status of ${item.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await updateCourseCategory({
                    id: item.id,
                    status: item.status === "Active" ? "Inactive" : "Active",
                });
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<TCourseCategory>) {
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
            text: `You want to delete ${item.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteCourseCategory(item.id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<TCourseCategory>) {
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
            <Link to={`/update-course-category/${item.id}`}>
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

const CourseCategories = () => {
    const [courseCategories, setCourseCategories] = useState<TCourseCategory[]>(
        []
    );
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isSuccess, isLoading, isFetching } =
        courseCategoryService.useGetCourseCategoriesQuery(
            searchParams ? [...searchParams] : undefined
        );

    useEffect(() => {
        if (isSuccess && data?.success) {
            setCourseCategories(data?.data?.result);
            setMeta(data?.data?.meta);
        }
    }, [isSuccess, data]);

    const tableHeadingData: TTableHeadingData = [
        "Image",
        "Name",
        "Status",
        "Action",
    ];
    const tableData: TTableData = [];
    courseCategories.forEach((item: TCourseCategory) =>
        tableData.push([
            <div className="flex justify-center items-center">
                <div className="size-10 rounded-lg overflow-hidden">
                    <img
                        src={item?.image || categoryImg}
                        alt=""
                        className="size-full object-cover object-center"
                    />
                </div>
            </div>,
            item?.name,
            item?.status === "Active" ? (
                <Tag color="green">{item?.status}</Tag>
            ) : (
                <Tag color="volcano">{item?.status}</Tag>
            ),
            <ActionBtns item={item} />,
        ])
    );

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Course Categories
                </h3>
            </TitleCard>

            <div className="flex justify-end mb-6">
                <Link to={"/create-course-category"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        Create Course Categories
                    </Button>
                </Link>
            </div>

            <Table
                title="Course Categories"
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={meta}
                loading={isFetching || isLoading}
                path="/course-categories"
                assets={true}
            />
        </div>
    );
};

export default CourseCategories;
