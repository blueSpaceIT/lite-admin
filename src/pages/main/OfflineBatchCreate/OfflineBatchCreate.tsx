import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../components/common/Form/Form";
import FormButton from "../../../components/common/Form/FormButton";
import InputField from "../../../components/common/Form/InputField";
import SelectField from "../../../components/common/Form/SelectField";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { OfflineBatchResolvers } from "../../../resolvers/offlineBatch.resolvers";
import { offlineBatchService } from "../../../store/services/offlineBatchService";
import { offlineClassService } from "../../../store/services/offlineClassService";
import type { TData, TError, TOfflineBatch, TOfflineClass } from "../../../types";

const OfflineBatchCreate: React.FC = () => {
    const [createOfflineBatch] = offlineBatchService.useCreateOfflineBatchMutation();
    const { data: offlineClassesData } = offlineClassService.useGetOfflineClassesQuery(undefined);
    const navigate = useNavigate();

    const handleCreate = async (data: any) => {
        try {
            const response = await createOfflineBatch(data);

            if (response?.error) {
                toast.error((response?.error as TError)?.data?.message);
            }

            if ((response?.data as TData<TOfflineBatch>)?.success) {
                Swal.fire({
                    title: "Created!",
                    text: "Batch has been created successfully.",
                    icon: "success",
                });
                navigate("/offline-batch");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const classOptions = offlineClassesData?.data?.map((item: TOfflineClass) => ({
        label: item.title,
        value: item._id,
    })) || [];

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create Batch
                </h3>
            </TitleCard>

            <Form
                onSubmit={handleCreate}
                resolver={zodResolver(
                    OfflineBatchResolvers.createOfflineBatchValidationSchema
                )}
            >
                <InputField name="title" label="Title" placeholder="Enter batch title" />
                <SelectField
                    name="classId"
                    label="Class"
                    placeholder="Select Class"
                    options={classOptions}
                />
                <div className="mt-5">
                    <FormButton>Create Batch</FormButton>
                </div>
            </Form>
        </div>
    );
};

export default OfflineBatchCreate;
