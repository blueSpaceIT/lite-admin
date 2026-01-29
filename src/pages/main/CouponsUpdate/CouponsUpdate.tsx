import { useNavigate, useParams } from "react-router-dom";
import Form from "../../../components/common/Form/Form";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import type z from "zod";
import { CouponResolvers } from "../../../resolvers/coupon.resolvers";
import { useEffect, useState } from "react";
import type { TCoupon, TError } from "../../../types";
import { couponService } from "../../../store/services/couponService";
import { useError } from "../../../hooks";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import SelectField from "../../../components/common/Form/SelectField";
import NumberField from "../../../components/common/Form/NumberField";
import DateTimeField from "../../../components/common/Form/DateTimeField";
import FormButton from "../../../components/common/Form/FormButton";
import Loader from "../../../components/common/Loader/Loader";

const CouponsUpdate = () => {
    const { couponID } = useParams();
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState<TCoupon | null>(null);
    const { data, isSuccess, isError, error } =
        couponService.useGetCouponQuery(couponID);

    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setCoupon(data?.data);
        }
    }, [isSuccess, data]);

    const defaultValues = {
        name: coupon?.name || "",
        discount: {
            type: coupon?.discount?.type || "Fixed",
            amount: coupon?.discount?.amount || 0,
        },
        issuedAt: coupon?.issuedAt
            ? new Date(coupon.issuedAt).toISOString()
            : "",
        expiredAt: coupon?.expiredAt
            ? new Date(coupon.expiredAt).toISOString()
            : "",
    };

    type TUpdateCouponFromData = z.infer<
        typeof CouponResolvers.updateCouponValidationSchema
    >;

    const [updateCoupon] = couponService.useUpdateCouponMutation();

    const updateCouponHandler = async (data: TUpdateCouponFromData) => {
        const toastId = toast.loading("Wait a while");
        const result = await updateCoupon({ id: couponID, ...data });
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
                    Update Coupon
                </h3>
            </TitleCard>

            {coupon ? (
                <Form<TUpdateCouponFromData>
                    onSubmit={updateCouponHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        CouponResolvers.updateCouponValidationSchema
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

                    <NumberField
                        name="discount.amount"
                        label="Discount Amount"
                    />

                    <DateTimeField name="issuedAt" label="Issued At" />

                    <DateTimeField name="expiredAt" label="Expired At" />

                    <FormButton>Update Coupon</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default CouponsUpdate;
