import { useNavigate, useParams } from "react-router-dom";
import type z from "zod";
import { productService } from "../../../store/services/productService";
import { productCategoryService } from "../../../store/services/productCategoryService";
import toast from "react-hot-toast";
import type { TProduct, TProductCategory, TError } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import SelectField from "../../../components/common/Form/SelectField";
import FormButton from "../../../components/common/Form/FormButton";
import { useEffect, useState } from "react";
import type { GetProp, UploadProps } from "antd";
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "../../../store/hook";
import { useCurrentToken } from "../../../store/slices/authSlice";
import UploaderSquare from "../../../features/uploader/UploaderSquare";
import Label from "../../../components/common/Form/Label";
import TextareaField from "../../../components/common/Form/TextareaField";
import PDFUploader from "../../../features/uploader/PDFUploader";
import { ProductResolvers } from "../../../resolvers/product.resolvers";
import ArrayInputField from "../../../components/common/Form/ArrayInputField";
import Loader from "../../../components/common/Loader/Loader";
import { useError } from "../../../hooks";
import NumberField from "../../../components/common/Form/NumberField";
import SwitchField from "../../../components/common/Form/SwitchField";
import { Button } from "@headlessui/react";
import { FaTrashAlt } from "react-icons/fa";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const ProductImageUploader = ({ item }: { item: TProduct }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(item?.image);
    type TUpdateProductFromData = z.infer<
        typeof ProductResolvers.updateProductValidationSchema
    >;
    const { setValue } = useFormContext<TUpdateProductFromData>();
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
                size={{ width: "330", height: "460" }}
            />
            <p className="italic text-sm font-semibold text-slate-500 mt-1.5">
                *** Please upload 330*460 and maximum 100kb image for better
                experience ***
            </p>
        </div>
    );
};

const FullPDFUploader = () => {
    type TUpdateProductFromData = z.infer<
        typeof ProductResolvers.updateProductValidationSchema
    >;
    const { setValue } = useFormContext<TUpdateProductFromData>();
    const token = useAppSelector(useCurrentToken);
    const uploadHandler: UploadProps["onChange"] = (info) => {
        if (info.file.status === "done") {
            toast.success("PDF upload successful");
            setValue("fullPDF", info.file.response.data.result);
        } else if (info.file.status === "error") {
            toast.error("PDF upload failed");
        }
    };

    const deleteFullPDFHandler = () => {
        setValue("fullPDF", "");
        toast.success("Full PDF removed");
    };

    return (
        <div className="flex items-center gap-2 my-4">
            <PDFUploader
                token={token as string}
                actionHandler={uploadHandler}
            />
            <Button
                type="button"
                onClick={deleteFullPDFHandler}
                className="text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
            >
                <FaTrashAlt className="w-4 h-4" />
            </Button>
        </div>
    );
};

const ShortPDFUploader = () => {
    type TUpdateProductFromData = z.infer<
        typeof ProductResolvers.updateProductValidationSchema
    >;
    const { setValue } = useFormContext<TUpdateProductFromData>();
    const token = useAppSelector(useCurrentToken);
    const uploadHandler: UploadProps["onChange"] = (info) => {
        if (info.file.status === "done") {
            toast.success("PDF upload successful");
            setValue("shortPDF", info.file.response.data.result);
        } else if (info.file.status === "error") {
            toast.error("PDF upload failed");
        }
    };

    const deleteShortPDFHandler = () => {
        setValue("shortPDF", "");
        toast.success("Short PDF removed");
    };

    return (
        <div className="flex items-center gap-2 my-4">
            <PDFUploader
                token={token as string}
                actionHandler={uploadHandler}
            />
            <Button
                type="button"
                onClick={deleteShortPDFHandler}
                className="text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
            >
                <FaTrashAlt className="w-4 h-4" />
            </Button>
        </div>
    );
};

const CategorySelectField = () => {
    const [categories, setCategories] = useState<
        { value: string; label: string }[]
    >([]);
    const { data: categoriesData } =
        productCategoryService.useGetProductCategoriesQuery([]);
    useEffect(() => {
        if (categoriesData?.data) {
            const transformedCategories = categoriesData.data.result.map(
                (category: TProductCategory) => ({
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

const ProductsUpdate = () => {
    const { productID } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<TProduct | null>(null);

    const { data, isSuccess, isError, error } =
        productService.useGetProductQuery(productID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setProduct(data?.data);
        }
    }, [isSuccess, data]);

    const defaultValues = {
        name: product?.name || "",
        shortDescription: product?.shortDescription || "",
        description: product?.description || [],
        category: product?.category?.id || null,
        price: product?.price || 0,
        offerPrice: product?.offerPrice || 0,
        stock: product?.stock || "In stock",
        isBestSelling: product?.isBestSelling || false,
        isPopular: product?.isPopular || false,
        image: product?.image || "",
        fullPDF: product?.fullPDF || "",
        shortPDF: product?.shortPDF || "",
        status: product?.status || "Active",
    };

    type TUpdateProductFromData = z.infer<
        typeof ProductResolvers.updateProductValidationSchema
    >;

    const [updateProduct] = productService.useUpdateProductMutation();

    const updateProductHandler = async (data: TUpdateProductFromData) => {
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };

        if (payload.price === 0) {
            payload.offerPrice = 0;
        }
        if (!payload?.image) {
            return toast.error("Image required", {
                id: toastId,
            });
        }

        const result = await updateProduct({
            id: productID,
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

        navigate("/products", { replace: true });
    };

    return (
        <div className="max-w-[920px] lg:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Update Product
                </h3>
            </TitleCard>

            {product ? (
                <Form<TUpdateProductFromData>
                    onSubmit={updateProductHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        ProductResolvers.updateProductValidationSchema
                    )}
                >
                    <Label label="Product Image" />
                    <ProductImageUploader item={product} />
                    <div className="grid md:grid-cols-2 gap-x-4">
                        <InputField
                            name="name"
                            placeholder="Product Title"
                            label="Title"
                        />
                        <CategorySelectField />
                    </div>
                    <TextareaField
                        name="shortDescription"
                        label="Short Description"
                        placeholder="Short Description"
                    />
                    <ArrayInputField name="description" label="Description" />
                    <div className="grid md:grid-cols-2 gap-x-4">
                        <NumberField name="price" label="Price" />
                        <NumberField
                            name="offerPrice"
                            label="Offer Price (Optional)"
                        />
                    </div>
                    <SelectField
                        name="stock"
                        placeholder="Select Stock"
                        label="Stock"
                        options={[
                            { value: "In stock", label: "In stock" },
                            { value: "Stock out", label: "Stock out" },
                        ]}
                    />
                    <div className="grid grid-cols-2">
                        <SwitchField
                            name="isBestSelling"
                            label="BestSelling?"
                        />
                        <SwitchField name="isPopular" label="Popular?" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-4">
                        <div>
                            <Label label="Full PDF (Optional)" />
                            <FullPDFUploader />
                        </div>
                        <div>
                            <Label label="Short PDF (Optional)" />
                            <ShortPDFUploader />
                        </div>
                    </div>
                    <SelectField
                        name="status"
                        label="Status"
                        placeholder="Select status"
                        options={[
                            { label: "Active", value: "Active" },
                            { label: "Inactive", value: "Inactive" },
                        ]}
                    />
                    <FormButton>Update Product</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default ProductsUpdate;
