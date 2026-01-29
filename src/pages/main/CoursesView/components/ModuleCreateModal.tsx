import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { TError } from "../../../../types";
import { useState } from "react";
import { ModuleResolvers } from "../../../../resolvers/module.resolvers";
import type z from "zod";
import { moduleService } from "../../../../store/services/moduleService";
import toast from "react-hot-toast";
import Form from "../../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../../components/common/Form/InputField";

const ModuleCreateModal = ({ courseID }: { courseID: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    const defaultValues = {
        name: "",
        course: courseID,
    };

    type TCreateModuleFromData = z.infer<
        typeof ModuleResolvers.createModuleValidationSchema
    >;

    const [createModule] = moduleService.useCreateModuleMutation();

    const createModuleHandler = async (data: TCreateModuleFromData) => {
        setIsOpen(false);
        const toastId = toast.loading("Wait a while");

        const result = await createModule(data);
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Create successful", {
                id: toastId,
            });
        }
    };

    return (
        <div>
            <Button
                onClick={() => setIsOpen(true)}
                className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer"
            >
                Create Module
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
                                Create Module Modal
                            </DialogTitle>
                            <Form<TCreateModuleFromData>
                                onSubmit={createModuleHandler}
                                defaultValues={defaultValues}
                                resolver={zodResolver(
                                    ModuleResolvers.createModuleValidationSchema
                                )}
                            >
                                <InputField
                                    name="name"
                                    placeholder="Course Title"
                                    label="Title"
                                />
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
                                        Create Module
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

export default ModuleCreateModal;
