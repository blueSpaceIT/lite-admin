import { useNavigate } from "react-router-dom";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import type { TCourse, TError, TBatch } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Form from "../../../components/common/Form/Form";
import InputField from "../../../components/common/Form/InputField";
import SelectField from "../../../components/common/Form/SelectField";
import FormButton from "../../../components/common/Form/FormButton";
import { PurchaseResolvers } from "../../../resolvers/purchase.resolvers";
import { courseService } from "../../../store/services/courseService";
import { purchaseService } from "../../../store/services/purchaseService";
import NumberField from "../../../components/common/Form/NumberField";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { batchService } from "../../../store/services/batchService";
import { Button } from "@headlessui/react";
import { useAppSelector } from "../../../store/hook";
import { useCurrentUser } from "../../../store/slices/authSlice";
import { studentService } from "../../../store/services/studentService";
import DateTimeField from "../../../components/common/Form/DateTimeField";
import type { TPaymentDetails } from "../../../types/order.types";

const PaymentDetails = () => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "paymentDetails",
    });
    const paymentDetails = useWatch({
        control,
        name: "paymentDetails",
    });

    return (
        <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Payment Details</h3>
            {fields.map((item, index) => (
                <div key={item.id} className="border p-4 rounded-md mb-4">
                    <div className="grid md:grid-cols-2 gap-x-4">
                        <SelectField
                            name={`paymentDetails.${index}.method`}
                            label="Payment Method"
                            placeholder="Select Method"
                            options={[
                                { label: "Cash", value: "Cash" },
                                { label: "Bkash", value: "Bkash" },
                                { label: "Nagad", value: "Nagad" },
                                { label: "Rocket", value: "Rocket" },
                            ]}
                        />
                        <NumberField
                            name={`paymentDetails.${index}.amount`}
                            label="Amount"
                        />
                    </div>
                    {paymentDetails?.[index]?.method !== "Cash" && (
                        <div className="grid md:grid-cols-2 gap-x-4">
                            <InputField
                                name={`paymentDetails.${index}.account`}
                                label="Account Number"
                                placeholder="Account Number"
                            />
                            <InputField
                                name={`paymentDetails.${index}.trxID`}
                                label="Transaction ID"
                                placeholder="Transaction ID"
                            />
                        </div>
                    )}
                    <Button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-primary text-white px-2 py-1 rounded"
                    >
                        Remove
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                onClick={() =>
                    append({
                        method: "Cash",
                        amount: 0,
                        account: "",
                        trxID: "",
                    })
                }
                className="bg-primary text-white px-2 py-1 rounded"
            >
                Add Payment
            </Button>
        </div>
    );
};

const BatchSelectField = ({ courseId }: { courseId: string }) => {
    const user = useAppSelector(useCurrentUser);
    const [options, setOptions] = useState<{ value: string; label: string }[]>(
        []
    );

    const { data: batchesData } = batchService.useGetBatchesQuery([
        ["course", courseId],
        ["branch", user?.branch?._id],
    ]);

    useEffect(() => {
        if (batchesData?.data) {
            const transformed = batchesData.data.result.map(
                (batch: TBatch) => ({
                    value: batch.id,
                    label: batch.name,
                })
            );
            setOptions(transformed);
        }
    }, [batchesData]);

    return (
        <SelectField
            name="batch"
            placeholder="Select Batch"
            label="Batch"
            options={options}
            disable={!options}
        />
    );
};

const CourseSelectField = ({
    setCourse,
}: {
    setCourse: React.Dispatch<React.SetStateAction<TCourse | null>>;
}) => {
    const [search, setSearch] = useState<string>("");
    const [options, setOptions] = useState<{ value: string; label: string }[]>(
        []
    );
    const [debouncedSearchTerm] = useDebounce(search, 500);

    const { data: coursesData } = courseService.useGetCoursesQuery(
        debouncedSearchTerm
            ? [
                  ["searchTerm", debouncedSearchTerm],
                  ["type", "Offline"],
              ]
            : [["type", "Offline"]]
    );

    useEffect(() => {
        if (coursesData?.data) {
            const transformed = coursesData.data.result.map(
                (course: TCourse) => ({
                    value: course.id,
                    label: course.name,
                })
            );
            setOptions(transformed);
        }
    }, [coursesData]);

    type TCreatePurchaseFromData = z.infer<
        typeof PurchaseResolvers.createPurchaseValidationSchema
    >;
    const { setValue } = useFormContext<TCreatePurchaseFromData>();

    const onChangeHandler = (id: string) => {
        const course = coursesData?.data?.result.find(
            (item: TCourse) => item.id === id
        );
        if (course) {
            setValue("price", course.offerPrice || course.price || 0);
            setValue("course", course.id);
            setCourse(course);
        }
    };

    return (
        <SelectField
            name="course"
            placeholder="Select Course"
            label="Course"
            onSearch={setSearch}
            options={options}
            onChange={onChangeHandler}
            disable={!options}
        />
    );
};

const InnerForm = ({
    setCourse,
    course,
}: {
    setCourse: React.Dispatch<React.SetStateAction<TCourse | null>>;
    course: TCourse | null;
}) => {
    const { watch, setValue } = useFormContext();

    const price = watch("price");
    const discount = watch("discount");
    const paymentDetails = watch("paymentDetails") || [];

    const totalPaid = paymentDetails.reduce(
        (sum: number, p: TPaymentDetails) => sum + Number(p.amount || 0),
        0
    );
    const netAmount = Number(price || 0) - Number(discount || 0);

    useEffect(() => {
        if (totalPaid === netAmount) {
            setValue("dueDate", null);
        }
    }, [totalPaid, netAmount, setValue]);

    return (
        <>
            <div className="grid md:grid-cols-2 gap-x-4">
                <InputField
                    name="name"
                    placeholder="Student Name"
                    label="Name"
                />
                <InputField
                    name="phone"
                    placeholder="Student Phone"
                    label="Phone"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-x-4">
                <CourseSelectField setCourse={setCourse} />
                {course?.type === "Offline" && course?._id && (
                    <BatchSelectField courseId={course._id} />
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-x-4">
                <NumberField name="price" label="Price" />
                <NumberField name="discount" label="Discount" />
            </div>

            <PaymentDetails />

            {totalPaid !== netAmount && (
                <DateTimeField name="dueDate" label="Due Date" />
            )}

            <FormButton>Enroll</FormButton>
        </>
    );
};

const NewEnroll = () => {
    const navigate = useNavigate();
    const user = useAppSelector(useCurrentUser);
    const [course, setCourse] = useState<TCourse | null>(null);

    type TCreatePurchaseFromData = z.infer<
        typeof PurchaseResolvers.createPurchaseValidationSchema
    >;

    const defaultValues: Partial<TCreatePurchaseFromData> = {
        name: "",
        phone: "",
        course: null,
        batch: null,
        branch: user?.branch?.id || null,
        price: 0,
        discount: 0,
        status: "Active",
        paymentDetails: [],
        dueDate: null,
    };

    const [createPurchase] = purchaseService.useCreatePurchaseMutation();
    const [upsertStudent] = studentService.useUpsertStudentMutation();

    const createPurchaseHandler = async (data: TCreatePurchaseFromData) => {
        const toastId = toast.loading("Enrolling...");
        const payload = { ...data };

        if (!payload.discount) delete payload.discount;
        if (!payload.dueDate) delete payload.dueDate;

        if (!payload.batch) {
            toast.error("Batch required", {
                id: toastId,
            });
            return;
        }

        if (!payload.branch) {
            toast.error("Branch required", {
                id: toastId,
            });
            return;
        }

        const netAmount =
            Number(payload.price || 0) - Number(payload.discount || 0);
        if (netAmount > 0 && payload?.paymentDetails?.length === 0) {
            toast.error("Must one payment", {
                id: toastId,
            });
            return;
        }

        const totalPaid =
            payload?.paymentDetails?.reduce(
                (sum: number, p: TPaymentDetails) =>
                    sum + Number(p.amount || 0),
                0
            ) || 0;

        if (totalPaid > netAmount) {
            toast.error("Total payment exceed. Recheck amounts", {
                id: toastId,
            });
            return;
        }

        if (totalPaid !== netAmount && !payload.dueDate) {
            toast.error("Due date is required when there is due amount", {
                id: toastId,
            });
            return;
        }

        const student = await upsertStudent({
            name: payload.name,
            phone: payload.phone,
        });

        if (student?.error) {
            toast.error((student.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (student?.data) {
            const result = await createPurchase(payload);

            if (result?.error) {
                toast.error((result.error as TError)?.data?.message, {
                    id: toastId,
                });
            }

            if (result?.data) {
                toast.success("Enrollment successful", { id: toastId });
                window.open(`/print-reciept/${result.data.data.id}`, "_blank");
                navigate("/payments", { replace: true });
            }
        }
    };

    return (
        <div className="max-w-[920px] lg:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    New Enroll
                </h3>
            </TitleCard>

            <Form<TCreatePurchaseFromData>
                onSubmit={createPurchaseHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(
                    PurchaseResolvers.createPurchaseValidationSchema
                )}
            >
                <InnerForm setCourse={setCourse} course={course} />
            </Form>
        </div>
    );
};

export default NewEnroll;
