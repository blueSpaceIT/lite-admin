import { useNavigate, useParams } from "react-router-dom";
import type z from "zod";
import { examService } from "../../../store/services/examService";
import toast from "react-hot-toast";
import type { TError, TModule } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import FormButton from "../../../components/common/Form/FormButton";
import { CourseContentResolvers } from "../../../resolvers/courseContent.resolvers";
import { useEffect, useState } from "react";
import { moduleService } from "../../../store/services/moduleService";
import { useError } from "../../../hooks";
import DateTimeField from "../../../components/common/Form/DateTimeField";
import Loader from "../../../components/common/Loader/Loader";
import SelectField from "../../../components/common/Form/SelectField";
import NumberField from "../../../components/common/Form/NumberField";
import Editor from "../../../components/common/Form/Editor";

const ExamsCreate = () => {
    const navigate = useNavigate();
    const { moduleID } = useParams();
    const [module, setModule] = useState<TModule | null>(null);

    const { data, isSuccess, isError, error } =
        moduleService.useGetModuleQuery(moduleID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data) {
            setModule(data?.data);
        }
    }, [isSuccess, data]);

    type TCreateExamFromData = z.infer<
        typeof CourseContentResolvers.createCourseContentValidationSchema
    >;

    const defaultValues = {
        course: "",
        module: "",
        type: "Exam" as const,
        content: {
            exam: {
                title: "",
                description: "",
                type: "MCQ" as const,
                totalQuestions: 0,
                totalMarks: 0,
                passingMarks: 0,
                positiveMarks: 1,
                negativeMarks: 0,
                duration: {
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                },
                validity: "",
            },
        },
        scheduledAt: null,
    };

    if (module) {
        defaultValues.module = module.id;
        defaultValues.course = module.course.id;
    }

    const [createExam] = examService.useCreateExamMutation();

    const createExamHandler = async (data: TCreateExamFromData) => {
        const toastId = toast.loading("Creating exam...");
        const payload = { ...data };

        if (!payload.content.exam?.description) {
            delete payload.content.exam?.description;
        }
        if (!payload?.scheduledAt) {
            delete payload.scheduledAt;
        }

        const result = await createExam({ ...payload });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Exam created successfully", {
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
                    Create Exam
                </h3>
            </TitleCard>

            {module ? (
                <Form<TCreateExamFromData>
                    onSubmit={createExamHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        CourseContentResolvers.createCourseContentValidationSchema
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
                    <FormButton>Create Exam</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default ExamsCreate;
