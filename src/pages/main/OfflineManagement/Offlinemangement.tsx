import { Button } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronLeft, FaChevronRight, FaRegEdit, FaTrashAlt } from "react-icons/fa";
// import { FaReddit } from "react-icons/fa6"; // Added FaRegEdit
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../components/common/Form/Form";
import FormButton from "../../../components/common/Form/FormButton";
import InputField from "../../../components/common/Form/InputField";
import SelectField from "../../../components/common/Form/SelectField";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { OfflineBatchResolvers } from "../../../resolvers/offlineBatch.resolvers";
import { OfflineClassResolvers } from "../../../resolvers/offlineClass.resolvers";
import { offlineBatchService } from "../../../store/services/offlineBatchService";
import { offlineClassService } from "../../../store/services/offlineClassService";
import { useDeleteOfflineEnrollmentMutation, useGetMonthlyOfflineFinancialSummaryQuery, useGetOfflineEnrollmentsQuery } from "../../../store/services/offlineEnrollmentService";
import type { TData, TError, TOfflineBatch, TOfflineClass, TOfflineEnrollment } from "../../../types";
import type { TMonthlyFinancialSummary } from "../../../types/offlineEnrollment.types";
import OfflineEnrollmentViewModal from "./components/OfflineEnrollmentViewModal"; // Added import

// Removed EnrollmentActions component as its logic is moved inline

