import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Flex, Upload } from "antd";
import type { GetProp, UploadProps } from "antd";
import toast from "react-hot-toast";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

// const getBase64 = (img: FileType, callback: (url: string) => void) => {
//     const reader = new FileReader();
//     reader.addEventListener("load", () => callback(reader.result as string));
//     reader.readAsDataURL(img);
// };

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
        toast.error("You can only upload JPG/PNG file!");
    }
    const isLtSize = file.size / 1024 / 1024 < 2;
    if (!isLtSize) {
        toast.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLtSize;
};

const Uploader = ({
    token,
    actionHandler,
    loading,
    imageUrl,
    size,
}: {
    token: string;
    actionHandler: UploadProps["onChange"];
    loading: boolean;
    imageUrl: string;
    size: { width: string; height: string };
}) => {
    // const [loading, setLoading] = useState(false);
    // const [imageUrl, setImageUrl] = useState<string>();

    // const handleChange: UploadProps["onChange"] = (info) => {
    //     if (info.file.status === "uploading") {
    //         setLoading(true);
    //         return;
    //     }
    //     if (info.file.status === "done") {
    //         // Get this url from response in real world.
    //         getBase64(info.file.originFileObj as FileType, (url) => {
    //             setLoading(false);
    //             setImageUrl(url);
    //         });
    //     }
    // };

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <div>
            <Flex gap="middle" wrap>
                <Upload
                    name="file"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={`${import.meta.env.VITE_BACKEND_URL}/media/${
                        size.width
                    }/${size.height}`}
                    headers={{
                        Authorization: `bearer ${token}`,
                    }}
                    beforeUpload={beforeUpload}
                    onChange={actionHandler}
                >
                    {imageUrl ? (
                        <div className="w-full h-full overflow-hidden rounded-full">
                            <img
                                src={imageUrl}
                                alt="avatar"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    objectPosition: "center",
                                }}
                            />
                        </div>
                    ) : (
                        uploadButton
                    )}
                </Upload>
            </Flex>
        </div>
    );
};

export default Uploader;
