import { useNavigate, useParams } from "react-router-dom";
import type z from "zod";
import { noteService } from "../../../store/services/noteService";
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
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "../../../store/hook";
import { useCurrentToken } from "../../../store/slices/authSlice";
import type { UploadProps } from "antd";
import PDFUploader from "../../../features/uploader/PDFUploader";

const NotePDFUploader = () => {
    type TCreateNoteFromData = z.infer<
        typeof CourseContentResolvers.createCourseContentValidationSchema
    >;
    const { setValue } = useFormContext<TCreateNoteFromData>();
    const token = useAppSelector(useCurrentToken);
    const uploadHandler: UploadProps["onChange"] = (info) => {
        if (info.file.status === "done") {
            toast.success("PDF upload successful");
            setValue("content.note.pdfURL", info.file.response.data.result);
        } else if (info.file.status === "error") {
            toast.error("PDF upload failed");
        }
    };

    return (
        <div className="my-4">
            <PDFUploader
                token={token as string}
                actionHandler={uploadHandler}
            />
        </div>
    );
};

const NotesCreate = () => {
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

    type TCreateNoteFromData = z.infer<
        typeof CourseContentResolvers.createCourseContentValidationSchema
    >;

    const defaultValues = {
        course: "",
        module: "",
        type: "Note" as const,
        content: {
            note: {
                title: "",
                description: "",
                pdfURL: "",
            },
        },
        scheduledAt: null,
    };

    if (module) {
        defaultValues.module = module.id;
        defaultValues.course = module.course.id;
    }

    const [createNote] = noteService.useCreateNoteMutation();

    const createNoteHandler = async (data: TCreateNoteFromData) => {
        const toastId = toast.loading("Creating note...");
        const payload = { ...data };

        if (!payload.content.note?.description) {
            delete payload.content.note?.description;
        }
        if (!payload?.scheduledAt) {
            delete payload.scheduledAt;
        }

        const result = await createNote({ ...payload });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Note created successfully", {
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
                    Create Note
                </h3>
            </TitleCard>

            {module ? (
                <Form<TCreateNoteFromData>
                    onSubmit={createNoteHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        CourseContentResolvers.createCourseContentValidationSchema
                    )}
                >
                    <InputField
                        name="content.note.title"
                        placeholder="Title"
                        label="Title"
                    />
                    <Editor
                        name="content.note.description"
                        label="Description"
                    />
                    <NotePDFUploader />
                    <DateTimeField name="scheduledAt" label="Schedule At" />
                    <FormButton>Create Note</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default NotesCreate;
