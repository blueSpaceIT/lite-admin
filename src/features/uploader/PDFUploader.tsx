import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import type { GetProp, UploadProps } from "antd";
import toast from "react-hot-toast";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const beforeUpload = (file: FileType) => {
    const isPdf = file.type === "application/pdf";
    if (!isPdf) {
        toast.error("You can only upload PDF files!");
    }

    const isLtSize = file.size / 1024 / 1024 < 5;
    if (!isLtSize) {
        toast.error("PDF must be smaller than 5MB!");
    }

    return isPdf && isLtSize;
};

const PDFUploader = ({
    token,
    actionHandler,
}: {
    token: string;
    actionHandler: UploadProps["onChange"];
}) => {
    return (
        <Upload
            name="file"
            action={`${import.meta.env.VITE_BACKEND_URL}/media/upload-pdf`}
            headers={{
                Authorization: `bearer ${token}`,
            }}
            beforeUpload={beforeUpload}
            onChange={actionHandler}
        >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
    );
};

export default PDFUploader;
