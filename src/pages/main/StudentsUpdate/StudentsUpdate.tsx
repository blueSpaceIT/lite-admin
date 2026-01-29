import { useNavigate, useParams } from "react-router-dom";
import Form from "../../../components/common/Form/Form";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import type z from "zod";
import { StudentResolvers } from "../../../resolvers/students.resolvers";
import { useEffect, useState } from "react";
import type { TStudent, TError } from "../../../types";
import { studentService } from "../../../store/services/studentService";
import { useError } from "../../../hooks";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/common/Form/InputField";
import TextareaField from "../../../components/common/Form/TextareaField";
import FormButton from "../../../components/common/Form/FormButton";
import Loader from "../../../components/common/Loader/Loader";

const StudentsUpdate = () => {
    const { studentID } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState<TStudent | null>(null);

    const { data, isSuccess, isError, error } =
        studentService.useGetStudentQuery(studentID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setStudent(data?.data);
        }
    }, [isSuccess, data]);

    const defaultValues = {
        name: student?.name || "",
        address: student?.address || "",
        guardian: {
            name: student?.guardian?.name || "",
            phone: student?.guardian?.phone || "",
        },
        school: student?.school || "",
        college: student?.college || "",
    };

    type TUpdateStudentFormData = z.infer<
        typeof StudentResolvers.updateStudentValidationSchema
    >;

    const [updateStudent] = studentService.useUpdateStudentMutation();

    const updateStudentHandler = async (data: TUpdateStudentFormData) => {
        const toastId = toast.loading("Wait a while");
        const payload = { ...data };

        const result = await updateStudent({ id: studentID, ...payload });
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

        navigate("/students", { replace: true });
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Update Student
                </h3>
            </TitleCard>

            {student ? (
                <Form<TUpdateStudentFormData>
                    onSubmit={updateStudentHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(
                        StudentResolvers.updateStudentValidationSchema
                    )}
                >
                    <InputField
                        name="name"
                        placeholder="Full Name"
                        label="Name"
                    />
                    <TextareaField
                        name="address"
                        placeholder="Full Address"
                        label="Address (Optional)"
                    />
                    <InputField
                        name="guardian.name"
                        placeholder="Guardian's Name"
                        label="Guardian's Name (Optional)"
                    />
                    <InputField
                        name="guardian.phone"
                        placeholder="Guardian's Phone"
                        label="Guardian's Phone (Optional)"
                    />
                    <InputField
                        name="school"
                        placeholder="School Name"
                        label="School (Optional)"
                    />
                    <InputField
                        name="college"
                        placeholder="College Name"
                        label="College (Optional)"
                    />
                    <FormButton>Update Student</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default StudentsUpdate;
