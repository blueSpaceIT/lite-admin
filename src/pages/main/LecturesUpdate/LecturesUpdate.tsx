import { useNavigate, useParams } from "react-router-dom";
import type z from "zod";
import { lectureService } from "../../../store/services/lectureService";
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
import TagField from "../../../components/common/Form/TagField";
import SwitchField from "../../../components/common/Form/SwitchField";

const LecturesUpdate = () => {
    const navigate = useNavigate();
    const { moduleID, lectureID } = useParams();
    const [lecture, setLecture] = useState<TCourseContent | null>(null);

    const { data, isSuccess, isError, error } =
        lectureService.useGetLectureQuery(lectureID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data) {
            setLecture(data?.data);
        }
    }, [isSuccess, data]);

    type TUpdateLectureFromData = z.infer<
        typeof CourseContentResolvers.updateCourseContentValidationSchema
    >;

    const defaultValues: Partial<TUpdateLectureFromData> = {
        content: {
            lecture: {
                title: lecture?.content.lecture?.title,
                server: lecture?.content.lecture?.server,
                video: lecture?.content.lecture?.video,
                duration: {
                    hours: lecture?.content.lecture?.duration?.hours,
                    minutes: lecture?.content.lecture?.duration?.minutes,
                    seconds: lecture?.content.lecture?.duration?.seconds,
                },
                isFree: lecture?.content.lecture?.isFree,
                tags: lecture?.content.lecture?.tags,
            },
        },
        scheduledAt: lecture?.scheduledAt
            ? new Date(lecture.scheduledAt).toISOString()
            : "",
    };

    const [updateLecture] = lectureService.useUpdateLectureMutation();

    const updateLectureHandler = async (data: TUpdateLectureFromData) => {
        const toastId = toast.loading("Updating lecture...");
        const payload = { ...data };

        const result = await updateLecture({
            id: lectureID,
            ...payload,
        });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Lecture updated successfully", {
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
                    Update Lecture
                </h3>
            </TitleCard>

            {lecture ? (
                <Form<TUpdateLectureFromData>
                    onSubmit={updateLectureHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        CourseContentResolvers.updateCourseContentValidationSchema
                    )}
                >
                    <InputField
                        name="content.lecture.title"
                        placeholder="Title"
                        label="Title"
                    />
                    <SelectField
                        name="content.lecture.server"
                        placeholder="Select Server"
                        label="Server"
                        options={[
                            { label: "YouTube", value: "YouTube" },
                            { label: "Vimeo", value: "Vimeo" },
                            { label: "Bunny", value: "Bunny" },
                        ]}
                    />
                    <InputField
                        name="content.lecture.video"
                        placeholder="Video ID or URL"
                        label="Video"
                    />
                    <div className="grid grid-cols-3 gap-4">
                        <NumberField
                            name="content.lecture.duration.hours"
                            label="Hours"
                        />
                        <NumberField
                            name="content.lecture.duration.minutes"
                            label="Minutes"
                        />
                        <NumberField
                            name="content.lecture.duration.seconds"
                            label="Seconds"
                        />
                    </div>
                    <SwitchField
                        name="content.lecture.isFree"
                        label="Is Free?"
                    />
                    <TagField
                        name="content.lecture.tags"
                        placeholder="Tags"
                        label="Tags"
                    />
                    <DateTimeField name="scheduledAt" label="Schedule At" />
                    <FormButton>Update Lecture</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default LecturesUpdate;
