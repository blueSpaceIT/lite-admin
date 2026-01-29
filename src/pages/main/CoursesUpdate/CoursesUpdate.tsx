import { useNavigate, useParams } from "react-router-dom";
import { CourseResolvers } from "../../../resolvers/course.resolvers";
import type z from "zod";
import { courseService } from "../../../store/services/courseService";
import { courseCategoryService } from "../../../store/services/courseCategoryService";
import toast from "react-hot-toast";
import type { TAdmin, TCourse, TCourseCategory, TError } from "../../../types";
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
import NumberField from "../../../components/common/Form/NumberField";
import Loader from "../../../components/common/Loader/Loader";
import { useError } from "../../../hooks";
import Label from "../../../components/common/Form/Label";
import Editor from "../../../components/common/Form/Editor";
import { useDebounce } from "use-debounce";
import { adminService } from "../../../store/services/adminService";
import MultiSelectField from "../../../components/common/Form/MultiSelectField";
import TextareaField from "../../../components/common/Form/TextareaField";
import PDFUploader from "../../../features/uploader/PDFUploader";
import { Button } from "@headlessui/react";
import { FaTrashAlt } from "react-icons/fa";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const CourseImageUploader = ({ item }: { item: TCourse }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(item?.image);
    type TUpdateCourseFromData = z.infer<
        typeof CourseResolvers.updateCourseValidationSchema
    >;
    const { setValue } = useFormContext<TUpdateCourseFromData>();
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
                size={{ width: "400", height: "225" }}
            />
            <p className="italic text-sm font-semibold text-slate-500 mt-1.5">
                *** Please upload 400*225 and maximum 100kb image for better
                experience ***
            </p>
        </div>
    );
};

const CourseRoutineUploader = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    type TCreateCourseFromData = z.infer<
        typeof CourseResolvers.createCourseValidationSchema
    >;
    const { setValue } = useFormContext<TCreateCourseFromData>();
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
            setValue("routine", info.file.response.data.url);
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const deleteRoutineHandler = () => {
        setValue("routine", "");
        toast.success("Routine removed");
    };

    return (
        <div className="mt-5 mb-5">
            <div>
                <UploaderSquare
                    token={token as string}
                    actionHandler={uploadHandler}
                    loading={loading}
                    imageUrl={imageUrl as string}
                    size={{ width: "450", height: "auto" }}
                />
                <Button
                    type="button"
                    onClick={deleteRoutineHandler}
                    className="text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
                >
                    <FaTrashAlt className="w-4 h-4" />
                </Button>
            </div>
            <p className="italic text-sm font-semibold text-slate-500 mt-1.5">
                *** Please upload width 450px and maximum 220kb image for better
                experience ***
            </p>
        </div>
    );
};

