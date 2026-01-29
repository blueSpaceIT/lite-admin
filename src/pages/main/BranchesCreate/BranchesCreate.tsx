import { useNavigate } from "react-router-dom";
import { BranchResolvers } from "../../../resolvers/branch.resolvers";
import type z from "zod";
import { branchService } from "../../../store/services/branchService";
import toast from "react-hot-toast";
import type { TError } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import TextareaField from "../../../components/common/Form/TextareaField";
import FormButton from "../../../components/common/Form/FormButton";

const BranchesCreate = () => {
    const navigate = useNavigate();
    const defaultValues = {
        name: "",
        code: "",
        address: "",
        mapURL: "",
    };

    type TCreateBranchFromData = z.infer<
        typeof BranchResolvers.createBranchValidationSchema
    >;

    const [createBranch] = branchService.useCreateBranchMutation();

    const createBranchHandler = async (data: TCreateBranchFromData) => {
        const toastId = toast.loading("Wait a while");
        const result = await createBranch(data);
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Create successfull", {
                id: toastId,
            });
        }

        navigate("/branches", { replace: true });
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create Branch
                </h3>
            </TitleCard>

            <Form<TCreateBranchFromData>
                onSubmit={createBranchHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(
                    BranchResolvers.createBranchValidationSchema
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
                <FormButton>Create Branch</FormButton>
            </Form>
        </div>
    );
};

export default BranchesCreate;
