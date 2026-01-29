import { useState } from "react";
import type { TOrder } from "../../../../../types/order.types";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { FaRegEdit } from "react-icons/fa";
import z from "zod";
import { OrderResolvers } from "../../../../../resolvers/order.resolvers";
import { orderService } from "../../../../../store/services/orderService";
import toast from "react-hot-toast";
import Form from "../../../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../../../components/common/Form/InputField";
import TextareaField from "../../../../../components/common/Form/TextareaField";
import SelectField from "../../../../../components/common/Form/SelectField";
import FormButton from "../../../../../components/common/Form/FormButton";
import type { TError } from "../../../../../types";

const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "On Hold", value: "On Hold" },
    { label: "Accepted", value: "Accepted" },
    { label: "Cancelled", value: "Cancelled" },
    { label: "Out for delivery", value: "Out for delivery" },
    { label: "Delivered", value: "Delivered" },
];

const payStatusOptions = [
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "Pending" },
    { label: "Refunded", value: "Refunded" },
];

const OrderUpdateModal = ({ order }: { order: TOrder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const defaultValues = {
        phone: order.phone || "",
        address: order.address || "",
        area: order.area || "Dhaka",
        status: order.status || "Pending",
        payStatus: order.payStatus || "Pending",
    };

    type TUpdateOrderFormData = z.infer<
        typeof OrderResolvers.updateOrderValidationSchema
    >;

    const [updateOrder] = orderService.useUpdateOrderMutation();

    const updateOrderHandler = async (data: TUpdateOrderFormData) => {
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };
        if (payload.payStatus === "Paid") {
            payload.paymentDetails = [
                {
                    method: "Cash",
                    amount: order.totalAmount,
                },
            ];
        }

        const result = await updateOrder({ id: order.id, ...payload });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Update successful", {
                id: toastId,
            });
        }

        setIsOpen(false);
    };

    return (
        <div>
            <Button
                onClick={() => setIsOpen(true)}
                className="text-blue-600 bg-blue-100 hover:bg-blue-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
            >
                <FaRegEdit className="w-4 h-4" />
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
                            className="w-full max-w-2xl rounded-xl bg-white p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle
                                as="h3"
                                className="text-base/7 font-medium text-indigo-600"
                            >
                                Edit | {order.id}
                            </DialogTitle>
                            <div>
                                <div className="py-6">
                                    <Form<TUpdateOrderFormData>
                                        onSubmit={updateOrderHandler}
                                        defaultValues={defaultValues}
                                        resolver={zodResolver(
                                            OrderResolvers.updateOrderValidationSchema
                                        )}
                                    >
                                        <InputField
                                            name="phone"
                                            placeholder="Phone Number"
                                            label="Phone Number"
                                        />
                                        <TextareaField
                                            name="address"
                                            placeholder="Address"
                                            label="Address"
                                        />
                                        <SelectField
                                            name="status"
                                            options={statusOptions}
                                            placeholder="Select Status"
                                            label="Status"
                                        />
                                        <SelectField
                                            name="payStatus"
                                            options={payStatusOptions}
                                            placeholder="Select Pay Status"
                                            label="Payment Status"
                                        />
                                        <FormButton>Update Order</FormButton>
                                    </Form>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default OrderUpdateModal;
