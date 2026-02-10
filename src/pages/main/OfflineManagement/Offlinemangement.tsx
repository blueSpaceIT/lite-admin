import { Button } from "@headlessui/react";
import React from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { offlineBatchService } from "../../../store/services/offlineBatchService";
import { offlineClassService } from "../../../store/services/offlineClassService";
import type { TData, TError, TOfflineBatch, TOfflineClass } from "../../../types";

const ClassActions = ({ item }: { item: TOfflineClass }) => {
    const [deleteOfflineClass] = offlineClassService.useDeleteOfflineClassMutation();

    const handleDelete = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete ${item.title} and all its batches?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteOfflineClass(item._id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if ((response?.data as TData<TOfflineClass>)?.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Class has been deleted.",
                        icon: "success",
                    });
                }
            }
        });
    };

    return (
        <div className="flex items-center gap-2">
            <Link to={`/offline-class-update/${item._id}`}>
                <Button
                    type="button"
                    className="text-blue-600 bg-blue-100 hover:bg-blue-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center cursor-pointer"
                    title="Edit Class"
                >
                    <FaEdit className="w-3 h-3" />
                </Button>
            </Link>
            <Button
                type="button"
                onClick={handleDelete}
                className="text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center cursor-pointer"
                title="Delete Class"
            >
                <FaTrashAlt className="w-3 h-3" />
            </Button>
        </div>
    );
};

const BatchActions = ({ item }: { item: TOfflineBatch }) => {
    const [deleteOfflineBatch] = offlineBatchService.useDeleteOfflineBatchMutation();

    const handleDelete = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete batch ${item.title}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteOfflineBatch(item._id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if ((response?.data as TData<TOfflineBatch>)?.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Batch has been deleted.",
                        icon: "success",
                    });
                }
            }
        });
    };

    return (
        <div className="flex items-center gap-2">
            <Link to={`/offline-batch-update/${item._id}`}>
                <Button
                    type="button"
                    className="text-blue-600 bg-blue-100 hover:bg-blue-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center cursor-pointer"
                    title="Edit Batch"
                >
                    <FaEdit className="w-3 h-3" />
                </Button>
            </Link>
            <Button
                type="button"
                onClick={handleDelete}
                className="text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center cursor-pointer"
                title="Delete Batch"
            >
                <FaTrashAlt className="w-3 h-3" />
            </Button>
        </div>
    );
};

const OfflineManagement: React.FC = () => {
    // Fetch lists with high limit to show all in the overview
    const { data: classesData } = offlineClassService.useGetOfflineClassesQuery([
        ["limit", "1000"],
    ]);
    const { data: batchesData } = offlineBatchService.useGetOfflineBatchesQuery([
        ["limit", "1000"],
    ]);

    const classes: TOfflineClass[] = classesData?.data || [];
    const batches: TOfflineBatch[] = batchesData?.data || [];

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Offline Management
                </h3>
            </TitleCard>

            <div className="flex justify-end items-center gap-2 mb-6">
                <Link to={"/offline-class-create"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        Create Class
                    </Button>
                </Link>
                <Link to={"/offline-batch-create"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        Create Batch
                    </Button>
                </Link>
                <Link to={"/offline-enrollment-create"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        Create Enrollment
                    </Button>
                </Link>
                <Link to={"/offline-enrollment-list"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        See Enrollments
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col gap-6">
                {classes.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        No offline classes found.
                    </div>
                ) : (
                    classes.map((cls) => {
                        const classBatches = batches.filter(
                            (b) => b.classId?._id === cls._id
                        );

                        return (
                            <div
                                key={cls._id}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                            >
                                {/* Class Header */}
                                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-200">
                                    <h4 className="text-lg font-bold text-slate-800">
                                        {cls.title}
                                        <span className="ml-2 text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                                            {classBatches.length} Batches
                                        </span>
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <ClassActions item={cls} />
                                    </div>
                                </div>

                                {/* Batches List */}
                                <div className="p-0">
                                    {classBatches.length > 0 ? (
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-white border-b border-slate-100 text-xs text-slate-500 uppercase">
                                                    <th className="px-6 py-3 font-semibold w-1/12">
                                                        #
                                                    </th>
                                                    <th className="px-6 py-3 font-semibold">
                                                        Batch Title
                                                    </th>
                                                    <th className="px-6 py-3 font-semibold text-center">
                                                        Students
                                                    </th>
                                                    <th className="px-6 py-3 font-semibold text-right">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {classBatches.map((batch, index) => (
                                                    <tr
                                                        key={batch._id}
                                                        className="hover:bg-slate-50 border-b last:border-0 border-slate-100"
                                                    >
                                                        <td className="px-6 py-3 text-sm text-slate-500">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-6 py-3 text-sm font-medium text-slate-700">
                                                            {batch.title}
                                                        </td>
                                                        <td className="px-6 py-3 text-center">
                                                            <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                                                                {batch.students?.length || 0} Students
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3 text-right">
                                                            <BatchActions item={batch} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="p-6 text-center text-sm text-slate-400 italic">
                                            No batches added for this class yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default OfflineManagement;