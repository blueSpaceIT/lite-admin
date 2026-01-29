import { useNavigate, useParams } from "react-router-dom";
import type z from "zod";
import { liveClassService } from "../../../store/services/liveClassService";
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
import Editor from "../../../components/common/Form/Editor";
import Loader from "../../../components/common/Loader/Loader";

const LiveClassesCreate = () => {
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

    type TCreateLiveClassFromData = z.infer<
        typeof CourseContentResolvers.createCourseContentValidationSchema
    >;

    const defaultValues = {
        course: "",
        module: "",
        type: "Live Class" as const,
        content: {
            liveClass: {
                title: "",
                description: "",
                joinURL: "",
                joinID: "",
                passcode: "",
                startTime: "",
                endTime: "",
            },
        },
        scheduledAt: null,
    };

    if (module) {
        defaultValues.module = module.id;
        defaultValues.course = module.course.id;
    }

    const [createLiveClass] = liveClassService.useCreateLiveClassMutation();

    const createLiveClassHandler = async (data: TCreateLiveClassFromData) => {
        const toastId = toast.loading("Creating live class...");
        const payload = { ...data };

        if (!payload.content.liveClass?.description) {
            delete payload.content.liveClass?.description;
        }
        if (!payload.content.liveClass?.passcode) {
            delete payload.content.liveClass?.passcode;
        }
        if (!payload.content.liveClass?.joinID) {
            delete payload.content.liveClass?.joinID;
        }
        if (!payload?.scheduledAt) {
            delete payload.scheduledAt;
        }

        const result = await createLiveClass({ ...payload });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Live class created successfully", {
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
                    Create Live Class
                </h3>
            </TitleCard>

            {module ? (
                <Form<TCreateLiveClassFromData>
                    onSubmit={createLiveClassHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        CourseContentResolvers.createCourseContentValidationSchema
                    )}
                >
                    <InputField
                        name="content.liveClass.title"
                        placeholder="Title"
                        label="Title"
                    />
                    <Editor
                        name="content.liveClass.description"
                        label="Description"
                    />
                    <InputField
                        name="content.liveClass.joinURL"
                        placeholder="Join URL"
                        label="Join URL"
                    />
                    <InputField
                        name="content.liveClass.joinID"
                        placeholder="Join ID"
                        label="Join ID"
                    />
                    <InputField
                        name="content.liveClass.passcode"
                        placeholder="Passcode"
                        label="Passcode"
                    />
                    <DateTimeField
                        name="content.liveClass.startTime"
                        label="Start Time"
                    />
                    <DateTimeField
                        name="content.liveClass.endTime"
                        label="End Time"
                    />
                    <DateTimeField name="scheduledAt" label="Schedule At" />
                    <FormButton>Create Live Class</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default LiveClassesCreate;
