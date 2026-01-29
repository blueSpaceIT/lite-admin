import { useNavigate, useParams } from "react-router-dom";
import Form from "../../../components/common/Form/Form";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import type z from "zod";
import { BranchResolvers } from "../../../resolvers/branch.resolvers";
import { useEffect, useState } from "react";
import type { TBranch, TError } from "../../../types";
import { branchService } from "../../../store/services/branchService";
import { useError } from "../../../hooks";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import TextareaField from "../../../components/common/Form/TextareaField";
import FormButton from "../../../components/common/Form/FormButton";
import Loader from "../../../components/common/Loader/Loader";

const BranchesUpdate = () => {
    const { branchID } = useParams();
    const navigate = useNavigate();
    const [branch, setBranch] = useState<TBranch | null>(null);
    const { data, isSuccess, isError, error } =
        branchService.useGetBranchQuery(branchID);

    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setBranch(data?.data);
        }
    }, [isSuccess, data]);

    const defaultValues = {
        name: branch?.name || "",
        code: branch?.code || "",
        address: branch?.address || "",
        mapURL: branch?.mapURL || "",
    };

    type TUpdateBranchFromData = z.infer<
        typeof BranchResolvers.updateBranchValidationSchema
    >;

    const [updateBranch] = branchService.useUpdateBranchMutation();

    const updateBranchHandler = async (data: TUpdateBranchFromData) => {
        const toastId = toast.loading("Wait a while");
        const result = await updateBranch({ id: branchID, ...data });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Update successfull", {
                id: toastId,
            });
        }

        navigate("/branches", { replace: true });
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Update Branch
                </h3>
            </TitleCard>

            {branch ? (
                <Form<TUpdateBranchFromData>
                    onSubmit={updateBranchHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        BranchResolvers.updateBranchValidationSchema
                    )}
                >
                    <InputField name="name" placeholder="Name" label="Name" />
                    <InputField name="code" placeholder="Code" label="Code" />
                    <InputField
                        name="mapURL"
                        placeholder="Map Url"
                        label="Map Url"
                    />
                    <TextareaField
                        name="address"
                        placeholder="Thana, City"
                        label="Address"
                    />
                    <FormButton>Update Branch</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default BranchesUpdate;
