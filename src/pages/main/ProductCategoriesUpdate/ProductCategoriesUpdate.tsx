import { useNavigate, useParams } from "react-router-dom";
import Form from "../../../components/common/Form/Form";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import type z from "zod";
import { useEffect, useState } from "react";
import type { TError, TProductCategory } from "../../../types";
import { useError } from "../../../hooks";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import FormButton from "../../../components/common/Form/FormButton";
import Loader from "../../../components/common/Loader/Loader";
import { ProductCategoryResolvers } from "../../../resolvers/productCategory.resolvers";
import { productCategoryService } from "../../../store/services/productCategoryService";

const ProductCategoriesUpdate = () => {
    const { productCategoryID } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState<TProductCategory | null>(null);

    const { data, isSuccess, isError, error } =
        productCategoryService.useGetProductCategoryQuery(productCategoryID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setCategory(data?.data);
        }
    }, [isSuccess, data]);

    const defaultValues = {
        name: category?.name || "",
    };

    type TUpdateProductCategoryFromData = z.infer<
        typeof ProductCategoryResolvers.updateProductCategoryValidationSchema
    >;

    const [updateProductCategory] =
        productCategoryService.useUpdateProductCategoryMutation();

    const updateProductCategoryHandler = async (
        data: TUpdateProductCategoryFromData
    ) => {
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };

        const result = await updateProductCategory({
            id: productCategoryID,
            ...payload,
        });
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

        navigate("/product-categories", { replace: true });
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Update Product Category
                </h3>
            </TitleCard>

            {category ? (
                <Form<TUpdateProductCategoryFromData>
                    onSubmit={updateProductCategoryHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        ProductCategoryResolvers.updateProductCategoryValidationSchema
                    )}
                >
                    <InputField name="name" placeholder="Name" label="Name" />
                    <FormButton>Update Category</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default ProductCategoriesUpdate;
