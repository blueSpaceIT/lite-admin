import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
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

const OfflineBatchUpdate: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: batchData, isLoading: isBatchLoading } = offlineBatchService.useGetOfflineBatchQuery(id);
    const [updateOfflineBatch] = offlineBatchService.useUpdateOfflineBatchMutation();
    const { data: offlineClassesData } = offlineClassService.useGetOfflineClassesQuery(undefined);

    const handleUpdate = async (data: any) => {
        try {
            const response = await updateOfflineBatch({ id, ...data });

            if (response?.error) {
                toast.error((response?.error as TError)?.data?.message || "Update failed");
            }

            if ((response?.data as TData<TOfflineBatch>)?.success) {
                Swal.fire({
                    title: "Updated!",
                    text: "Batch has been updated successfully.",
                    icon: "success",
                });
                navigate("/offline-management");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const classOptions = offlineClassesData?.data?.map((item: TOfflineClass) => ({
        label: item.title,
        value: item._id,
    })) || [];

    if (isBatchLoading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    const defaultValues = {
        title: batchData?.data?.title,
        classId: batchData?.data?.classId?._id || batchData?.data?.classId,
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Update Batch
                </h3>
            </TitleCard>

            <Form
                onSubmit={handleUpdate}
                resolver={zodResolver(
                    OfflineBatchResolvers.createOfflineBatchValidationSchema
                )}
                defaultValues={defaultValues}
            >
                <InputField name="title" label="Title" placeholder="Enter batch title" />
                <SelectField
                    name="classId"
                    label="Class"
                    placeholder="Select Class"
                    options={classOptions}
                />
                <div className="mt-5">
                    <FormButton>Update Batch</FormButton>
                </div>
            </Form>
        </div>
    );
};

export default OfflineBatchUpdate;
