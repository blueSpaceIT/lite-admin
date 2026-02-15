import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
import { useCreateOfflineEnrollmentMutation } from "../../../store/services/offlineEnrollmentService";
import type { TData, TError, TOfflineBatch, TOfflineClass } from "../../../types";
import type { TOfflineEnrollment } from "../../../types/offlineEnrollment.types";

// Validation schema for enrollment
const enrollmentValidationSchema = z.object({
    studentName: z.string().min(1, "Student name is required"),
    phone: z.string().min(11, "Valid phone number is required"),

    address: z.string().optional(),
    courseFee: z.number().min(0, "Course fee must be positive"),
    class: z.string().min(1, "Class is required"),
    batch: z.string().min(1, "Batch is required"),
    month: z.string().optional(),
    paymentAmount: z.number().min(0, "Payment amount must be positive"),
    paymentMethod: z.string().min(1, "Payment method is required"),
    transactionId: z.string().optional(),
    paymentDate: z.string().min(1, "Payment date is required"),
    note: z.string().optional(),
});

const ClassSelectField = () => {
    const [classes, setClasses] = useState<{ value: string; label: string }[]>([]);
    const { data: classesData } = offlineClassService.useGetOfflineClassesQuery([]);

    useEffect(() => {
        if (classesData?.data) {
            const transformedClasses = classesData.data.map((cls: TOfflineClass) => ({
                value: cls._id,
                label: cls.title,
            }));
            setClasses(transformedClasses);
        }
    }, [classesData]);

    return (
        <SelectField
            name="class"
            placeholder="Select Class"
            label="Class"
            options={classes}
            disable={!classes.length}
        />
    );
};

const BatchSelectField = () => {
    const [batches, setBatches] = useState<{ value: string; label: string }[]>([]);
    const { data: batchesData } = offlineBatchService.useGetOfflineBatchesQuery({});
    const { watch } = useFormContext();
    const selectedClass = watch("class");

    useEffect(() => {
        if (batchesData?.data && selectedClass) {
            // Filter batches that belong to the selected class
            const filteredBatches = batchesData.data.filter(
                (batch: TOfflineBatch) => batch.classId?._id === selectedClass || batch.classId === selectedClass
            );
            const transformedBatches = filteredBatches.map((batch: TOfflineBatch) => ({
                value: batch._id,
                label: batch.title,
            }));
            setBatches(transformedBatches);
        } else {
            // Clear batches if no class is selected
            setBatches([]);
        }
    }, [batchesData, selectedClass]);

    return (
        <SelectField
            name="batch"
            placeholder={selectedClass ? "Select Batch" : "Select Class First"}
            label="Batch"
            options={batches}
            disable={!selectedClass || !batches.length}
        />
    );
};

const OfflineEnrollmentCreate: React.FC = () => {
    const [createOfflineEnrollment] = useCreateOfflineEnrollmentMutation();
    const navigate = useNavigate();

    const handleCreate = async (data: any) => {
        try {
            // Transform form data to match API structure
            const enrollmentData = {
                studentName: data.studentName,
                phone: data.phone,

                email: data.email || undefined,
                address: data.address || undefined,
                courseFee: Number(data.courseFee),
                class: data.class,
                batch: data.batch,
                payments: [
                    {
                        amount: Number(data.paymentAmount),
                        method: data.paymentMethod,
                        transactionId: data.transactionId || "",
                        paymentDate: data.paymentDate,
                        note: data.note || "",
                        month: data.month || "",
                    },
                ],
            };

            const response = await createOfflineEnrollment(enrollmentData);

            if (response?.error) {
                toast.error((response?.error as TError)?.data?.message);
            }

            if ((response?.data as TData<TOfflineEnrollment>)?.success) {
                Swal.fire({
                    title: "Enrolled!",
                    text: "Student has been enrolled successfully.",
                    icon: "success",
                });
                navigate("/offline-management");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="max-w-[720px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create Offline Enrollment
                </h3>
            </TitleCard>

            <Form
                onSubmit={handleCreate}
                resolver={zodResolver(enrollmentValidationSchema)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        name="studentName"
                        label="Student Name"
                        placeholder="Enter student name"
                    />
                    <InputField
                        name="phone"
                        label="Phone"
                        placeholder="Enter phone number"
                    />

                    <InputField
                        name="email"
                        label="Email (Optional)"
                        placeholder="Enter email address"
                    />
                    <InputField
                        name="address"
                        label="Address (Optional)"
                        placeholder="Enter address"
                    />
                    <NumberField
                        name="courseFee"
                        label="Course Fee"
                    />
                    <ClassSelectField />
                    <BatchSelectField />
                    <InputField
                        name="month"
                        label="Month (Optional)"
                        placeholder="e.g., January"
                    />
                    <NumberField
                        name="paymentAmount"
                        label="Payment Amount"
                    />
                    <SelectField
                        name="paymentMethod"
                        label="Payment Method"
                        placeholder="Select payment method"
                        options={[
                            { value: "Bkash", label: "Bkash" },
                            { value: "Nagad", label: "Nagad" },
                            { value: "Bank", label: "Bank" },
                            { value: "Cash", label: "Cash" },
                            { value: "paystation", label: "Paystation" },
                            { value: "Other", label: "Other" },
                        ]}
                    />
                    <InputField
                        name="transactionId"
                        label="Transaction ID"
                        placeholder="Enter transaction ID"
                    />
                    <DateTimeField
                        name="paymentDate"
                        label="Payment Date"
                    />
                    <InputField
                        name="note"
                        label="Note (Optional)"
                        placeholder="Enter payment note"
                    />
                </div>
                <div className="mt-5">
                    <FormButton>Create Enrollment</FormButton>
                </div>
            </Form>
        </div>
    );
};

export default OfflineEnrollmentCreate;
