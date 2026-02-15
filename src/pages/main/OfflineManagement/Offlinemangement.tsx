import { Button } from "@headlessui/react";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { offlineBatchService } from "../../../store/services/offlineBatchService";
import { offlineClassService } from "../../../store/services/offlineClassService";
import { useGetMonthlyOfflineFinancialSummaryQuery } from "../../../store/services/offlineEnrollmentService";
import type { TData, TError, TOfflineBatch, TOfflineClass } from "../../../types";
import type { TMonthlyFinancialSummary } from "../../../types/offlineEnrollment.types";

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
    // Year state: "" means All Time
    const [selectedYear, setSelectedYear] = React.useState<string>("");
    // Month state: "" means Full Year (if year selected) or All Time (if no year)
    const [selectedMonth, setSelectedMonth] = React.useState<string>("");

    const { data: summaryData } = useGetMonthlyOfflineFinancialSummaryQuery({
        year: selectedYear || undefined,
        month: selectedMonth || undefined,
    });

    const summary: TMonthlyFinancialSummary | null = summaryData?.data || null;

    // Generate year options (from 2024 to current year)
    const yearOptions = React.useMemo(() => {
        const options = [{ value: "", label: "All Time" }];
        const currentYear = new Date().getFullYear();
        for (let year = 2024; year <= currentYear; year++) {
            options.push({ value: String(year), label: String(year) });
        }
        return options;
    }, []);

    // Generate month options based on selected year
    const monthOptions = React.useMemo(() => {
        if (!selectedYear) return [];

        const options = [{ value: "", label: "Full Year" }];
        const today = new Date();
        const currentYear = today.getFullYear();
        const isCurrentYear = String(currentYear) === selectedYear;
        const maxMonth = isCurrentYear ? today.getMonth() : 11; // 0-indexed

        for (let i = 0; i <= maxMonth; i++) {
            const monthValue = String(i + 1).padStart(2, "0");
            const value = `${selectedYear}-${monthValue}`;
            const date = new Date(Number(selectedYear), i, 1);
            const label = date.toLocaleString("default", { month: "long" });
            options.push({ value, label });
        }
        return options;
    }, [selectedYear]);

    // Reset month if year changes and month is not compatible
    useEffect(() => {
        if (selectedMonth && !selectedYear) {
            setSelectedMonth("");
        } else if (selectedMonth && selectedYear && !selectedMonth.startsWith(selectedYear)) {
            setSelectedMonth("");
        }
    }, [selectedYear, selectedMonth]);

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
            {/* Financial Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <h4 className="text-slate-500 text-sm font-medium uppercase">
                        Total Earnings
                    </h4>
                    <p className="text-2xl font-bold text-slate-800 mt-2">
                        Tk {summary?.totalCourseFee || 0}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <h4 className="text-slate-500 text-sm font-medium uppercase">
                        Paid Amount
                    </h4>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                        Tk {summary?.totalPaidAmount || 0}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <h4 className="text-slate-500 text-sm font-medium uppercase">
                        Due Amount
                    </h4>
                    <p className="text-2xl font-bold text-red-600 mt-2">
                        Tk {summary?.totalDueAmount || 0}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <h4 className="text-slate-500 text-sm font-medium uppercase">
                        Total Enrollments
                    </h4>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                        {summary?.totalEnrollments || 0}
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center gap-2 mb-6">
                <div className="flex items-center gap-2">
                    {/* Year selection */}
                    <div className="w-36">
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {yearOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Month selection */}
                    <div className="w-40">
                        <select
                            disabled={!selectedYear}
                            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${!selectedYear ? 'opacity-50 cursor-not-allowed' : ''}`}
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {!selectedYear ? (
                                <option value="">Select Year First</option>
                            ) : (
                                monthOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>
                <div className="flex gap-2">
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
        </div >
    );
};

export default OfflineManagement;