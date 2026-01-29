import { useNavigate, useParams } from "react-router-dom";
import Form from "../../../components/common/Form/Form";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import type z from "zod";
import { CourseCategoryResolvers } from "../../../resolvers/courseCategory.resolvers";
import { useEffect, useState } from "react";
import type { TCourseCategory, TError } from "../../../types";
import { courseCategoryService } from "../../../store/services/courseCategoryService";
import { useError } from "../../../hooks";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import FormButton from "../../../components/common/Form/FormButton";
import Loader from "../../../components/common/Loader/Loader";
import { useFormContext } from "react-hook-form";
import type { GetProp, UploadProps } from "antd";
import { useAppSelector } from "../../../store/hook";
import { useCurrentToken } from "../../../store/slices/authSlice";
import UploaderSquare from "../../../features/uploader/UploaderSquare";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const CourseCategoryImageUploader = ({ item }: { item: TCourseCategory }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(item?.image);
    type TUpdateCourseCategoryFromData = z.infer<
        typeof CourseCategoryResolvers.updateCourseCategoryValidationSchema
    >;
    const { setValue } = useFormContext<TUpdateCourseCategoryFromData>();
    const token = useAppSelector(useCurrentToken);

    useEffect(() => {
        if (item?.image) {
            setImageUrl(item.image);
            setValue("image", item.image);
        }
    }, [item, setValue]);

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

const CourseCategoriesUpdate = () => {
    const { courseCategoryID } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState<TCourseCategory | null>(null);

    const { data, isSuccess, isError, error } =
        courseCategoryService.useGetCourseCategoryQuery(courseCategoryID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setCategory(data?.data);
        }
    }, [isSuccess, data]);

    const defaultValues = {
        name: category?.name || "",
        image: category?.image || "",
    };

    type TUpdateCourseCategoryFromData = z.infer<
        typeof CourseCategoryResolvers.updateCourseCategoryValidationSchema
    >;

    const [updateCourseCategory] =
        courseCategoryService.useUpdateCourseCategoryMutation();

    const updateCourseCategoryHandler = async (
        data: TUpdateCourseCategoryFromData
    ) => {
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };

        const result = await updateCourseCategory({
            id: courseCategoryID,
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

        navigate("/course-categories", { replace: true });
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Update Course Category
                </h3>
            </TitleCard>

            {category ? (
                <Form<TUpdateCourseCategoryFromData>
                    onSubmit={updateCourseCategoryHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        CourseCategoryResolvers.updateCourseCategoryValidationSchema
                    )}
                >
                    <CourseCategoryImageUploader item={category} />
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

export default CourseCategoriesUpdate;
