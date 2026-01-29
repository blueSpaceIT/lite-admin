import toast from "react-hot-toast";
import { AuthResolvers } from "../../../resolvers/auth.resolvers";
import { authService } from "../../../store/services/authService";
import type z from "zod";
import type { TError } from "../../../types";
import FormButton from "../../../components/common/Form/FormButton";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import { useState } from "react";

const ForgotPassword = () => {
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const defaultValues = {
        phone: "",
    };

    const [forgotPassword] = authService.useForgetPasswordMutation();

    type TForgotPasswordFormData = z.infer<
        typeof AuthResolvers.forgetPasswordValidationSchema
    >;

    const forgotPasswordHandler = async (data: TForgotPasswordFormData) => {
        const toastId = toast.loading("Wait a while");
        const result = await forgotPassword(data);
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Sms send successfull", {
                id: toastId,
            });
            setIsSuccess(true);
        }
    };

    return (
        <div>
            <div>
                <h3 className="text-center text-lg font-semibold">
                    Forget Password
                </h3>

                {isSuccess ? (
                    <div className="text-center space-y-5">
                        {/* Success Icon with Animation */}
                        <div className="relative inline-block">
                            <svg
                                className="w-16 h-16 text-green-500 animate-scaleIn"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        {/* Message */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                সফলভাবে এসএমএস পাঠানো হয়েছে
                            </h3>
                            <p className="text-gray-600 text-sm">
                                আপনার মোবাইল নাম্বারে এ লিংক পাঠানো হয়েছে
                            </p>
                        </div>
                    </div>
                ) : (
                    <Form<TForgotPasswordFormData>
                        onSubmit={forgotPasswordHandler}
                        defaultValues={defaultValues}
                        resolver={zodResolver(
                            AuthResolvers.forgetPasswordValidationSchema
                        )}
                    >
                        <InputField
                            label="Phone"
                            name="phone"
                            placeholder="Your phone"
                        />
                        <FormButton>Send Reset Link</FormButton>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
