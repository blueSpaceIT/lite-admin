import { useNavigate } from "react-router-dom";
import { CouponResolvers } from "../../../resolvers/coupon.resolvers";
import type z from "zod";
import { couponService } from "../../../store/services/couponService";
import toast from "react-hot-toast";
import type { TError } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import SelectField from "../../../components/common/Form/SelectField";
import NumberField from "../../../components/common/Form/NumberField";
import DateTimeField from "../../../components/common/Form/DateTimeField";
import FormButton from "../../../components/common/Form/FormButton";

const CouponsCreate = () => {
    const navigate = useNavigate();
    const defaultValues = {
        name: "",
        discount: {
            type: "Fixed" as const,
            amount: 0,
        },
        issuedAt: "",
        expiredAt: "",
    };

    type TCreateCouponFromData = z.infer<
        typeof CouponResolvers.createCouponValidationSchema
    >;

    const [createCoupon] = couponService.useCreateCouponMutation();

    const createCouponHandler = async (data: TCreateCouponFromData) => {
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };
        if (
            payload.discount.type === "Percentage" &&
            payload.discount.amount > 100
        ) {
            return toast.error("Discount cannot be more than 100%", {
                id: toastId,
            });
        }

        const result = await createCoupon(data);
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

        navigate("/coupons", { replace: true });
    };

    const discountTypeOptions = [
        { value: "Fixed", label: "Fixed" },
        { value: "Percentage", label: "Percentage" },
    ];

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create Coupon
                </h3>
            </TitleCard>

            <Form<TCreateCouponFromData>
                onSubmit={createCouponHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(
                    CouponResolvers.createCouponValidationSchema
                )}
            >
                <InputField
                    name="name"
                    placeholder="Coupon Name"
                    label="Name"
                />

                <SelectField
                    name="discount.type"
                    placeholder="Select discount type"
                    label="Discount Type"
                    options={discountTypeOptions}
                />

                <NumberField name="discount.amount" label="Discount Amount" />

                <DateTimeField name="issuedAt" label="Issued At" />

                <DateTimeField name="expiredAt" label="Expired At" />

                <FormButton>Create Coupon</FormButton>
            </Form>
        </div>
    );
};

export default CouponsCreate;
