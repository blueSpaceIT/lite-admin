import { useNavigate, useParams } from "react-router-dom";
import type z from "zod";
import { examService } from "../../../store/services/examService";
import toast from "react-hot-toast";
import type { TError, TCourseContent } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import FormButton from "../../../components/common/Form/FormButton";
import { CourseContentResolvers } from "../../../resolvers/courseContent.resolvers";
import { useEffect, useState } from "react";
import { useError } from "../../../hooks";
import DateTimeField from "../../../components/common/Form/DateTimeField";
import Loader from "../../../components/common/Loader/Loader";
import SelectField from "../../../components/common/Form/SelectField";
import NumberField from "../../../components/common/Form/NumberField";
import Editor from "../../../components/common/Form/Editor";

const ExamsUpdate = () => {
    const navigate = useNavigate();
    const { moduleID, examID } = useParams();
    const [exam, setExam] = useState<TCourseContent | null>(null);

    const { data, isSuccess, isError, error } =
        examService.useGetExamQuery(examID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data) {
            setExam(data?.data);
        }
    }, [isSuccess, data]);

    type TUpdateExamFromData = z.infer<
        typeof CourseContentResolvers.updateCourseContentValidationSchema
    >;

    const defaultValues: Partial<TUpdateExamFromData> = {
        content: {
            exam: {
                title: exam?.content.exam?.title,
                description: exam?.content.exam?.description,
                type: exam?.content.exam?.type,
                totalQuestions: exam?.content.exam?.totalQuestions,
                totalMarks: exam?.content.exam?.totalMarks,
                passingMarks: exam?.content.exam?.passingMarks,
                positiveMarks: exam?.content.exam?.positiveMarks,
                negativeMarks: exam?.content.exam?.negativeMarks,
                duration: {
                    hours: exam?.content.exam?.duration?.hours,
                    minutes: exam?.content.exam?.duration?.minutes,
                    seconds: exam?.content.exam?.duration?.seconds,
                },
                validity: exam?.content.exam?.validity
                    ? new Date(exam.content.exam.validity).toISOString()
                    : "",
            },
        },
        scheduledAt: exam?.scheduledAt
            ? new Date(exam.scheduledAt).toISOString()
            : "",
    };

    const [updateExam] = examService.useUpdateExamMutation();

    const updateExamHandler = async (data: TUpdateExamFromData) => {
        const toastId = toast.loading("Updating exam...");
        const payload = { ...data };

        const result = await updateExam({
            id: examID,
            ...payload,
        });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Exam updated successfully", {
                id: toastId,
            });
            navigate(`/module/${moduleID}`, {
                replace: true,
            });
        }
    };

    return (
        <div className="max-w-[720px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Update Exam
                </h3>
            </TitleCard>

            {exam ? (
                <Form<TUpdateExamFromData>
                    onSubmit={updateExamHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        CourseContentResolvers.updateCourseContentValidationSchema
                    )}
                >
                    <InputField
                        name="content.exam.title"
                        placeholder="Title"
                        label="Title"
                    />
                    <Editor
                        name="content.exam.description"
                        label="Description"
                    />
                    <SelectField
                        name="content.exam.type"
                        label="Exam Type"
                        placeholder="Select Type"
                        options={[
                            { label: "MCQ", value: "MCQ" },
                            { label: "CQ", value: "CQ" },
                            { label: "Gaps", value: "Gaps" },
                        ]}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <NumberField
                            name="content.exam.totalQuestions"
                            label="Total Questions"
                        />
                        <NumberField
                            name="content.exam.totalMarks"
                            label="Total Marks"
                        />
                        <NumberField
                            name="content.exam.passingMarks"
                            label="Passing Marks"
                        />
                        <NumberField
                            name="content.exam.positiveMarks"
                            label="Positive Marks"
                        />
                        <NumberField
                            name="content.exam.negativeMarks"
                            label="Negative Marks"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <NumberField
                            name="content.exam.duration.hours"
                            label="Hours"
                        />
                        <NumberField
                            name="content.exam.duration.minutes"
                            label="Minutes"
                        />
                        <NumberField
                            name="content.exam.duration.seconds"
                            label="Seconds"
                        />
                    </div>
                    <DateTimeField
                        name="content.exam.validity"
                        label="Validity"
                    />
                    <DateTimeField name="scheduledAt" label="Schedule At" />
                    <FormButton>Update Exam</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default ExamsUpdate;
