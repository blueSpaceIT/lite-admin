import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { FaDownload } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { z } from "zod";
import DateTimeField from "../../../components/common/Form/DateTimeField";
import Form from "../../../components/common/Form/Form";
import FormButton from "../../../components/common/Form/FormButton";
import InputField from "../../../components/common/Form/InputField";
import NumberField from "../../../components/common/Form/NumberField";
import SelectField from "../../../components/common/Form/SelectField";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { offlineBatchService } from "../../../store/services/offlineBatchService";
import { offlineClassService } from "../../../store/services/offlineClassService";
import { offlineEnrollmentService } from "../../../store/services/offlineEnrollmentService";
import type { TData, TError, TOfflineBatch, TOfflineClass, TOfflineEnrollment, TPayment } from "../../../types";

const enrollmentUpdateSchema = z.object({
    studentName: z.string().min(1, "Student name is required"),
    phone: z.string().min(11, "Valid phone number is required"),
    studentId: z.string().min(1, "Student ID is required"),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().optional(),
    courseFee: z.number().min(0, "Course fee must be positive"),
    class: z.string().min(1, "Class is required"),
    batch: z.string().min(1, "Batch is required"),
    status: z.enum(['Active', 'Inactive', 'Completed', 'Cancelled']),
});

const addPaymentSchema = z.object({
    amount: z.number().min(1, "Amount must be at least 1"),
    method: z.enum(['Bkash', 'Nagad', 'Bank', 'Cash', 'Other', 'paystation']),
    transactionId: z.string().optional(),
    paymentDate: z.string().min(1, "Payment date is required"),
    month: z.string().optional(),
    note: z.string().optional(),
    notificationType: z.enum(['sms', 'invoice', 'none']).default('none'),
});

const EnrollmentUpdateFields = ({ classOptions, batchOptions, statusOptions, setSelectedClassId, selectedClassId }: any) => {
    const { setValue } = useFormContext();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="studentName" label="Student Name" placeholder="Enter student name" />
            <InputField name="phone" label="Phone" placeholder="Enter phone number" />
            <InputField name="studentId" label="Student ID" placeholder="Enter student ID" />
            <InputField name="email" label="Email (Optional)" placeholder="Enter email address" />
            <div className="md:col-span-2">
                <InputField name="address" label="Address (Optional)" placeholder="Enter address" />
            </div>
            <NumberField name="courseFee" label="Course Fee" />
            <SelectField
                name="status"
                label="Enrollment Status"
                options={statusOptions}
                placeholder="Select status"
            />
            <SelectField
                name="class"
                label="Class"
                options={classOptions}
                placeholder="Select class"
                onChange={(val) => {
                    setSelectedClassId(val);
                    setValue("batch", "");
                }}
            />
            <SelectField
                name="batch"
                label="Batch"
                options={batchOptions}
                placeholder="Select batch"
                disable={!selectedClassId}
            />
        </div>
    );
};

const PaymentRecordFields = ({ paymentMethodOptions }: { paymentMethodOptions: any[] }) => {
    const { setValue } = useFormContext();
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());

    const yearOptions = [
        { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
        { value: currentYear.toString(), label: currentYear.toString() },
        { value: (currentYear + 1).toString(), label: (currentYear + 1).toString() },
    ];

    const generateMonthOptions = (year: string) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months.map((month, index) => ({
            value: `${year}-${(index + 1).toString().padStart(2, '0')}`,
            label: `${month} ${year}`
        }));
    };

    const monthOptions = generateMonthOptions(selectedYear);

    return (
        <div className="space-y-1">
            <NumberField name="amount" label="Payment Amount" />
            <SelectField
                name="method"
                label="Method"
                options={paymentMethodOptions}
                placeholder="Select method"
            />
            <InputField name="transactionId" label="Transaction ID" placeholder="Optional" />
            <DateTimeField name="paymentDate" label="Payment Date" />
            <div className="grid grid-cols-2 gap-2">
                <SelectField
                    name="paymentYear"
                    label="Select Year"
                    options={yearOptions}
                    placeholder="Year"
                    onChange={(val) => {
                        setSelectedYear(val);
                        setValue("month", "");
                    }}
                />
                <SelectField
                    name="month"
                    label="Select Month"
                    options={monthOptions}
                    placeholder="Month"
                    disable={!selectedYear}
                />
            </div>
            <InputField name="note" label="Note" placeholder="Optional" />

            <div className="mb-4">
                <label className="text-sm text-slate-500 font-semibold mb-2 block">
                    Notification Option
                </label>
                <Controller
                    name="notificationType"
                    render={({ field }) => (
                        <Radio.Group {...field} className="flex flex-col gap-2">
                            <Radio value="none">None</Radio>
                            <Radio value="sms">Send SMS</Radio>
                            <Radio value="invoice">Generate Invoice</Radio>
                        </Radio.Group>
                    )}
                />
            </div>
        </div>
    );
};

