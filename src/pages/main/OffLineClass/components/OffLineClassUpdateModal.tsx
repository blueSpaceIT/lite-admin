import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import Form from "../../../../components/common/Form/Form";
import InputField from "../../../../components/common/Form/InputField";
import { OfflineClassResolvers } from "../../../../resolvers/offlineClass.resolvers";
import { offlineClassService } from "../../../../store/services/offlineClassService";
import type { TData, TError, TOfflineClass } from "../../../../types";

const OffLineClassUpdateModal = ({ item }: { item: TOfflineClass }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [updateOfflineClass] = offlineClassService.useUpdateOfflineClassMutation();

    const defaultValues = {
        title: item.title,
    };

    const handleUpdate = async (data: any) => {
        try {
            const response = await updateOfflineClass({ id: item._id, ...data });

            if (response?.error) {
                toast.error((response?.error as TError)?.data?.message || "Update failed");
            }

            if ((response?.data as TData<TOfflineClass>)?.success) {
                Swal.fire({
                    title: "Updated!",
                    text: "Class has been updated successfully.",
                    icon: "success",
                });
                setIsOpen(false);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="text-blue-600 bg-blue-100 hover:bg-blue-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center cursor-pointer"
                title="Edit Class"
            >
                <FaEdit className="w-4 h-4" />
            </Button>

            <Dialog
                open={isOpen}
                as="div"
                className="relative z-50 focus:outline-none"
                onClose={() => setIsOpen(false)}
            >
                <div className="fixed inset-0 z-50 w-screen bg-black/40 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            <DialogTitle
                                as="h3"
                                className="text-xl font-bold text-slate-900 border-b pb-3 mb-5"
                            >
                                Update Class
                            </DialogTitle>
                            <Form
                                onSubmit={handleUpdate}
                                defaultValues={defaultValues}
                                resolver={zodResolver(
                                    OfflineClassResolvers.updateOfflineClassValidationSchema
                                )}
                            >
                                <InputField
                                    name="title"
                                    placeholder="Enter class title"
                                    label="Class Title"
                                />
                                <div className="flex justify-end items-center gap-2 mt-6">
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition-colors cursor-pointer"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                        type="submit"
                                    >
                                        Update Class
                                    </Button>
                                </div>
                            </Form>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default OffLineClassUpdateModal;
