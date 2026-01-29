import { useNavigate } from "react-router-dom";
import type z from "zod";
import toast from "react-hot-toast";
import type { TAdmin, TError, TNewsCategory } from "../../../types";
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
import { NewsResolvers } from "../../../resolvers/news.resolvers.ts";
import { newsCategoryService } from "../../../store/services/newsCategoryService.ts";
import { newsService } from "../../../store/services/newsService.ts";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const NewsImageUploader = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    type TCreateNewsFromData = z.infer<
        typeof NewsResolvers.createNewsValidationSchema
    >;
    const { setValue } = useFormContext<TCreateNewsFromData>();
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
        newsCategoryService.useGetNewsCategoriesQuery([]);
    useEffect(() => {
        if (categoriesData?.data) {
            const transformedCategories = categoriesData.data.result.map(
                (category: TNewsCategory) => ({
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

const NewsCreate = () => {
    const navigate = useNavigate();
    const user = useAppSelector(useCurrentUser);
    const defaultValues = {
        name: "",
        description: "",
        category: null,
        tags: [],
        image: "",
        author: (user as TAdmin).id,
    };

    type TCreateNewsFromData = z.infer<
        typeof NewsResolvers.createNewsValidationSchema
    >;

    const [createNews] = newsService.useCreateNewsMutation();

    const createNewsHandler = async (data: TCreateNewsFromData) => {
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

        const result = await createNews(payload);
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

        navigate("/news", { replace: true });
    };

    return (
        <div className="max-w-[920px] lg:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create News
                </h3>
            </TitleCard>

            <Form<TCreateNewsFromData>
                onSubmit={createNewsHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(NewsResolvers.createNewsValidationSchema)}
            >
                <NewsImageUploader />
                <InputField
                    name="name"
                    placeholder="News Title"
                    label="Title"
                />
                <Editor name="description" label="Description" />
                <CategorySelectField />
                <TagField
                    name="tags"
                    label="Tags (Optional)"
                    placeholder="Tags"
                />
                <FormButton>Create News</FormButton>
            </Form>
        </div>
    );
};

export default NewsCreate;
