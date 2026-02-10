import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../components/common/Form/Form";
import FormButton from "../../../components/common/Form/FormButton";
import InputField from "../../../components/common/Form/InputField";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { OfflineClassResolvers } from "../../../resolvers/offlineClass.resolvers";
import { offlineClassService } from "../../../store/services/offlineClassService";
import type { TData, TError, TOfflineClass } from "../../../types";

const OfflineClassUpdate: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: classData, isLoading: isClassLoading } = offlineClassService.useGetOfflineClassQuery(id);
    const [updateOfflineClass] = offlineClassService.useUpdateOfflineClassMutation();

    const handleUpdate = async (data: any) => {
        try {
            const response = await updateOfflineClass({ id, ...data });

            if (response?.error) {
                toast.error((response?.error as TError)?.data?.message || "Update failed");
            }

            if ((response?.data as TData<TOfflineClass>)?.success) {
                Swal.fire({
                    title: "Updated!",
                    text: "Class has been updated successfully.",
                    icon: "success",
                });
                navigate("/offline-management");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    if (isClassLoading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    const defaultValues = {
        title: classData?.data?.title,
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Update Class
                </h3>
            </TitleCard>

            <Form
                onSubmit={handleUpdate}
                resolver={zodResolver(
                    OfflineClassResolvers.createOfflineClassValidationSchema
                )}
                defaultValues={defaultValues}
            >
                <InputField name="title" label="Title" placeholder="Enter class title" />
                <div className="mt-5">
                    <FormButton>Update Class</FormButton>
                </div>
            </Form>
        </div>
    );
};

export default OfflineClassUpdate;