const OfflineManagement: React.FC = () => {
    // Financial Summary State
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<string>("");

    // Filter & Pagination State
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedBatch, setSelectedBatch] = useState<string>("");
    const [selectedDueStatus, setSelectedDueStatus] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [createOfflineClass] = offlineClassService.useCreateOfflineClassMutation();
    const [createOfflineBatch] = offlineBatchService.useCreateOfflineBatchMutation();
    const [deleteOfflineEnrollment] = useDeleteOfflineEnrollmentMutation(); // Moved here

    const handleCreateClass = async (data: any) => {
        try {
            const response = await createOfflineClass(data);
            if (response?.error) {
                toast.error((response?.error as TError)?.data?.message || "Class creation failed");
            }
            if ((response?.data as TData<TOfflineClass>)?.success) {
                Swal.fire({
                    title: "Created!",
                    text: "Class has been created successfully.",
                    icon: "success",
                });
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleCreateBatch = async (data: any) => {
        try {
            const response = await createOfflineBatch(data);
            if (response?.error) {
                toast.error((response?.error as TError)?.data?.message || "Batch creation failed");
            }
            if ((response?.data as TData<TOfflineBatch>)?.success) {
                Swal.fire({
                    title: "Created!",
                    text: "Batch has been created successfully.",
                    icon: "success",
                });
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleDeleteEnrollment = async (enrollmentId: string) => { // Moved here
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete this enrollment?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteOfflineEnrollment(enrollmentId);
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

    // Fetch Enrollments for frontend filtering/pagination
    const { data: enrollmentsData, isLoading: enrollmentsLoading } = useGetOfflineEnrollmentsQuery({ limit: 1000 });
    const { data: classesData } = offlineClassService.useGetOfflineClassesQuery([["limit", "1000"]]);
    const { data: batchesData } = offlineBatchService.useGetOfflineBatchesQuery([["limit", "1000"]]);

    const enrollments: TOfflineEnrollment[] = useMemo(() => {
        const raw = enrollmentsData?.data?.result || [];
        return [...raw].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
    }, [enrollmentsData]);

    const classes: TOfflineClass[] = classesData?.data || [];
    const batches: TOfflineBatch[] = batchesData?.data || [];

    const { data: summaryData } = useGetMonthlyOfflineFinancialSummaryQuery({
        year: selectedYear || undefined,
        month: selectedMonth || undefined,
    });

    const summary: TMonthlyFinancialSummary | null = summaryData?.data || null;

    const classOptionsForBatch = useMemo(() => classes.map((item: TOfflineClass) => ({
        label: item.title,
        value: item._id,
    })), [classes]);

    // Reset batch if class changes
    useEffect(() => {
        setSelectedBatch("");
    }, [selectedClass]);

    // Reset due status if batch changes
    useEffect(() => {
        setSelectedDueStatus("");
    }, [selectedBatch]);

    // Helper maps for ID to Title resolution
    const classMap = useMemo(() => new Map(classes.map(c => [c._id, c.title])), [classes]);
    const batchMap = useMemo(() => new Map(batches.map(b => [b._id, b.title])), [batches]);
    const batchToClassMap = useMemo(() => new Map(batches.map(b => [b._id, typeof b.classId === 'string' ? b.classId : b.classId?._id])), [batches]);

    const filteredBatches = useMemo(() => {
        if (!selectedClass) return [];
        return batches.filter(b => (typeof b.classId === 'string' ? b.classId : b.classId?._id) === selectedClass);
    }, [batches, selectedClass]);

    // Generate year options (from 2024 to current year)
    const yearOptions = useMemo(() => {
        const options = [{ value: "", label: "All Time" }];
        const currentYear = new Date().getFullYear();
        for (let year = 2024; year <= currentYear; year++) {
            options.push({ value: String(year), label: String(year) });
        }
        return options;
    }, []);

    // Generate month options based on selected year
    const monthOptions = useMemo(() => {
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

    // Frontend Filtering
    const filteredEnrollments = useMemo(() => {
        return enrollments.filter(enrollment => {
            // Class Filter
            if (selectedClass) {
                const enrollmentClassId = (enrollment as any).classId?._id || (enrollment as any).class || (enrollment as any).batchId?.classId?._id || (enrollment as any).batchId?.classId || batchToClassMap.get(enrollment.batch);
                if (enrollmentClassId !== selectedClass) return false;
            }

            // Batch Filter
            if (selectedBatch) {
                const enrollmentBatchId = (enrollment as any).batchId?._id || enrollment.batch;
                if (enrollmentBatchId !== selectedBatch) return false;
            }

            // Due Filter
            if (selectedDueStatus) {
                const dueAmount = enrollment.calculatedDue ?? enrollment.dueAmount;
                if (selectedDueStatus === "due" && (dueAmount === undefined || dueAmount <= 0)) return false;
                if (selectedDueStatus === "paid" && (dueAmount !== undefined && dueAmount > 0)) return false;
            }

            return true;
        });
    }, [enrollments, selectedClass, selectedBatch, searchQuery, batchToClassMap, selectedDueStatus]);

    // Frontend Pagination
    const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);
    const paginatedEnrollments = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredEnrollments.slice(start, start + itemsPerPage);
    }, [filteredEnrollments, currentPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedClass, selectedBatch, searchQuery, selectedDueStatus]);

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Offline Management
                </h3>
            </TitleCard>

            {/* Section 1: Financial Overview */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <h4 className="text-lg font-bold text-slate-700 uppercase tracking-wider">Financial Overview</h4>
                    <div className="flex items-center gap-2">
                        {/* Financial Summary Filter */}
                        <select
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {yearOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <select
                            disabled={!selectedYear}
                            className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-36 p-2 ${!selectedYear ? 'opacity-50 cursor-not-allowed' : ''}`}
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {!selectedYear ? <option value="">Select Year</option> : monthOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <h4 className="text-slate-500 text-xs font-bold uppercase">Total Earnings</h4>
                        <p className="text-2xl font-black text-slate-800 mt-2">Tk {summary?.totalCourseFee || 0}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <h4 className="text-slate-500 text-xs font-bold uppercase">Paid Amount</h4>
                        <p className="text-2xl font-black text-green-600 mt-2">Tk {summary?.totalPaidAmount || 0}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <h4 className="text-slate-500 text-xs font-bold uppercase">Due Amount</h4>
                        <p className="text-2xl font-black text-red-600 mt-2">Tk {summary?.totalDueAmount || 0}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <h4 className="text-slate-500 text-xs font-bold uppercase">Total Enrollments</h4>
                        <p className="text-2xl font-black text-blue-600 mt-2">{summary?.totalEnrollments || 0}</p>
                    </div>
                </div>
            </div>

            {/* Section 2: Quick Create (Class & Batch) */}
            <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-1 border-b border-slate-100 pb-2">
                        <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Quick Create Class</h4>
                        <Link to="/offline-class">
                            <button className="text-[10px] font-bold text-white hover:text-blue-800 uppercase tracking-tighter transition-colors cursor-pointer bg-slate-500 px-2 py-1 rounded-full">See All Classes</button>
                        </Link>
                    </div>
                    <div className="flex-1 flex flex-col justify-center ">
                        <Form
                            onSubmit={handleCreateClass}
                            resolver={zodResolver(OfflineClassResolvers.createOfflineClassValidationSchema)}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4  items-center">
                                <div className="sm:col-span-9">
                                    <InputField name="title" label="Class Title" placeholder="Enter class title" />
                                </div>
                                <div className="sm:col-span-3 mt-2 ">
                                    <FormButton>Create Class</FormButton>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                        <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Quick Create Batch</h4>
                        <Link to="/offline-batch">
                            <button className="text-[10px] font-bold text-white hover:text-blue-800 uppercase tracking-tighter transition-colors cursor-pointer bg-slate-500 px-2 py-1 rounded-full">See All Batches</button>
                        </Link>
                    </div>
                    <Form
                        onSubmit={handleCreateBatch}
                        resolver={zodResolver(OfflineBatchResolvers.createOfflineBatchValidationSchema)}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField name="title" label="Batch Title" placeholder="Enter batch title" />
                            <SelectField
                                name="classId"
                                label="Select Class"
                                placeholder="Choose Class"
                                options={classOptionsForBatch}
                            />
                        </div>
                        <div className="mt-4 flex justify-end">
                            <FormButton>Create Batch</FormButton>
                        </div>
                    </Form>
                </div>
            </div>

            {/* Section 3: Enrollment Management */}
            <div>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="flex items-center gap-2">
                            <h4 className="text-lg font-bold text-slate-700 uppercase tracking-wider">Enrollments</h4>
                            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                Total {filteredEnrollments.length}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 flex-grow lg:flex-grow-0 mt-2 lg:mt-0">
                            {/* Search Box */}
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                    placeholder="Search by Name or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Class Filter */}
                            <select
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-44 p-2 shadow-sm"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="">All Classes</option>
                                {classes.map((cls) => (
                                    <option key={cls._id} value={cls._id}>{cls.title}</option>
                                ))}
                            </select>

                            {/* Batch Filter */}
                            <select
                                disabled={!selectedClass}
                                className={`bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-44 p-2 shadow-sm ${!selectedClass ? 'opacity-50 cursor-not-allowed' : ''}`}
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                            >
                                <option value="">All Batches</option>
                                {filteredBatches.map((batch) => (
                                    <option key={batch._id} value={batch._id}>{batch.title}</option>
                                ))}
                            </select>

                            {/* Due Filter */}
                            <select
                                disabled={!selectedBatch}
                                className={`bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-44 p-2 shadow-sm ${!selectedBatch ? 'opacity-50 cursor-not-allowed' : ''}`}
                                value={selectedDueStatus}
                                onChange={(e) => setSelectedDueStatus(e.target.value)}
                            >
                                <option value="">All Due Status</option>
                                <option value="due">Has Due</option>
                                <option value="paid">No Due (Paid)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-end">
                        <Link to={"/offline-enrollment-create"}>
                            <Button className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white cursor-pointer hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2">
                                <span>+</span> New Enrollment
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Class / Batch</th>
                                    <th className="px-6 py-4">Fee</th>
                                    <th className="px-6 py-4">Paid</th>
                                    <th className="px-6 py-4">Due</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {enrollmentsLoading ? (
                                    <tr><td colSpan={7} className="px-6 py-10 text-center text-slate-500 italic">Finding records...</td></tr>
                                ) : paginatedEnrollments.length === 0 ? (
                                    <tr><td colSpan={7} className="px-6 py-10 text-center text-slate-500 italic">No matching enrollments found.</td></tr>
                                ) : (
                                    paginatedEnrollments.map((enrollment) => ( // Changed item to enrollment for clarity
                                        <tr key={enrollment._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-slate-900">{enrollment.studentName}</div>
                                                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{enrollment.studentId || "No ID"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-slate-700">
                                                    {(enrollment as any).batchId?.classId?.title || classMap.get(enrollment.class) || classMap.get(batchToClassMap.get(enrollment.batch) || "") || "N/A"}
                                                </div>
                                                <div className="text-xs text-slate-400 font-medium italic">
                                                    {(enrollment as any).batchId?.title || batchMap.get(enrollment.batch) || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-700">৳{enrollment.courseFee}</td>
                                            <td className="px-6 py-4 text-sm font-black text-green-600">৳{enrollment.paidAmount}</td>
                                            <td className="px-6 py-4 text-sm font-black text-rose-600">৳{enrollment.calculatedDue ?? enrollment.dueAmount}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${enrollment.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                    enrollment.status === 'Completed' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-rose-100 text-rose-700 border border-rose-200'
                                                    }`}>
                                                    {enrollment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <OfflineEnrollmentViewModal
                                                        enrollment={enrollment}
                                                        classTitle={classMap.get((enrollment as any).classId?._id || (enrollment as any).class || (enrollment as any).batchId?.classId?._id || (enrollment as any).batchId?.classId || batchToClassMap.get(enrollment.batch))}
                                                        batchTitle={batchMap.get((enrollment as any).batchId?._id || enrollment.batch)}
                                                    />
                                                    <Link
                                                        to={`/offline-enrollment-update/${enrollment._id}`}
                                                        className="p-2 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all scale-100 hover:scale-110 active:scale-95"
                                                        title="Edit Enrollment"
                                                    >
                                                        <FaRegEdit className="w-4 h-4" />
                                                    </Link>
                                                    <Button
                                                        onClick={() => handleDeleteEnrollment(enrollment._id!)}
                                                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all scale-100 hover:scale-110 active:scale-95"
                                                        title="Delete Enrollment"
                                                    >
                                                        <FaTrashAlt className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Frontend Pagination Controls */}
                    {filteredEnrollments.length > 0 && (
                        <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 gap-4">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Showing <span className="text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-slate-700">{Math.min(currentPage * itemsPerPage, filteredEnrollments.length)}</span> of <span className="text-slate-700">{filteredEnrollments.length}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Show:</span>
                                    <select
                                        className="bg-white border border-slate-200 text-slate-700 text-[10px] font-black rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 shadow-sm uppercase"
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {[10, 20, 50, 100].map((size) => (
                                            <option key={size} value={size}>{size} per page</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
                                    >
                                        <FaChevronLeft className="w-3 h-3" />
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <Button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`size-9 text-xs font-black rounded-lg transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white shadow-md scale-110' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                                            >
                                                {i + 1}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
                                    >
                                        <FaChevronRight className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OfflineManagement;