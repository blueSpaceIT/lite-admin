import type z from "zod";
import { useAppDispatch } from "../../../store/hook";
import { authService } from "../../../store/services/authService";
import type { TAdmin, TData, TError } from "../../../types";
import { AuthResolvers } from "../../../resolvers/auth.resolvers";
import toast from "react-hot-toast";
import { setUser } from "../../../store/slices/authSlice";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import PasswordField from "../../../components/common/Form/PasswordField";
import { Link } from "react-router-dom";
import FormButton from "../../../components/common/Form/FormButton";

type TSigninResponse = {
    user: TAdmin;
    token: string;
};

const Signin = () => {
    const defaultValues = {
        phone: "",
        password: "",
    };

    const dispatch = useAppDispatch();
    const [signin] = authService.useSigninMutation();

    type TSigninFormData = z.infer<typeof AuthResolvers.signinValidationSchema>;

    const signinHandler = async (data: TSigninFormData) => {
        const toastId = toast.loading("Wait a while");
        const result = await signin(data);
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data as TData<TSigninResponse>) {
            dispatch(
                setUser({
                    user: result?.data?.data?.user,
                    token: result?.data?.data?.token,
                })
            );

            toast.success("Signin successfull", {
                id: toastId,
            });
        }
    };

    return (
        <div>
            <div>
                <h3 className="text-center text-lg font-semibold">Signin</h3>

                <Form<TSigninFormData>
                    onSubmit={signinHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(AuthResolvers.signinValidationSchema)}
                >
                    <InputField
                        label="Phone"
                        name="phone"
                        placeholder="Your phone"
                    />
                    <PasswordField
                        label="Password"
                        name="password"
                        placeholder="Your password"
                        extra={
                            <Link
                                to="/auth/forget-password"
                                className="block text-sm font-medium underline mb-1.5"
                            >
                                Forget password
                            </Link>
                        }
                    />
                    <FormButton>Sign In</FormButton>
                </Form>
            </div>
        </div>
    );
};

export default Signin;
