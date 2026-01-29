import type z from "zod";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector } from "../../../../store/hook";
import { useCurrentUser } from "../../../../store/slices/authSlice";
import { AdminResolvers } from "../../../../resolvers/admin.resolvers";
import { adminService } from "../../../../store/services/adminService";
import type { TAdmin, TData, TError } from "../../../../types";
import Form from "../../../../components/common/Form/Form";
import PasswordField from "../../../../components/common/Form/PasswordField";
import FormButton from "../../../../components/common/Form/FormButton";

const ChangePassword = () => {
    const user = useAppSelector(useCurrentUser);
    const defaultValues = {
        oldPassword: "",
        newPassword: "",
    };

    type TUpdatePasswordData = z.infer<
        typeof AdminResolvers.updateAdminPasswordValidationSchema
    >;

    const [updatePassword] = adminService.useUpdateAdminPasswordMutation();

    const updatePasswordHandler = async (data: TUpdatePasswordData) => {
        const toastID = toast.loading("Wait a while");
        const result = await updatePassword({ id: user?.id, ...data });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastID,
            });
        }

        if (result?.data as TData<TAdmin>) {
            toast.success("Update successful", { id: toastID });
        }
    };

    return (
        <div>
            <h4 className="text-lg font-semibold mb-6">Change Password</h4>

            <Form
                onSubmit={updatePasswordHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(
                    AdminResolvers.updateAdminPasswordValidationSchema
                )}
            >
                <div className="grid md:grid-cols-2 gap-4">
                    <PasswordField
                        name="oldPassword"
                        placeholder="********"
                        label="Old Password"
                    />
                    <PasswordField
                        name="newPassword"
                        placeholder="********"
                        label="New Password"
                    />
                </div>
                <div className="flex justify-center">
                    <FormButton>Update Password</FormButton>
                </div>
            </Form>
        </div>
    );
};

export default ChangePassword;
