import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { IoCardOutline } from "react-icons/io5";
import Form from "../../../../components/common/Form/Form";
import type { TError, TPurchase } from "../../../../types";
import type z from "zod";
import { PurchaseResolvers } from "../../../../resolvers/purchase.resolvers";
import { purchaseService } from "../../../../store/services/purchaseService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../../components/common/Form/InputField";
import SelectField from "../../../../components/common/Form/SelectField";
import NumberField from "../../../../components/common/Form/NumberField";
import { useFormContext, useWatch } from "react-hook-form";
import DateTimeField from "../../../../components/common/Form/DateTimeField";

const DuePayForm = ({ purchase }: { purchase: TPurchase }) => {
    const { control } = useFormContext();
    const paymentDetails = useWatch({
        control,
        name: "paymentDetails",
    });
    const dueAmount = purchase.totalAmount - purchase.paidAmount;

    return (
        <div>
            <SelectField
                name={`paymentDetails.method`}
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
                name={`paymentDetails.amount`}
                label="Paid Amount"
                min={0}
                max={dueAmount}
            />
            {paymentDetails.method !== "Cash" && (
                <div className="grid md:grid-cols-2 gap-x-4">
                    <InputField
                        name={`paymentDetails.account`}
                        label="Account Number"
                        placeholder="Account Number"
                    />
                    <InputField
                        name={`paymentDetails.trxID`}
                        label="Transaction ID"
                        placeholder="Transaction ID"
                    />
                </div>
            )}
            {paymentDetails.amount !== dueAmount && (
                <DateTimeField name="dueDate" label="Due Date" />
            )}
        </div>
    );
};

const DuePayModal = ({ purchase }: { purchase: TPurchase }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dueAmount = purchase.totalAmount - purchase.paidAmount;

    const defaultValues = {
        paymentDetails: {
            method: "Cash" as "Cash" | "Bkash" | "Nagad" | "Rocket",
            amount: purchase.totalAmount - purchase.paidAmount,
        },
    };

    type TUpdatePurchaseFromData = z.infer<
        typeof PurchaseResolvers.updatePurchaseValidationSchema
    >;

    const [updatePurchase] = purchaseService.useUpdatePurchaseMutation();

    const updatePurchaseHandler = async (data: TUpdatePurchaseFromData) => {
        setIsOpen(false);
        const toastId = toast.loading("Wait a while");

        if (Number(data.paymentDetails?.amount) > dueAmount) {
            toast.error("Total payment exceed. Recheck amounts", {
                id: toastId,
            });
            return;
        }

        const result = await updatePurchase({ id: purchase.id, ...data });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Update successful", {
                id: toastId,
            });
            window.open(`/print-reciept/${purchase.id}`, "_blank");
            navigate("/payments", { replace: true });
        }
    };

    return (
        <div>
            <Button
                onClick={() => setIsOpen(true)}
                className="text-purple-600 bg-purple-100 hover:bg-purple-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
            >
                <IoCardOutline className="w-4 h-4" />
            </Button>

            <Dialog
                open={isOpen}
                as="div"
                className="relative z-40 focus:outline-none"
                onClose={() => setIsOpen(false)}
            >
                <div className="fixed inset-0 z-50 w-screen bg-black/40 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle
                                as="h3"
                                className="text-base/7 font-medium text-indigo-600"
                            >
                                Payment Modal
                            </DialogTitle>
                            <Form<TUpdatePurchaseFromData>
                                onSubmit={updatePurchaseHandler}
                                defaultValues={defaultValues}
                                resolver={zodResolver(
                                    PurchaseResolvers.updatePurchaseValidationSchema
                                )}
                            >
                                <DuePayForm purchase={purchase} />
                                <div className="flex justify-end items-center gap-2 mt-4">
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-slate-200 px-3 py-1.5 text-sm/6 font-semibold text-slate-700 shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white cursor-pointer"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-rose-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white cursor-pointer"
                                        type="submit"
                                    >
                                        Update Payment
                                    </Button>
                                </div>
                            </Form>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default DuePayModal;
