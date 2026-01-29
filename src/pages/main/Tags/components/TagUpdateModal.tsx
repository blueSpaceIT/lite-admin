import { useState } from "react";
import type { TError, TTag } from "../../../../types";
import type z from "zod";
import { TagResolvers } from "../../../../resolvers/tag.resolvers";
import { tagService } from "../../../../store/services/tagService";
import toast from "react-hot-toast";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { FaRegEdit } from "react-icons/fa";
import Form from "../../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../../components/common/Form/InputField";

const TagUpdateModal = ({ tag }: { tag: TTag }) => {
    const [isOpen, setIsOpen] = useState(false);

    const defaultValues = {
        name: tag.name,
    };

    type TUpdateTagFromData = z.infer<
        typeof TagResolvers.updateTagValidationSchema
    >;

    const [updateTag] = tagService.useUpdateTagMutation();

    const updateTagHandler = async (data: TUpdateTagFromData) => {
        setIsOpen(false);
        const toastId = toast.loading("Wait a while");

        const result = await updateTag({ id: tag.id, ...data });
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
    };

    return (
        <div>
            <Button
                onClick={() => setIsOpen(true)}
                className="text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
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
                            className="w-full max-w-md rounded-xl bg-white p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle
                                as="h3"
                                className="text-base/7 font-medium text-indigo-600"
                            >
                                Update Tag Modal
                            </DialogTitle>
                            <Form<TUpdateTagFromData>
                                onSubmit={updateTagHandler}
                                defaultValues={defaultValues}
                                resolver={zodResolver(
                                    TagResolvers.updateTagValidationSchema
                                )}
                            >
                                <InputField
                                    name="name"
                                    placeholder="Tag Name"
                                    label="Name"
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
                                        Update Module
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

export default TagUpdateModal;