const RoutinePDFUploader = () => {
    type TCreateNoteFromData = z.infer<
        typeof CourseResolvers.createCourseValidationSchema
    >;
    const { setValue } = useFormContext<TCreateNoteFromData>();
    const token = useAppSelector(useCurrentToken);
    const uploadHandler: UploadProps["onChange"] = (info) => {
        if (info.file.status === "done") {
            toast.success("PDF upload successful");
            setValue("routinePDF", info.file.response.data.result);
        } else if (info.file.status === "error") {
            toast.error("PDF upload failed");
        }
    };

    const deleteRoutinePDFHandler = () => {
        setValue("routinePDF", "");
        toast.success("Routine PDF removed");
    };

    return (
        <div className="flex items-center gap-2 my-4">
            <PDFUploader
                token={token as string}
                actionHandler={uploadHandler}
            />
            <Button
                type="button"
                onClick={deleteRoutinePDFHandler}
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
        courseCategoryService.useGetCourseCategoriesQuery([]);
    useEffect(() => {
        if (categoriesData?.data) {
            const transformedCategories = categoriesData.data.result.map(
                (category: TCourseCategory) => ({
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

const TeachersSelectField = () => {
    const [teacherSearch, setTeacherSearch] = useState<string>("");
    const [teachers, setTeachers] = useState<
        { value: string; label: string }[]
    >([]);

    const [debouncedSearchTerm] = useDebounce(teacherSearch, 500);

    const { data: teachersData } = adminService.useGetAdminsQuery(
        debouncedSearchTerm
            ? [
                  ["searchTerm", debouncedSearchTerm],
                  ["role", "teacher"],
              ]
            : [["role", "teacher"]]
    );
    useEffect(() => {
        if (teachersData?.data) {
            const transformedTeachers = teachersData.data.result.map(
                (user: TAdmin) => ({
                    value: user.id,
                    label: user.name,
                })
            );
            setTeachers(transformedTeachers);
        }
    }, [teachersData]);

    return (
        <MultiSelectField
            name="teachers"
            placeholder="Select Teachers"
            label="Teachers"
            onSearch={setTeacherSearch}
            options={teachers}
            disable={!teachers}
        />
    );
};

const CoursesUpdate = () => {
    const { courseID } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState<TCourse | null>(null);

    const { data, isSuccess, isError, error } =
        courseService.useGetCourseQuery(courseID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setCourse(data?.data);
        }
    }, [isSuccess, data]);

    const defaultValues = {
        name: course?.name || "",
        code: course?.code || "",
        typeCode: course?.typeCode || "",
        shortDescription: course?.shortDescription || "",
        description: course?.description || "",
        type: course?.type || "Online",
        category: course?.category?.id || null,
        teachers: null as string[] | null,
        price: course?.price || 0,
        offerPrice: course?.offerPrice || 0,
        trailer: course?.trailer || "",
        duration: course?.duration || ["", "Days"],
        expiredTime: course?.expiredTime || [0, "Days"],
        routine: course?.routine || "",
        routinePDF: course?.routinePDF || "",
        image: course?.image || "",
    };

    if (course?.teachers) {
        const teachers = course.teachers.map((item) => item.id);
        defaultValues.teachers = teachers;
    }

    type TUpdateCourseFromData = z.infer<
        typeof CourseResolvers.updateCourseValidationSchema
    >;

    const [updateCourse] = courseService.useUpdateCourseMutation();

    const updateCourseHandler = async (data: TUpdateCourseFromData) => {
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

        const result = await updateCourse({
            id: courseID,
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

        navigate("/courses", { replace: true });
    };

    return (
        <div className="max-w-[920px] lg:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Update Course
                </h3>
            </TitleCard>

            {course ? (
                <Form<TUpdateCourseFromData>
                    onSubmit={updateCourseHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        CourseResolvers.updateCourseValidationSchema
                    )}
                >
                    <Label label="Course Image" />
                    <CourseImageUploader item={course} />
                    <div className="grid md:grid-cols-2 gap-x-4">
                        <InputField
                            name="name"
                            placeholder="Course Title"
                            label="Title"
                        />
                        <CategorySelectField />
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-4">
                        <InputField
                            name="code"
                            placeholder="Course Code"
                            label="Course Code"
                        />
                        <InputField
                            name="typeCode"
                            placeholder="Course Type Code"
                            label="Course Type Code"
                        />
                    </div>
                    <TextareaField
                        name="shortDescription"
                        label="Short Description"
                        placeholder="Short Description"
                    />
                    <Editor name="description" label="Description" />
                    <div className="grid md:grid-cols-2 gap-x-4">
                        <SelectField
                            name="type"
                            label="Course Type"
                            placeholder="Select type"
                            options={[
                                { label: "Online", value: "Online" },
                                { label: "Offline", value: "Offline" },
                            ]}
                        />
                        <InputField
                            name="trailer"
                            placeholder="Trailer URL"
                            label="Trailer (Optional)"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-4">
                        <NumberField name="price" label="Price" />
                        <NumberField
                            name="offerPrice"
                            label="Offer Price (Optional)"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-4">
                        <div className="grid grid-cols-2 gap-x-4">
                            <NumberField name="duration[0]" label="Duration" />
                            <SelectField
                                name="duration[1]"
                                placeholder="Select unit"
                                label="Unit"
                                options={[
                                    { label: "Days", value: "Days" },
                                    { label: "Months", value: "Months" },
                                    { label: "Years", value: "Years" },
                                ]}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4">
                            <NumberField
                                name="expiredTime[0]"
                                label="Expired Time"
                            />
                            <SelectField
                                name="expiredTime[1]"
                                label="Unit"
                                placeholder="Select unit"
                                options={[
                                    { label: "Days", value: "Days" },
                                    { label: "Months", value: "Months" },
                                    { label: "Years", value: "Years" },
                                ]}
                            />
                        </div>
                    </div>
                    <TeachersSelectField />
                    <Label label="Course Routine (Optional)" />
                    <CourseRoutineUploader />
                    <RoutinePDFUploader />
                    <FormButton>Update Course</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default CoursesUpdate;
