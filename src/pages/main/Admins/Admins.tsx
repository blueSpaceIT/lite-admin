import Swal from "sweetalert2";
import profileImg from "/profile.png";
import type {
    TAdmin,
    TData,
    TError,
    TMeta,
    TTableData,
    TTableHeadingData,
} from "../../../types";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { adminService } from "../../../store/services/adminService";
import { Tag } from "antd";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { Button } from "@headlessui/react";
import Table from "../../../components/common/Table/Table";
import toast from "react-hot-toast";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { FaCheck, FaLock, FaTrashCan } from "react-icons/fa6";

const ActionBtns = ({ item }: { item: TAdmin }) => {
    const [updateAdmin] = adminService.useUpdateAdminMutation();
    const [deleteAdmin] = adminService.useDeleteAdminMutation();
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
                const response = await updateAdmin({
                    id: item.id,
                    status: item.status === "Active" ? "Inactive" : "Active",
                });
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<TAdmin>) {
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
                const response = await deleteAdmin(item.id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<TAdmin>) {
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
            <Link to={`/update-admin/${item.id}`}>
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

const Admins = () => {
    const [admins, setAdmins] = useState<TAdmin[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isSuccess, isLoading, isFetching } =
        adminService.useGetAdminsQuery(
            searchParams ? [...searchParams] : undefined
        );

    useEffect(() => {
        if (isSuccess && data?.success) {
            setAdmins(data?.data?.result);
            setMeta(data?.data?.meta);
        }
    }, [isSuccess, data]);

    const tableHeadingData: TTableHeadingData = [
        "Image",
        "Name",
        "Phone",
        "Branch",
        "Role",
        "Status",
        "Action",
    ];
    const tableData: TTableData = [];
    admins.forEach((item: TAdmin) =>
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
            item?.branch?.name,
            item?.role === "admin" ? (
                <Tag color="magenta">{item?.role}</Tag>
            ) : item?.role === "moderator" ? (
                <Tag color="green">{item?.role}</Tag>
            ) : (
                <Tag color="blue">{item?.role}</Tag>
            ),
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
                    Admins
                </h3>
            </TitleCard>

            <div className="flex justify-end gap-2 mb-6">
                <Link to={"/create-admin"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        Create Admin
                    </Button>
                </Link>
                <Link to={"/admin-trashes"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer flex justify-center items-center gap-1">
                        <FaTrashCan /> Trash
                    </Button>
                </Link>
            </div>

            <Table
                title="Admins"
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={meta}
                loading={isFetching || isLoading}
                path="/admins"
                assets={true}
            />
        </div>
    );
};

export default Admins;
