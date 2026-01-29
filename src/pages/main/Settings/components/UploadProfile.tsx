import type { GetProp, UploadProps } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
    setUser,
    useCurrentToken,
    useCurrentUser,
} from "../../../../store/slices/authSlice";
import { adminService } from "../../../../store/services/adminService";
import type { TError } from "../../../../types";
import Uploader from "../../../../features/uploader/Uploader";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const AdminImageUploader = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const dispatch = useAppDispatch();
    const token = useAppSelector(useCurrentToken);
    const user = useAppSelector(useCurrentUser);

    useEffect(() => {
        if (user?.image) {
            setImageUrl(user.image);
        }
    }, [user]);

    const [updateAdmin] = adminService.useUpdateAdminMutation();
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
            // info.file.response.data.url
            const payload = {
                id: user?.id,
                image: info.file.response.data.url,
            };
            const result = await updateAdmin(payload);
            if (result?.error) {
                toast.error((result?.error as TError)?.data?.message);
            }
            if (result?.data) {
                toast.success("Image upload successfull");
                dispatch(
                    setUser({
                        user: {
                            ...user,
                            image: info.file.response.data.url,
                        },
                        token,
                    })
                );
            }

            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });

            // window.location.reload();
        }
    };

    return (
        <div className="mt-5 mb-5">
            <Uploader
                token={token as string}
                actionHandler={uploadHandler}
                loading={loading}
                imageUrl={imageUrl as string}
                size={{ width: "200", height: "200" }}
            />
            <p className="italic text-sm font-semibold text-slate-500 mt-1.5">
                *** Please upload 300*300 and maximum 200kb profile for better
                experience ***
            </p>
        </div>
    );
};

const UploadProfile = () => {
    return (
        <div>
            <AdminImageUploader />
        </div>
    );
};

export default UploadProfile;
