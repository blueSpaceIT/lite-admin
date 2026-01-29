import { useNavigate } from "react-router-dom";
import type z from "zod";
import { productService } from "../../../store/services/productService";
import { productCategoryService } from "../../../store/services/productCategoryService";
import toast from "react-hot-toast";
import type { TProductCategory, TError } from "../../../types";
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
import NumberField from "../../../components/common/Form/NumberField";
import SwitchField from "../../../components/common/Form/SwitchField";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const ProductImageUploader = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    type TCreateProductFromData = z.infer<
        typeof ProductResolvers.createProductValidationSchema
    >;
    const { setValue } = useFormContext<TCreateProductFromData>();
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
    type TCreateProductFromData = z.infer<
        typeof ProductResolvers.createProductValidationSchema
    >;
    const { setValue } = useFormContext<TCreateProductFromData>();
    const token = useAppSelector(useCurrentToken);
    const uploadHandler: UploadProps["onChange"] = (info) => {
        if (info.file.status === "done") {
            toast.success("PDF upload successful");
            setValue("fullPDF", info.file.response.data.result);
        } else if (info.file.status === "error") {
            toast.error("PDF upload failed");
        }
    };

    return (
        <div className="my-4">
            <PDFUploader
                token={token as string}
                actionHandler={uploadHandler}
            />
        </div>
    );
};

const ShortPDFUploader = () => {
    type TCreateProductFromData = z.infer<
        typeof ProductResolvers.createProductValidationSchema
    >;
    const { setValue } = useFormContext<TCreateProductFromData>();
    const token = useAppSelector(useCurrentToken);
    const uploadHandler: UploadProps["onChange"] = (info) => {
        if (info.file.status === "done") {
            toast.success("PDF upload successful");
            setValue("shortPDF", info.file.response.data.result);
        } else if (info.file.status === "error") {
            toast.error("PDF upload failed");
        }
    };

    return (
        <div className="my-4">
            <PDFUploader
                token={token as string}
                actionHandler={uploadHandler}
            />
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

const ProductsCreate = () => {
    const navigate = useNavigate();
    type TCreateProductFromData = z.infer<
        typeof ProductResolvers.createProductValidationSchema
    >;

    const defaultValues: Partial<TCreateProductFromData> = {
        name: "",
        shortDescription: "",
        description: [],
        category: null,
        price: 0,
        offerPrice: 0,
        stock: "In stock",
        isBestSelling: false as boolean,
        isPopular: false as boolean,
        image: "",
        fullPDF: "",
        shortPDF: "",
    };

    const [createProduct] = productService.useCreateProductMutation();

    const createProductHandler = async (data: TCreateProductFromData) => {
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };

        if (!payload?.shortDescription) {
            delete payload.shortDescription;
        }
        if (payload.price === 0) {
            payload.offerPrice = 0;
        }
        if (!payload?.image) {
            return toast.error("Image required", {
                id: toastId,
            });
        }
        if (!payload?.fullPDF) {
            delete payload.fullPDF;
        }
        if (!payload?.shortPDF) {
            delete payload.shortPDF;
        }

        const result = await createProduct(payload);
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Create successful", {
                id: toastId,
            });
            navigate("/products", { replace: true });
        }
    };

    return (
        <div className="max-w-[920px] lg:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create Product
                </h3>
            </TitleCard>

            <Form<TCreateProductFromData>
                onSubmit={createProductHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(
                    ProductResolvers.createProductValidationSchema
                )}
            >
                <Label label="Product Image" />
                <ProductImageUploader />
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
                    <SwitchField name="isBestSelling" label="BestSelling?" />
                    <SwitchField name="isPopular" label="Popular?" />
                </div>
                <Label label="Full PDF (Optional)" />
                <FullPDFUploader />
                <Label label="Short PDF (Optional)" />
                <ShortPDFUploader />
                <FormButton>Create Product</FormButton>
            </Form>
        </div>
    );
};

export default ProductsCreate;
