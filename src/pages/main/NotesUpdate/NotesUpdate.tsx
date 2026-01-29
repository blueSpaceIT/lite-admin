import { useNavigate, useParams } from "react-router-dom";
import type z from "zod";
import { noteService } from "../../../store/services/noteService";
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
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "../../../store/hook";
import { useCurrentToken } from "../../../store/slices/authSlice";
import type { UploadProps } from "antd";
import PDFUploader from "../../../features/uploader/PDFUploader";

const NotePDFUploader = () => {
    type TUpdateNoteFromData = z.infer<
        typeof CourseContentResolvers.updateCourseContentValidationSchema
    >;
    const { setValue } = useFormContext<TUpdateNoteFromData>();
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

const NotesUpdate = () => {
    const navigate = useNavigate();
    const { moduleID, noteID } = useParams();
    const [note, setNote] = useState<TCourseContent | null>(null);

    const { data, isSuccess, isError, error } =
        noteService.useGetNoteQuery(noteID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data) {
            setNote(data?.data);
        }
    }, [isSuccess, data]);

    type TUpdateNoteFromData = z.infer<
        typeof CourseContentResolvers.updateCourseContentValidationSchema
    >;

    const defaultValues: Partial<TUpdateNoteFromData> = {
        content: {
            note: {
                title: note?.content.note?.title,
                description: note?.content.note?.description,
                pdfURL: note?.content.note?.pdfURL,
            },
        },
        scheduledAt: note?.scheduledAt
            ? new Date(note.scheduledAt).toISOString()
            : "",
    };

    const [updateNote] = noteService.useUpdateNoteMutation();

    const updateNoteHandler = async (data: TUpdateNoteFromData) => {
        const toastId = toast.loading("Updating note...");
        const payload = { ...data };

        if (payload.content?.note && !payload.content.note.description) {
            delete payload.content.note.description;
        }

        const result = await updateNote({
            id: noteID,
            ...payload,
        });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Note updated successfully", {
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
                    Update Note
                </h3>
            </TitleCard>

            {note ? (
                <Form<TUpdateNoteFromData>
                    onSubmit={updateNoteHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        CourseContentResolvers.updateCourseContentValidationSchema
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
                    <FormButton>Update Note</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default NotesUpdate;
