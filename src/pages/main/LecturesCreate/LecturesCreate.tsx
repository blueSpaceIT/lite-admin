/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import type z from "zod";

import DateTimeField from "../../../components/common/Form/DateTimeField";
import Form from "../../../components/common/Form/Form";
import FormButton from "../../../components/common/Form/FormButton";
import InputField from "../../../components/common/Form/InputField";
import NumberField from "../../../components/common/Form/NumberField";
import SelectField from "../../../components/common/Form/SelectField";
import SwitchField from "../../../components/common/Form/SwitchField";
import TagField from "../../../components/common/Form/TagField";
import Loader from "../../../components/common/Loader/Loader";
import TitleCard from "../../../components/common/TitleCard/TitleCard";

import { CourseContentResolvers } from "../../../resolvers/courseContent.resolvers";
import { uploadVideoInChunksRTK } from "../../../store/api/uploadVideoInChunksRTK";
import {
  useCreateLectureMutation,
  useFinalizeUploadMutation,
  useUploadChunkMutation,
} from "../../../store/services/lectureService";
import { moduleService } from "../../../store/services/moduleService";
import type { TModule } from "../../../types";

/* =========================
   MAIN COMPONENT
========================= */
const LecturesCreate = () => {
  const navigate = useNavigate();
  const { moduleID } = useParams();
  const [module, setModule] = useState<TModule | null>(null);

  const { data, isSuccess } = moduleService.useGetModuleQuery(moduleID);

  // Upload state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");

  useEffect(() => {
    if (isSuccess && data) setModule(data.data);
  }, [isSuccess, data]);

  type TFormData = z.infer<
    typeof CourseContentResolvers.createCourseContentValidationSchema
  >;

  const defaultValues: TFormData = {
    course: module?.course.id || "",
    module: module?.id || "",
    type: "Lecture",
    content: {
      lecture: {
        title: "",
        server: "YouTube",
        video: "",
        videoFile: undefined,
        duration: { hours: 0, minutes: 0, seconds: 0 },
        isFree: false,
        tags: [],
      },
    },
    scheduledAt: null,
  };

  const [createLecture] = useCreateLectureMutation();
  const [uploadChunk] = useUploadChunkMutation();
  const [finalizeUpload] = useFinalizeUploadMutation();

  const createLectureHandler = async (formData: TFormData) => {
    try {
      const lecture = formData.content.lecture;

      if (!lecture) {
        toast.error("Lecture data is missing");
        return;
      }

      const server = lecture.server;

      if (server === "Other" && !uploadedVideoUrl) {
        toast.error("Please upload video first");
        return;
      }

      if (uploadedVideoUrl) {
        lecture.video = uploadedVideoUrl;
      }

      await createLecture(formData).unwrap();
      toast.success("Lecture created successfully");
      navigate(`/module/${moduleID}`, { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-[720px] mx-auto mb-10">
      <TitleCard>
        <h3 className="text-center text-2xl font-bold">Create Lecture</h3>
      </TitleCard>

      {module ? (
        <Form<TFormData>
          onSubmit={createLectureHandler}
          defaultValues={defaultValues}
          resolver={zodResolver(
            CourseContentResolvers.createCourseContentValidationSchema,
          )}
        >
          <LectureFields
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            setIsUploading={setIsUploading}
            setUploadProgress={setUploadProgress}
            setUploadedVideoUrl={setUploadedVideoUrl}
            uploadChunk={uploadChunk}
            finalizeUpload={finalizeUpload}
          />

          <DateTimeField name="scheduledAt" label="Schedule At" />

          <FormButton>
            {isUploading ? "Uploading..." : "Create Lecture"}
          </FormButton>
        </Form>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default LecturesCreate;

/* =========================
   LECTURE FIELDS (VIDEO UPLOAD)
========================= */
const LectureFields = ({
  isUploading,
  uploadProgress,
  setIsUploading,
  setUploadProgress,
  setUploadedVideoUrl,
  uploadChunk,
  finalizeUpload,
}: any) => {
  const { control, setValue, getValues } = useFormContext();

  // Watch server and video fields
  const server = useWatch({ name: "content.lecture.server", control });
  const uploadedVideoUrl = useWatch({ name: "content.lecture.video", control });

  const handleUpload = async () => {
    const file = getValues("content.lecture.videoFile");
    if (!file) {
      toast.error("Select a video first");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await uploadVideoInChunksRTK({
        file,
        uploadChunk,
        finalizeUpload,
        onProgress: setUploadProgress,
      });

      console.log("Raw upload response:", response);

      if (typeof response !== "string") {
        toast.error("Invalid upload response");
        return;
      }

      const uploadedUrl = response;

      setUploadedVideoUrl(uploadedUrl);

      setValue("content.lecture.video", uploadedUrl, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      toast.success("Video uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Reset fields when server is not "Other"
  useEffect(() => {
    if (server !== "Other") {
      setValue("content.lecture.videoFile", undefined);
      setUploadedVideoUrl("");
      setValue("content.lecture.video", "");
    }
  }, [server, setValue, setUploadedVideoUrl]);

  return (
    <>
      <InputField name="content.lecture.title" label="Title" />

      <SelectField
        name="content.lecture.server"
        label="Server"
        options={[
          { label: "YouTube", value: "YouTube" },
          { label: "Vimeo", value: "Vimeo" },
          { label: "Bunny", value: "Bunny" },
          { label: "Other", value: "Other" },
        ]}
      />

      {server === "Other" && (
        <>
          <Controller
            name="content.lecture.videoFile"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="video/*"
                onChange={(e) => field.onChange(e.target.files?.[0])}
                className="border p-2 w-full mt-2"
              />
            )}
          />

          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </button>

          {isUploading && (
            <div className="mt-2">
              <p className="text-sm">Uploading: {uploadProgress}%</p>
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-blue-600 rounded"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Always show Video URL / ID field */}
      <InputField name="content.lecture.video" label="Video URL / ID" />
      <p className="text-xs text-green-600">RHF value: {uploadedVideoUrl}</p>

      <div className="grid grid-cols-3 gap-4 mt-2">
        <NumberField name="content.lecture.duration.hours" label="Hours" />
        <NumberField name="content.lecture.duration.minutes" label="Minutes" />
        <NumberField name="content.lecture.duration.seconds" label="Seconds" />
      </div>

      <SwitchField name="content.lecture.isFree" label="Is Free?" />
      <TagField name="content.lecture.tags" label="Tags" />
    </>
  );
};
