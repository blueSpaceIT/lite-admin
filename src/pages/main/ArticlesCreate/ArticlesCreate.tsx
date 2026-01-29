import { useNavigate } from "react-router-dom";
import { ArticleResolvers } from "../../../resolvers/article.resolvers.ts";
import type z from "zod";
import { articleService } from "../../../store/services/articleService.ts";
import { articleCategoryService } from "../../../store/services/articleCategoryService.ts";
import toast from "react-hot-toast";
import type { TAdmin, TArticleCategory, TError } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard.tsx";
import Form from "../../../components/common/Form/Form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField.tsx";
import SelectField from "../../../components/common/Form/SelectField.tsx";
import FormButton from "../../../components/common/Form/FormButton.tsx";
import { useEffect, useState } from "react";
import type { GetProp, UploadProps } from "antd";
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "../../../store/hook.ts";
import {
    useCurrentToken,
    useCurrentUser,
} from "../../../store/slices/authSlice.ts";
import Editor from "../../../components/common/Form/Editor.tsx";
import TagField from "../../../components/common/Form/TagField.tsx";
import UploaderSquare from "../../../features/uploader/UploaderSquare.tsx";
import SwitchField from "../../../components/common/Form/SwitchField.tsx";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const ArticleImageUploader = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    type TCreateArticleFromData = z.infer<
        typeof ArticleResolvers.createArticleValidationSchema
    >;
    const { setValue } = useFormContext<TCreateArticleFromData>();
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
            toast.success("Image upload successfull");
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
                size={{ width: "450", height: "225" }}
            />
            <p className="italic text-sm font-semibold text-slate-500 mt-1.5">
                *** Please upload 450*225 and maximum 200kb image for better
                experience ***
            </p>
        </div>
    );
};

const CategorySelectField = () => {
    const [categories, setCategories] = useState<
        { value: string; label: string }[]
    >([]);
    const { data: categoriesData } =
        articleCategoryService.useGetArticleCategoriesQuery([]);
    useEffect(() => {
        if (categoriesData?.data) {
            const transformedCategories = categoriesData.data.result.map(
                (category: TArticleCategory) => ({
                    value: category.id,
                    label: category.name,
                })
            );
            setCategories(transformedCategories);
        }
    }, [categoriesData]);

    return (
        <SelectField
            name="category"
            placeholder="Select Category"
            label="Category"
            options={categories}
            disable={!categories}
        />
    );
};

const ArticlesCreate = () => {
    const navigate = useNavigate();
    const user = useAppSelector(useCurrentUser);
    const defaultValues = {
        name: "",
        description: "",
        category: null,
        tags: [],
        featured: false,
        image: "",
        author: (user as TAdmin).id,
    };

    type TCreateArticleFromData = z.infer<
        typeof ArticleResolvers.createArticleValidationSchema
    >;

    const [createArticle] = articleService.useCreateArticleMutation();

    const createArticleHandler = async (data: TCreateArticleFromData) => {
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };

        if (!payload?.image) {
            return toast.error("Image required", {
                id: toastId,
            });
        }
        if (!payload?.tags || payload?.tags.length === 0) {
            delete payload.tags;
        }

        const result = await createArticle(payload);
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

        navigate("/articles", { replace: true });
    };

    return (
        <div className="max-w-[920px] lg:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create Article
                </h3>
            </TitleCard>

            <Form<TCreateArticleFromData>
                onSubmit={createArticleHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(
                    ArticleResolvers.createArticleValidationSchema
                )}
            >
                <ArticleImageUploader />
                <InputField
                    name="name"
                    placeholder="Article Title"
                    label="Title"
                />
                <Editor name="description" label="Description" />
                <CategorySelectField />
                <TagField
                    name="tags"
                    label="Tags (Optional)"
                    placeholder="Tags"
                />
                <SwitchField name="featured" label="Featured?" />
                <FormButton>Create Article</FormButton>
            </Form>
        </div>
    );
};

export default ArticlesCreate;
