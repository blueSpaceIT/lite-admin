import type { GetProp, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../store/hook";
import { useCurrentToken } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";
import UploaderSquare from "../../../features/uploader/UploaderSquare";
import type { TMedia, TMeta } from "../../../types";
import { useSearchParams } from "react-router-dom";
import { mediaService } from "../../../store/services/mediaService";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Loader from "../../../components/common/Loader/Loader";
import Pagination from "../../../components/common/Pagination/Pagination";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const ImageUploader = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
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
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
            window.location.href = "/gallery";
        }
    };

    return (
        <div className="mt-5 mb-5">
            <UploaderSquare
                token={token as string}
                actionHandler={uploadHandler}
                loading={loading}
                imageUrl={imageUrl as string}
                size={{ width: "250", height: "auto" }}
            />
            <p className="italic text-sm font-semibold text-slate-500 mt-1.5">
                *** Please upload width 250px and maximum 60kb image for better
                experience ***
            </p>
        </div>
    );
};

const Gallery = () => {
    const [images, setImages] = useState<TMedia[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isSuccess, isFetching, isLoading } =
        mediaService.useGetMediumQuery(
            searchParams ? [...searchParams] : undefined
        );

    useEffect(() => {
        if (isSuccess && data?.success) {
            setImages(data?.data?.result);
            setMeta(data?.data?.meta);
        }
    }, [isSuccess, data]);

    const handleCopyURL = async (url: string) => {
        await navigator.clipboard.writeText(url);
        toast.success("Copied successfully");
    };

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Gallery
                </h3>
            </TitleCard>

            <div className="mb-10">
                <ImageUploader />
            </div>

            {isFetching || isLoading ? (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            ) : (
                <div>
                    <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
                        {images.map((image) => (
                            <div
                                className="max-w-[250px] w-full rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => handleCopyURL(image.url)}
                            >
                                <img src={image.url} alt="" />
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
            )}
        </div>
    );
};

export default Gallery;
