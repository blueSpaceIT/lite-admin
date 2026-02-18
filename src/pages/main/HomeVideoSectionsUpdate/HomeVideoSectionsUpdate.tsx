import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../components/common/Form/Form";
import FormButton from "../../../components/common/Form/FormButton";
import InputField from "../../../components/common/Form/InputField";
import Loader from "../../../components/common/Loader/Loader";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { HomeVideoSectionResolvers } from "../../../resolvers/homeVideoSection.resolvers";
import { homeVideoSectionService } from "../../../store/services/homeVideoSectionService";
import type { TError } from "../../../types";

const VideoFields = () => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "videos",
    });

    return (
        <div className="mt-5 mb-10">
            <div className="flex justify-between items-center mb-4">
                <label className="text-sm text-slate-500 font-semibold">Videos</label>
                <button
                    type="button"
                    onClick={() => append({ videoUrl: "", title: "", description: "" })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    <FaPlus className="w-3 h-3" /> Add Video
                </button>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="p-4 border-2 border-slate-100 rounded-xl mb-4 relative">
                    <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-4 right-4 text-rose-500 hover:text-rose-600 transition-colors"
                    >
                        <FaTrash className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 gap-1">
                        <InputField
                            name={`videos.${index}.title`}
                            label="Video Title"
                            placeholder="Enter video title"
                        />
                        <InputField
                            name={`videos.${index}.videoUrl`}
                            label="Video URL"
                            placeholder="Enter video URL"
                        />
                        <InputField
                            name={`videos.${index}.description`}
                            label="Video Description"
                            placeholder="Enter video description"
                        />
                    </div>
                </div>
            ))}
            {fields.length === 0 && (
                <p className="text-center text-slate-400 italic py-5">No videos added yet. Click "Add Video" to start.</p>
            )}
        </div>
    );
};

const HomeVideoSectionsUpdate: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [updateHomeVideoSection] = homeVideoSectionService.useUpdateHomeVideoSectionMutation();
    const { data: sectionData, isLoading } = homeVideoSectionService.useGetSingleHomeVideoSectionQuery(id);

    const handleUpdate = async (data: any) => {
        const toastId = toast.loading("Updating section...");
        try {
            const response = await updateHomeVideoSection({ id, ...data });

            if (response?.error) {
                toast.error((response?.error as TError)?.data?.message || "Something went wrong", { id: toastId });
            }

            if (response?.data?.success) {
                toast.success("Section updated successfully", { id: toastId });
                Swal.fire({
                    title: "Updated!",
                    text: "Home Video Section has been updated successfully.",
                    icon: "success",
                });
                navigate("/home-video-sections");
            }
        } catch (error) {
            toast.error("Something went wrong", { id: toastId });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader />
            </div>
        );
    }

    const defaultValues = {
        title: sectionData?.data?.title || "",
        description: sectionData?.data?.description || "",
        videos: sectionData?.data?.videos || [],
        ctaButtonLabel: sectionData?.data?.ctaButtonLabel || "",
        ctaButtonLink: sectionData?.data?.ctaButtonLink || "",
    };

    return (
        <div className="max-w-[720px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Update Home Video Section
                </h3>
            </TitleCard>

            <Form
                onSubmit={handleUpdate}
                defaultValues={defaultValues}
                resolver={zodResolver(
                    HomeVideoSectionResolvers.homeVideoSectionValidationSchema
                )}
            >
                <div className="grid grid-cols-1 gap-2">
                    <InputField name="title" label="Section Title" placeholder="Enter section title" />
                    <InputField name="description" label="Section Description" placeholder="Enter section description" />

                    <VideoFields />

                    <div className="grid md:grid-cols-2 gap-x-4">
                        <InputField name="ctaButtonLabel" label="CTA Button Label" placeholder="e.g. Watch More" />
                        <InputField name="ctaButtonLink" label="CTA Button Link" placeholder="e.g. /videos" />
                    </div>
                </div>

                <div className="mt-8">
                    <FormButton>Update Section</FormButton>
                </div>
            </Form>
        </div>
    );
};

export default HomeVideoSectionsUpdate;
