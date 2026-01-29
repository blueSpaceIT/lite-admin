import type z from "zod";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
    setUser,
    useCurrentToken,
    useCurrentUser,
} from "../../../../store/slices/authSlice";
import { AdminResolvers } from "../../../../resolvers/admin.resolvers";
import { adminService } from "../../../../store/services/adminService";
import type { TAdmin, TData, TError } from "../../../../types";
import Form from "../../../../components/common/Form/Form";
import InputField from "../../../../components/common/Form/InputField";
import TextareaField from "../../../../components/common/Form/TextareaField";
import FormButton from "../../../../components/common/Form/FormButton";

const UpdateProfile = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(useCurrentUser);
    const token = useAppSelector(useCurrentToken);
    const defaultValues = {
        quote: user?.quote || "",
        nid: user?.nid || "",
        address: user?.address || "",
    };

    type TUpdateProfileData = z.infer<
        typeof AdminResolvers.updateAdminValidationSchema
    >;

    const [updateProfile] = adminService.useUpdateAdminMutation();

    const updateProfileHandler = async (data: TUpdateProfileData) => {
        const toastID = toast.loading("Wait a while");
        const result = await updateProfile({ id: user?.id, ...data });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastID,
            });
        }

        if (result?.data as TData<TAdmin>) {
            toast.success("Update successful", { id: toastID });
            dispatch(
                setUser({
                    user: result?.data.data,
                    token,
                })
            );
            window.location.reload();
        }
    };

    return (
        <div>
            <h4 className="text-lg font-semibold mb-6">Update Profile Info</h4>

            <Form
                onSubmit={updateProfileHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(
                    AdminResolvers.updateAdminValidationSchema
                )}
            >
                <div className="grid md:grid-cols-2 gap-x-4">
                    <TextareaField
                        name="quote"
                        placeholder="Quote"
                        label="Your Quote"
                    />
                    <TextareaField
                        name="address"
                        placeholder="Address"
                        label="Your Address"
                    />
                    <InputField name="nid" placeholder="NID" label="NID" />
                </div>
                <div className="flex justify-center">
                    <FormButton>Update</FormButton>
                </div>
            </Form>
        </div>
    );
};

export default UpdateProfile;
