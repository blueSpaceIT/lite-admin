import { useEffect, useState } from "react";
import profileImg from "/profile.png";
import type {
    TData,
    TError,
    TMeta,
    TStudent,
    TTableData,
    TTableHeadingData,
} from "../../../types";
import { useSearchParams } from "react-router-dom";
import { studentService } from "../../../store/services/studentService";
import { Tag } from "antd";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Table from "../../../components/common/Table/Table";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import { FaCheck, FaLock } from "react-icons/fa6";
import { Button } from "@headlessui/react";

const ActionBtns = ({ item }: { item: TStudent }) => {
    const [updateStudent] = studentService.useUpdateStudentMutation();
    const [deleteStudent] = studentService.useDeleteStudentMutation();
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
                const response = await updateStudent({
                    id: item.id,
                    status: item.status === "Active" ? "Inactive" : "Active",
                });
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<TStudent>) {
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
                const response = await deleteStudent(item.id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<TStudent>) {
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
            {/* <Link to={`/update-branch/${item.id}`}>
                <Button className="text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer">
                    <FaRegEdit className="w-4 h-4" />
                </Button>
            </Link> */}

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

const Students = () => {
    const [students, setStudents] = useState<TStudent[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isSuccess, isLoading, isFetching } =
        studentService.useGetStudentsQuery(
            searchParams ? [...searchParams] : undefined
        );

    useEffect(() => {
        if (isSuccess && data?.success) {
            setStudents(data?.data?.result);
            setMeta(data?.data?.meta);
        }
    }, [isSuccess, data]);

    const tableHeadingData: TTableHeadingData = [
        "Image",
        "Name",
        "Phone",
        "UUID",
        "Address",
        "Status",
        "Action",
    ];
    const tableData: TTableData = [];
    students.forEach((item: TStudent) =>
        tableData.push([
            <div className="flex justify-center items-center">
                <div className="size-10 rounded-full overflow-hidden">
                    <img
                        src={item?.image || profileImg}
                        alt=""
                        className="size-full object-cover object-center"
                    />
                </div>
            </div>,
            item?.name,
            item?.phone,
            item?.id,
            item?.address || "--",
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
                    Students
                </h3>
            </TitleCard>

            <Table
                title="Students"
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={meta}
                loading={isFetching || isLoading}
                path="/students"
                assets={true}
            />
        </div>
    );
};

export default Students;
