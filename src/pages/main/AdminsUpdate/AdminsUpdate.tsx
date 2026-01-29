import { useNavigate, useParams } from "react-router-dom";
import Form from "../../../components/common/Form/Form";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import type z from "zod";
import { AdminResolvers } from "../../../resolvers/admin.resolvers";
import { useEffect, useState } from "react";
import type { TAdmin, TError, TBranch } from "../../../types";
import { adminService } from "../../../store/services/adminService";
import { branchService } from "../../../store/services/branchService";
import { useError } from "../../../hooks";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import TextareaField from "../../../components/common/Form/TextareaField";
import FormButton from "../../../components/common/Form/FormButton";
import Loader from "../../../components/common/Loader/Loader";
import SelectField from "../../../components/common/Form/SelectField";
import { USER_ROLES_ARRAY } from "../../../constants";
import { useFormContext } from "react-hook-form";
import Editor from "../../../components/common/Form/Editor";

const BranchSelectField = ({ item }: { item: TAdmin }) => {
    const [branches, setBranches] = useState<
        { value: string; label: string }[]
    >([]);
    type TUpdateAdminFromData = z.infer<
        typeof AdminResolvers.updateAdminValidationSchema
    >;
    const { setValue } = useFormContext<TUpdateAdminFromData>();
    const { data: branchesData } = branchService.useGetBranchesQuery([]);
    useEffect(() => {
        if (branchesData?.data) {
            const transformedBranches = branchesData.data.result.map(
                (branch: TBranch) => ({
                    value: branch.id,
                    label: branch.name,
                })
            );
            setBranches(transformedBranches);
            if (branchesData) {
                setValue("branch", item?.branch?.id);
            }
        }
    }, [branchesData, item, setValue]);

    return (
        <SelectField
            name="branch"
            placeholder="Select Branch"
            label="Branch"
            options={branches}
            disable={!branches}
        />
    );
};

const AdminsUpdate = () => {
    const { adminID } = useParams();
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<TAdmin | null>(null);

    const { data, isSuccess, isError, error } =
        adminService.useGetAdminQuery(adminID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setAdmin(data?.data);
        }
    }, [isSuccess, data]);

    const roleOptions = USER_ROLES_ARRAY.reduce(
        (acc: { value: string; label: string }[], role) => {
            if (role !== "superAdmin") {
                acc.push({
                    value: role,
                    label: (role.charAt(0).toUpperCase() +
                        role.slice(1)) as string,
                });
            }
            return acc;
        },
        []
    );

    const defaultValues = {
        name: admin?.name || "",
        branch: null,
        designation: admin?.designation || "",
        quote: admin?.quote || "",
        nid: admin?.nid || "",
        address: admin?.address || "",
        role: admin?.role || "admin",
    };

    type TUpdateAdminFromData = z.infer<
        typeof AdminResolvers.updateAdminValidationSchema
    >;

    const [updateAdmin] = adminService.useUpdateAdminMutation();

    const updateAdminHandler = async (data: TUpdateAdminFromData) => {
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };

        const result = await updateAdmin({ id: adminID, ...payload });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Update successful", {
                id: toastId,
            });
        }

        navigate("/admins", { replace: true });
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Update Admin
                </h3>
            </TitleCard>

            {admin ? (
                <Form<TUpdateAdminFromData>
                    onSubmit={updateAdminHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        AdminResolvers.updateAdminValidationSchema
                    )}
                >
                    <InputField
                        name="name"
                        placeholder="Full Name"
                        label="Name"
                    />
                    <BranchSelectField item={admin} />
                    <InputField
                        name="designation"
                        placeholder="Designation"
                        label="Designation"
                    />
                    <Editor name="quote" label="Quote" />
                    <SelectField
                        name="role"
                        placeholder="Select Role"
                        label="Role"
                        options={roleOptions}
                    />
                    <InputField
                        name="nid"
                        placeholder="NID Number"
                        label="NID (Optional)"
                    />
                    <TextareaField
                        name="address"
                        placeholder="Full Address"
                        label="Address (Optional)"
                    />
                    <FormButton>Update Admin</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default AdminsUpdate;
