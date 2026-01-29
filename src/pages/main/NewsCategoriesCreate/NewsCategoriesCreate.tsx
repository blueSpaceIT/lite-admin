import { useNavigate } from "react-router-dom";
import type z from "zod";
import toast from "react-hot-toast";
import type { TError } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import FormButton from "../../../components/common/Form/FormButton";
import { newsCategoryService } from "../../../store/services/newsCategoryService";
import { NewsCategoryResolvers } from "../../../resolvers/newsCategory.resolvers";

const NewsCategoriesCreate = () => {
    const navigate = useNavigate();
    const defaultValues = {
        name: "",
    };

    type TCreateNewsCategoryFromData = z.infer<
        typeof NewsCategoryResolvers.createNewsCategoryValidationSchema
    >;

    const [createNewsCategory] =
        newsCategoryService.useCreateNewsCategoryMutation();

    const createNewsCategoryHandler = async (
        data: TCreateNewsCategoryFromData
    ) => {
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };

        const result = await createNewsCategory(payload);
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

        navigate("/news-categories", { replace: true });
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create News Category
                </h3>
            </TitleCard>

            <Form<TCreateNewsCategoryFromData>
                onSubmit={createNewsCategoryHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(
                    NewsCategoryResolvers.createNewsCategoryValidationSchema
                )}
            >
                <InputField name="name" placeholder="Name" label="Name" />
                <FormButton>Create Category</FormButton>
            </Form>
        </div>
    );
};

export default NewsCategoriesCreate;
