import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../components/common/Form/Form";
import FormButton from "../../../components/common/Form/FormButton";
import InputField from "../../../components/common/Form/InputField";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { OfflineClassResolvers } from "../../../resolvers/offlineClass.resolvers";
import { offlineClassService } from "../../../store/services/offlineClassService";
import type { TData, TError } from "../../../types";
import type { TOfflineClass } from "../../../types/offlineClass.types";

const OfflineClassCreate: React.FC = () => {
    const [createOfflineClass] =
        offlineClassService.useCreateOfflineClassMutation();
    const navigate = useNavigate();

    const handleCreate = async (data: any) => {
        try {
            const response = await createOfflineClass(data);

            if (response?.error) {
                toast.error((response?.error as TError)?.data?.message);
            }

            if ((response?.data as TData<TOfflineClass>)?.success) {
                Swal.fire({
                    title: "Created!",
                    text: "Class has been created successfully.",
                    icon: "success",
                });
                navigate("/offline-class");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create Class
                </h3>
            </TitleCard>

            <Form
                onSubmit={handleCreate}
                resolver={zodResolver(
                    OfflineClassResolvers.createOfflineClassValidationSchema
                )}
            >
                <InputField name="title" label="Title" placeholder="Enter class title" />
                <div className="mt-5">
                    <FormButton>Create Class</FormButton>
                </div>
            </Form>
        </div>
    );
};

export default OfflineClassCreate;

