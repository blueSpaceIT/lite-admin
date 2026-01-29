import { useNavigate } from "react-router-dom";
import { AdminResolvers } from "../../../resolvers/admin.resolvers";
import type z from "zod";
import { adminService } from "../../../store/services/adminService";
import { branchService } from "../../../store/services/branchService";
import toast from "react-hot-toast";
import type { TAdminRole, TError } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import TextareaField from "../../../components/common/Form/TextareaField";
import SelectField from "../../../components/common/Form/SelectField";
import PasswordField from "../../../components/common/Form/PasswordField";
import FormButton from "../../../components/common/Form/FormButton";
import { USER_ROLES_ARRAY } from "../../../constants";
import { useEffect, useState } from "react";
import type { TBranch } from "../../../types";
import type { GetProp, UploadProps } from "antd";
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "../../../store/hook";
import { useCurrentToken } from "../../../store/slices/authSlice";
import Uploader from "../../../features/uploader/Uploader";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const AdminImageUploader = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    type TCreateAdminFromData = z.infer<
        typeof AdminResolvers.createAdminValidationSchema
    >;
    const { setValue } = useFormContext<TCreateAdminFromData>();
    const token = useAppSelector(useCurrentToken);
    const uploadHandler: UploadProps["onChange"] = (info) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        if (info.file.status === "error") {
            toast.error("Image upload failed");
            setLoading(false);
            return;
        }
        if (info.file.status === "done") {
            toast.success("Image upload successfull");
            setValue("image", info.file.response.data.url);
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    return (
        <div className="mt-5 mb-5">
            <Uploader
                token={token as string}
                actionHandler={uploadHandler}
                loading={loading}
                imageUrl={imageUrl as string}
                size={{ width: "200", height: "200" }}
            />
            <p className="italic text-sm font-semibold text-slate-500 mt-1.5">
                *** Please upload 200*200 and maximum 200kb profile for better
                experience ***
            </p>
        </div>
    );
};

const BranchSelectField = () => {
    const [branches, setBranches] = useState<
        { value: string; label: string }[]
    >([]);
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
        }
    }, [branchesData]);

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

const AdminsCreate = () => {
    const navigate = useNavigate();
    const defaultValues = {
        name: "",
        phone: "",
        password: "",
        branch: "",
        designation: "",
        nid: "",
        address: "",
        role: "admin" as TAdminRole,
        image: "",
    };

    type TCreateAdminFromData = z.infer<
        typeof AdminResolvers.createAdminValidationSchema
    >;

    const [createAdmin] = adminService.useCreateAdminMutation();

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

    const createAdminHandler = async (data: TCreateAdminFromData) => {
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };

        if (!payload?.password) {
            delete payload.password;
        }
        if (!payload?.nid) {
            delete payload.nid;
        }
        if (!payload?.address) {
            delete payload.address;
        }
        if (!payload?.image) {
            delete payload.image;
        }
        if (!payload?.branch) {
            delete payload.branch;
        }

        const result = await createAdmin(payload);
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Create successful", {
                id: toastId,
            });
        }

        navigate("/admins", { replace: true });
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create Admin
                </h3>
            </TitleCard>

            <Form<TCreateAdminFromData>
                onSubmit={createAdminHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(
                    AdminResolvers.createAdminValidationSchema
                )}
            >
                <AdminImageUploader />
                <InputField name="name" placeholder="Full Name" label="Name" />
                <InputField
                    name="phone"
                    placeholder="01XXXXXXXXX"
                    label="Phone"
                />
                <PasswordField
                    name="password"
                    placeholder="Password"
                    label="Password"
                />
                <BranchSelectField />
                <InputField
                    name="designation"
                    placeholder="Designation"
                    label="Designation"
                />
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
                <FormButton>Create Admin</FormButton>
            </Form>
        </div>
    );
};

export default AdminsCreate;
