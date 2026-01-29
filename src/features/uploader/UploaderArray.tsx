import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import toast from "react-hot-toast";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

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

const UploaderArray = ({
    token,
    actionHandler,
    fileList,
    size,
}: {
    token: string;
    actionHandler: UploadProps["onChange"];
    fileList: UploadFile[];
    size: { width: string; height: string };
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <div>
            <Upload
                action={`${import.meta.env.VITE_BACKEND_URL}/media/${
                    size.width
                }/${size.height}`}
                headers={{
                    Authorization: `bearer ${token}`,
                }}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                beforeUpload={beforeUpload}
                onChange={actionHandler}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                            !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                />
            )}
        </div>
    );
};

export default UploaderArray;
