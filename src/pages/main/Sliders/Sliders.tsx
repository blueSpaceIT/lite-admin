import { useEffect, useState } from "react";
import type { TError, TMeta, TSlider, TSliderGallery } from "../../../types";
import { sliderService } from "../../../store/services/sliderService";
import type z from "zod";
import { SliderResolvers } from "../../../resolvers/slider.resolvers";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import TagField from "../../../components/common/Form/TagField";
import FormButton from "../../../components/common/Form/FormButton";
import { useAppSelector } from "../../../store/hook";
import { useCurrentToken } from "../../../store/slices/authSlice";
import type { GetProp, UploadProps } from "antd";
import UploaderSquare from "../../../features/uploader/UploaderSquare";
import Loader from "../../../components/common/Loader/Loader";
import Pagination from "../../../components/common/Pagination/Pagination";
import InputField from "../../../components/common/Form/InputField";
import { useFormContext } from "react-hook-form";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const SliderImageUploader = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    type TSliderGalleryFromData = z.infer<
        typeof SliderResolvers.sliderGalleryValidationSchema
    >;
    const { setValue } = useFormContext<TSliderGalleryFromData>();
    const token = useAppSelector(useCurrentToken);
    const uploadHandler: UploadProps["onChange"] = async (info) => {
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
            setValue("url", info.file.response.data.url);
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
                size={{ width: "1000", height: "430" }}
            />
            <p className="italic text-sm font-semibold text-slate-500 mt-1.5">
                *** Please upload 1000*430 and maximum 120kb image for better
                experience ***
            </p>
        </div>
    );
};

const Sliders = () => {
    const [slider, setSlider] = useState<TSlider | null>(null);
    const [bookSlider, setBookSlider] = useState<TSlider | null>(null);
    const [sliderGallery, setSliderGallery] = useState<TSliderGallery[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });

    const { data, isSuccess } = sliderService.useGetSliderQuery("slider");
    const { data: bookSliderData, isSuccess: bookSliderSuccess } =
        sliderService.useGetSliderQuery("book-slider");

    const [searchParams, setSearchParams] = useSearchParams();
    const { data: sliderGalleryData, isSuccess: sliderGallerySuccess } =
        sliderService.useGetSliderGalleriesQuery(
            searchParams ? [...searchParams] : undefined
        );

    useEffect(() => {
        if (isSuccess && data?.success) {
            setSlider(data?.data);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (bookSliderSuccess && bookSliderData?.success) {
            setBookSlider(bookSliderData?.data);
        }
    }, [bookSliderSuccess, bookSliderData]);

    useEffect(() => {
        if (sliderGallerySuccess && sliderGalleryData?.success) {
            setSliderGallery(sliderGalleryData?.data?.result);
            setMeta(sliderGalleryData?.data?.meta);
        }
    }, [sliderGallerySuccess, sliderGalleryData]);

    const sliderGalleryDefaultValues = {
        url: "",
        destination: "",
    };

    const defaultValues = {
        images: slider?.images.map((item) => item._id) || null,
    };

    const bookSliderDefaultValues = {
        images: bookSlider?.images.map((item) => item._id) || null,
    };

    type TSliderGalleryFromData = z.infer<
        typeof SliderResolvers.sliderGalleryValidationSchema
    >;

    type TSliderFromData = z.infer<
        typeof SliderResolvers.sliderValidationSchema
    >;

    const handleCopyURL = async (id: string) => {
        await navigator.clipboard.writeText(id);
        toast.success("Copied successfully");
    };

    const [createSliderGallery] =
        sliderService.useCreateSliderGalleryMutation();
    const [updateSlider] = sliderService.useCreateSliderMutation();

    const createSliderGalleryHandler = async (data: TSliderGalleryFromData) => {
        const toastId = toast.loading("Wait a while");
        const result = await createSliderGallery(data);
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Created successfull", {
                id: toastId,
            });
        }

        window.location.href = "/sliders";
    };

    const updateSliderHandler = async (data: TSliderFromData) => {
        const toastId = toast.loading("Wait a while");
        const result = await updateSlider({ id: "slider", ...data });
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

        window.location.href = "/sliders";
    };

    const updateBookSliderHandler = async (data: TSliderFromData) => {
        const toastId = toast.loading("Wait a while");
        const result = await updateSlider({ id: "book-slider", ...data });
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

        window.location.href = "/sliders";
    };

    return (
        <div>
            <div className="max-w-[1240px] md:w-full md:mx-auto mb-10">
                <TitleCard>
                    <h3 className="text-center text-lg lg:text-2xl font-bold">
                        Sliders
                    </h3>
                </TitleCard>

                <div className="grid gap-6">
                    <Form<TSliderGalleryFromData>
                        onSubmit={createSliderGalleryHandler}
                        defaultValues={sliderGalleryDefaultValues}
                        resolver={zodResolver(
                            SliderResolvers.sliderGalleryValidationSchema
                        )}
                    >
                        <SliderImageUploader />
                        <InputField
                            name="destination"
                            placeholder="Course Url"
                            label="Course Url"
                        />
                        <FormButton>Update Slide</FormButton>
                    </Form>

                    {slider && (
                        <Form<TSliderFromData>
                            onSubmit={updateSliderHandler}
                            defaultValues={defaultValues}
                            resolver={zodResolver(
                                SliderResolvers.sliderValidationSchema
                            )}
                        >
                            <TagField
                                name="images"
                                placeholder="Images"
                                label="Home Slider"
                            />
                            <FormButton>Update Slider</FormButton>
                        </Form>
                    )}

                    {bookSlider && (
                        <Form<TSliderFromData>
                            onSubmit={updateBookSliderHandler}
                            defaultValues={bookSliderDefaultValues}
                            resolver={zodResolver(
                                SliderResolvers.sliderValidationSchema
                            )}
                        >
                            <TagField
                                name="images"
                                placeholder="Images"
                                label="Book Slider"
                            />
                            <FormButton>Update Slider</FormButton>
                        </Form>
                    )}

                    {sliderGallery ? (
                        <div>
                            <div className="mt-10 mb-6 grid lg:grid-cols-2 gap-5">
                                {sliderGallery.map((item) => (
                                    <div
                                        key={item._id}
                                        className="rounded-xl overflow-hidden"
                                        onClick={() => handleCopyURL(item._id)}
                                    >
                                        <img src={item.url} alt="" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center">
                                <Pagination
                                    meta={meta}
                                    setSearchParams={setSearchParams}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center mt-12 mb-5">
                            <Loader />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sliders;
