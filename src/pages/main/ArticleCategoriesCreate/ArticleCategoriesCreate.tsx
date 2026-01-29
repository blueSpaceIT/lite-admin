import { useNavigate } from "react-router-dom";
import { ArticleCategoryResolvers } from "../../../resolvers/articleCategory.resolvers";
import type z from "zod";
import { articleCategoryService } from "../../../store/services/articleCategoryService";
import toast from "react-hot-toast";
import type { TError } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import FormButton from "../../../components/common/Form/FormButton";
import { useState } from "react";
import type { GetProp, UploadProps } from "antd";
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "../../../store/hook";
import { useCurrentToken } from "../../../store/slices/authSlice";
import UploaderSquare from "../../../features/uploader/UploaderSquare";
import TextareaField from "../../../components/common/Form/TextareaField";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const ArticleCategoryImageUploader = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    type TCreateArticleCategoryFromData = z.infer<
        typeof ArticleCategoryResolvers.createArticleCategoryValidationSchema
    >;
    const { setValue } = useFormContext<TCreateArticleCategoryFromData>();
    const token = useAppSelector(useCurrentToken);

    const uploadHandler: UploadProps["onChange"] = (info) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        if (info.file.status === "error") {
            toast.error("Image upload failed");
            setLoading(false);
            return;
        }
        if (info.file.status === "done") {
            toast.success("Image upload successful");
            setValue("image", info.file.response.data.url);
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    return (
        <div className="mt-5 mb-5">
            <UploaderSquare
                token={token as string}
                actionHandler={uploadHandler}
                loading={loading}
                imageUrl={imageUrl as string}
                size={{ width: "64", height: "64" }}
            />
            <p className="italic text-sm font-semibold text-slate-500 mt-1.5">
                *** Please upload 64*64 and maximum 10kb image for better
                experience ***
            </p>
        </div>
    );
};

const ArticleCategoriesCreate = () => {
    const navigate = useNavigate();
    const defaultValues = {
        name: "",
        description: "",
        image: "",
    };

    type TCreateArticleCategoryFromData = z.infer<
        typeof ArticleCategoryResolvers.createArticleCategoryValidationSchema
    >;

    const [createArticleCategory] =
        articleCategoryService.useCreateArticleCategoryMutation();

    const createArticleCategoryHandler = async (
        data: TCreateArticleCategoryFromData
    ) => {
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };

        if (!payload?.image) {
            delete payload.image;
        }

        const result = await createArticleCategory(payload);
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

        navigate("/article-categories", { replace: true });
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create Article Category
                </h3>
            </TitleCard>

            <Form<TCreateArticleCategoryFromData>
                onSubmit={createArticleCategoryHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(
                    ArticleCategoryResolvers.createArticleCategoryValidationSchema
                )}
            >
                <ArticleCategoryImageUploader />
                <InputField name="name" placeholder="Name" label="Name" />
                <TextareaField
                    name="description"
                    label="description"
                    placeholder="Description"
                />
                <FormButton>Create Category</FormButton>
            </Form>
        </div>
    );
};

export default ArticleCategoriesCreate;
