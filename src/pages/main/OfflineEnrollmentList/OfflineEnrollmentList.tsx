import { Button } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "../../../components/common/Table/Table";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { offlineEnrollmentService } from "../../../store/services/offlineEnrollmentService";
import type { TData, TError, TMeta, TOfflineEnrollment, TTableData, TTableHeadingData } from "../../../types";

const ActionBtns = ({ item }: { item: TOfflineEnrollment }) => {
    const [deleteOfflineEnrollment] = offlineEnrollmentService.useDeleteOfflineEnrollmentMutation();

    const handleDelete = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete enrollment for ${item.studentName}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteOfflineEnrollment(item._id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message || "Delete failed");
                }
                if ((response?.data as TData<TOfflineEnrollment>)?.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Enrollment has been deleted.",
                        icon: "success",
                    });
                }
            }
        });
    };

    return (
        <div className="flex justify-center items-center gap-3">
            <Link to={`/offline-enrollment-update/${item._id}`}>
                <Button
                    type="button"
                    className="text-blue-600 bg-blue-100 hover:bg-blue-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center cursor-pointer"
                    title="Edit Enrollment"
                >
                    <FaEdit className="w-3 h-3" />
                </Button>
            </Link>
            <Button
                type="button"
                onClick={handleDelete}
                className="text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center cursor-pointer"
                title="Delete Enrollment"
            >
                <FaTrashAlt className="w-3 h-3" />
            </Button>
        </div>
    );
};

const OfflineEnrollmentList: React.FC = () => {
    const [data, setData] = useState<TOfflineEnrollment[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: enrollmentData, isSuccess, isLoading, isFetching } =
        offlineEnrollmentService.useGetOfflineEnrollmentsQuery(
            Object.fromEntries([...searchParams])
        );

    useEffect(() => {
        if (isSuccess && enrollmentData?.success) {
            setData(enrollmentData?.data?.result || []);
            if (enrollmentData?.data?.meta) {
                setMeta(enrollmentData.data.meta);
            }
        }
    }, [isSuccess, enrollmentData]);

    const tableHeadingData: TTableHeadingData = [
        "Student Name",
        "Student ID",
        "Fee",
        "Paid",
        "Due",
        "Status",
        "Action",
    ];

    const tableData: TTableData = [];
    const enrollments = Array.isArray(data) ? data : [];

    enrollments.forEach((item: TOfflineEnrollment) => {
        tableData.push([
            item.studentName,
            item.studentId || "N/A",
            <span className="font-medium">৳{item.courseFee}</span>,
            <span className="text-green-600 font-bold">৳{item.paidAmount}</span>,
            <span className="text-red-600 font-bold">৳{item.dueAmount}</span>,
            <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === 'Active' ? 'bg-green-100 text-green-700' :
                item.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                }`}>
                {item.status}
            </span>,
            <ActionBtns item={item} />,
        ]);
    });

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Offline Enrollments
                </h3>
            </TitleCard>
            <div className="flex justify-end items-center gap-2 mb-6">
                <Link to={"/offline-enrollment-create"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        Add Enrollment
                    </Button>
                </Link>
            </div>

            <Table
                title="Offline Enrollments"
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={meta}
                loading={isFetching || isLoading}
                path="/offline-enrollment-list"
            />
        </div>
    );
};

export default OfflineEnrollmentList;
