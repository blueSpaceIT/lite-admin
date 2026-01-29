import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Form from "../../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseResolvers } from "../../../../resolvers/course.resolvers";
import NumberField from "../../../../components/common/Form/NumberField";
import { useState } from "react";
import type { TCourse, TError } from "../../../../types";
import { courseService } from "../../../../store/services/courseService";
import toast from "react-hot-toast";
import type z from "zod";

const CourseDetailsUpdateModal = ({ course }: { course: TCourse }) => {
    const [isOpen, setIsOpen] = useState(false);

    const defaultValues = {
        details: {
            totalClasses: course?.details?.totalClasses || 0,
            totalLiveClasses: course?.details?.totalLiveClasses || 0,
            totalLectures: course?.details?.totalLectures || 0,
            totalNotes: course?.details?.totalNotes || 0,
            totalExams: course?.details?.totalExams || 0,
        },
    };

    type TUpdateCourseDetailsFromData = z.infer<
        typeof CourseResolvers.courseDetailsValidationSchema
    >;

    const [updateCourse] = courseService.useUpdateCourseDetailsMutation();

    const updateCourseDetailsHandler = async (
        data: TUpdateCourseDetailsFromData
    ) => {
        setIsOpen(false);
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };
        if (!payload?.details?.totalClasses) {
            delete payload?.details?.totalClasses;
        }
        if (!payload?.details?.totalLiveClasses) {
            delete payload?.details?.totalLiveClasses;
        }
        if (!payload?.details?.totalLectures) {
            delete payload?.details?.totalLectures;
        }
        if (!payload?.details?.totalNotes) {
            delete payload?.details?.totalNotes;
        }
        if (!payload?.details?.totalExams) {
            delete payload?.details?.totalExams;
        }

        const result = await updateCourse({ id: course.id, ...payload });
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

        window.location.href = "/course/" + course.id;
    };

    return (
        <div>
            <Button
                onClick={() => setIsOpen(true)}
                className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer"
            >
                Update Course Details
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
                                Update Course Details Modal
                            </DialogTitle>
                            <Form<TUpdateCourseDetailsFromData>
                                onSubmit={updateCourseDetailsHandler}
                                defaultValues={defaultValues}
                                resolver={zodResolver(
                                    CourseResolvers.courseDetailsValidationSchema
                                )}
                            >
                                <div className="grid grid-cols-2 gap-2">
                                    <NumberField
                                        name="details.totalClasses"
                                        label="Total Classes"
                                    />
                                    <NumberField
                                        name="details.totalLiveClasses"
                                        label="Total Live Classes"
                                    />
                                    <NumberField
                                        name="details.totalLectures"
                                        label="Total Lectures"
                                    />
                                    <NumberField
                                        name="details.totalNotes"
                                        label="Total Notes"
                                    />
                                    <NumberField
                                        name="details.totalExams"
                                        label="Total Exams"
                                    />
                                </div>
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
                                        Update Details
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

export default CourseDetailsUpdateModal;
