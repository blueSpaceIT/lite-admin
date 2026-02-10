import { useNavigate, useParams } from "react-router-dom";
import type z from "zod";
import { liveClassService } from "../../../store/services/liveClassService";
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
import Editor from "../../../components/common/Form/Editor";
import Loader from "../../../components/common/Loader/Loader";

const LiveClassesUpdate = () => {
    const navigate = useNavigate();
    const { moduleID, liveClassID } = useParams();
    const [liveClass, setLiveClass] = useState<TCourseContent | null>(null);

    const { data, isSuccess, isError, error } =
        liveClassService.useGetLiveClassQuery(liveClassID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data) {
            setLiveClass(data?.data);
        }
    }, [isSuccess, data]);

    type TUpdateLiveClassFromData = z.infer<
        typeof CourseContentResolvers.updateCourseContentValidationSchema
    >;

    const defaultValues: Partial<TUpdateLiveClassFromData> = {
        content: {
            liveClass: {
                title: liveClass?.content.liveClass?.title,
                description: liveClass?.content.liveClass?.description,
                joinURL: liveClass?.content.liveClass?.joinURL,
                joinID: liveClass?.content.liveClass?.joinID,
                passcode: liveClass?.content.liveClass?.passcode,
                startTime: liveClass?.content.liveClass?.startTime
                    ? new Date(
                        liveClass.content.liveClass.startTime
                    ).toISOString()
                    : "",
                endTime: liveClass?.content.liveClass?.endTime
                    ? new Date(
                        liveClass.content.liveClass.endTime
                    ).toISOString()
                    : "",
            },
        },
        scheduledAt: liveClass?.scheduledAt
            ? new Date(liveClass.scheduledAt).toISOString()
            : "",
    };

    const [updateLiveClass] = liveClassService.useUpdateLiveClassMutation();

    const updateLiveClassHandler = async (data: TUpdateLiveClassFromData) => {
        const toastId = toast.loading("Updating live class...");
        const payload = { ...data };

        const result = await updateLiveClass({
            id: liveClassID,
            ...payload
        });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Live class updated successfully", {
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
                    Update Live Class
                </h3>
            </TitleCard>

            {liveClass ? (
                <Form<TUpdateLiveClassFromData>
                    onSubmit={updateLiveClassHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        CourseContentResolvers.updateCourseContentValidationSchema
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
                    <FormButton>Update Live Class</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default LiveClassesUpdate;
