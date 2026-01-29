import { useNavigate } from "react-router-dom";
import type z from "zod";
import toast from "react-hot-toast";
import type { TError } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import FormButton from "../../../components/common/Form/FormButton";
import { ProductCategoryResolvers } from "../../../resolvers/productCategory.resolvers";
import { productCategoryService } from "../../../store/services/productCategoryService";

const ProductCategoriesCreate = () => {
    const navigate = useNavigate();
    const defaultValues = {
        name: "",
    };

    type TCreateProductCategoryFromData = z.infer<
        typeof ProductCategoryResolvers.createProductCategoryValidationSchema
    >;

    const [createProductCategory] =
        productCategoryService.useCreateProductCategoryMutation();

    const createProductCategoryHandler = async (
        data: TCreateProductCategoryFromData
    ) => {
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };

        const result = await createProductCategory(payload);
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

        navigate("/product-categories", { replace: true });
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create Product Category
                </h3>
            </TitleCard>

            <Form<TCreateProductCategoryFromData>
                onSubmit={createProductCategoryHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(
                    ProductCategoryResolvers.createProductCategoryValidationSchema
                )}
            >
                <InputField name="name" placeholder="Name" label="Name" />
                <FormButton>Create Category</FormButton>
            </Form>
        </div>
    );
};

export default ProductCategoriesCreate;