const OfflineEnrollmentUpdate: React.FC = () => {
    const { id } = useParams();
    const { data: enrollmentData, isLoading: isEnrollmentLoading } = offlineEnrollmentService.useGetOfflineEnrollmentQuery(id);
    const [updateEnrollment] = offlineEnrollmentService.useUpdateOfflineEnrollmentMutation();
    const [addPayment] = offlineEnrollmentService.useAddOfflinePaymentMutation();

    const { data: classesData } = offlineClassService.useGetOfflineClassesQuery([]);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const { data: batchesData } = offlineBatchService.useGetOfflineBatchesQuery(
        selectedClassId ? { classId: selectedClassId } : undefined,
        { skip: !selectedClassId }
    );

    useEffect(() => {
        if (enrollmentData?.data?.class) {
            const classObj = enrollmentData.data.class;
            const classId = typeof classObj === 'string' ? classObj : classObj?._id;
            if (classId) setSelectedClassId(classId);
        }
    }, [enrollmentData]);

    const handleUpdate = async (data: any) => {
        try {
            const response = await updateEnrollment({ id, ...data });

            if (response?.error) {
                toast.error((response?.error as TError)?.data?.message || "Update failed");
            }

            if ((response?.data as TData<TOfflineEnrollment>)?.success) {
                Swal.fire({
                    title: "Updated!",
                    text: "Enrollment details updated successfully.",
                    icon: "success",
                });
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleAddPayment = async (data: any) => {
        try {
            const { notificationType, ...paymentData } = data;
            const response = await addPayment({
                enrollmentId: id,
                payment: paymentData,
                sendSMS: notificationType === 'sms',
                autoGenerateInvoice: notificationType === 'invoice'
            });

            if (response?.error) {
                toast.error((response?.error as TError)?.data?.message || "Payment failed");
            }

            if ((response?.data as TData<any>)?.success) {
                Swal.fire({
                    title: "Paid!",
                    text: "Payment recorded successfully.",
                    icon: "success",
                });
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    if (isEnrollmentLoading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    const classOptions = classesData?.data?.map((cls: TOfflineClass) => ({
        value: cls._id,
        label: cls.title,
    })) || [];

    const filteredBatches = batchesData?.data?.filter((batch: TOfflineBatch) => {
        const classId = typeof batch.classId === 'string' ? batch.classId : batch.classId?._id;
        return classId === selectedClassId;
    }) || [];

    const batchOptions = filteredBatches.map((batch: TOfflineBatch) => ({
        value: batch._id,
        label: batch.title,
    }));

    const statusOptions = [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Cancelled', label: 'Cancelled' },
    ];

    const paymentMethodOptions = [
        { value: 'Bkash', label: 'Bkash' },
        { value: 'Nagad', label: 'Nagad' },
        { value: 'Bank', label: 'Bank' },
        { value: 'Cash', label: 'Cash' },
        { value: 'Other', label: 'Other' },
        { value: 'paystation', label: 'Paystation' },
    ];

    const currentEnrollment = enrollmentData?.data;
    const defaultValues = {
        studentName: currentEnrollment?.studentName,
        phone: currentEnrollment?.phone,
        studentId: currentEnrollment?.studentId,
        email: currentEnrollment?.email,
        address: currentEnrollment?.address,
        courseFee: currentEnrollment?.courseFee,
        class: typeof currentEnrollment?.class === 'string' ? currentEnrollment?.class : currentEnrollment?.class?._id,
        batch: typeof currentEnrollment?.batch === 'string' ? currentEnrollment?.batch : currentEnrollment?.batch?._id,
        status: currentEnrollment?.status,
    };

    return (
        <div className="max-w-[1000px] md:w-full md:mx-auto mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <TitleCard>
                    <h3 className="text-center text-lg lg:text-2xl font-bold">
                        Update Enrollment
                    </h3>
                </TitleCard>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <Form
                        onSubmit={handleUpdate}
                        resolver={zodResolver(enrollmentUpdateSchema)}
                        defaultValues={defaultValues}
                    >
                        <EnrollmentUpdateFields
                            classOptions={classOptions}
                            batchOptions={batchOptions}
                            statusOptions={statusOptions}
                            setSelectedClassId={setSelectedClassId}
                            selectedClassId={selectedClassId}
                        />
                        <div className="mt-6">
                            <FormButton>Update Details</FormButton>
                        </div>
                    </Form>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="text-lg font-bold mb-4">Payment History</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-3 text-slate-500 font-semibold text-sm">Date</th>
                                    <th className="py-3 text-slate-500 font-semibold text-sm">Method</th>
                                    <th className="py-3 text-slate-500 font-semibold text-sm">Amount</th>
                                    <th className="py-3 text-slate-500 font-semibold text-sm">Txn ID</th>
                                    <th className="py-3 text-slate-500 font-semibold text-sm text-right">Invoice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEnrollment?.payments?.map((payment: TPayment, idx: number) => (
                                    <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 text-sm">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                        <td className="py-3 text-sm">
                                            <span className="bg-slate-100 px-2 py-1 rounded text-xs">{payment.method}</span>
                                        </td>
                                        <td className="py-3 text-sm font-bold text-green-600">৳{payment.amount}</td>
                                        <td className="py-3 text-sm text-slate-500">{payment.transactionId || "-"}</td>
                                        <td className="py-3 text-sm text-right">
                                            {payment.invoiceUrl ? (
                                                <a
                                                    href={payment.invoiceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Download Invoice"
                                                >
                                                    <FaDownload className="w-4 h-4" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {(!currentEnrollment?.payments || currentEnrollment.payments.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="py-6 text-center text-slate-400">No payment history found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="text-lg font-bold mb-4">Balance Summary</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Course Fee:</span>
                            <span className="font-semibold text-slate-700">৳{currentEnrollment?.courseFee}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 text-green-600">Total Paid:</span>
                            <span className="font-bold text-green-600">৳{currentEnrollment?.paidAmount}</span>
                        </div>
                        <div className="divide-y divide-slate-100" />
                        <div className="flex justify-between items-center text-base pt-1">
                            <span className="text-slate-500 font-bold">Due Balance:</span>
                            <span className="font-black text-rose-600 text-lg">৳{currentEnrollment?.calculatedDue ?? currentEnrollment?.dueAmount}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="text-lg font-bold mb-4 text-primary">Record New Payment</h4>
                    <Form
                        onSubmit={handleAddPayment}
                        resolver={zodResolver(addPaymentSchema)}
                        defaultValues={{
                            paymentYear: new Date().getFullYear().toString(),
                            notificationType: 'none'
                        }}
                    >
                        <PaymentRecordFields paymentMethodOptions={paymentMethodOptions} />
                        <div className="mt-6">
                            <FormButton >
                                Record Payment
                            </FormButton>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default OfflineEnrollmentUpdate;

