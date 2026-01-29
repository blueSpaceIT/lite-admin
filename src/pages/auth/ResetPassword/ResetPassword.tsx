import { zodResolver } from "@hookform/resolvers/zod";
import Form from "../../../components/common/Form/Form";
import { AuthResolvers } from "../../../resolvers/auth.resolvers";
import PasswordField from "../../../components/common/Form/PasswordField";
import FormButton from "../../../components/common/Form/FormButton";
import { authService } from "../../../store/services/authService";
import type z from "zod";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { TError } from "../../../types";

const ResetPassword = () => {
    const navigate = useNavigate();
    const defaultValues = {
        password: "",
    };

    const [resetPassword] = authService.useResetPasswordMutation();

    type TResetPasswordFormData = z.infer<
        typeof AuthResolvers.resetPasswordValidationSchema
    >;

    const [searchParams] = useSearchParams();

    const resetPasswordHandler = async (data: TResetPasswordFormData) => {
        const toastId = toast.loading("Wait a while");
        const result = await resetPassword({
            token: `Bearer ${searchParams.get("token")}`,
            ...data,
        });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Signin successfull", {
                id: toastId,
            });
            navigate("/auth/signin", { replace: true });
        }
    };

    return (
        <div>
            <div>
                <h3 className="text-center text-lg font-semibold">
                    Reset Password
                </h3>

                <Form<TResetPasswordFormData>
                    onSubmit={resetPasswordHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        AuthResolvers.resetPasswordValidationSchema
                    )}
                >
                    <PasswordField
                        label="Password"
                        name="password"
                        placeholder="Your password"
                    />
                    <FormButton>Reset Password</FormButton>
                </Form>
            </div>
        </div>
    );
};

export default ResetPassword;
