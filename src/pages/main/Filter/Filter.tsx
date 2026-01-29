import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { tagService } from "../../../store/services/tagService";
import type { TTag } from "../../../types";
import Form from "../../../components/common/Form/Form";
import MultiSelectField from "../../../components/common/Form/MultiSelectField";
import type { FieldValues } from "react-hook-form";

const TeachersSelectField = () => {
    const [teacherSearch, setTeacherSearch] = useState<string>("");
    const [teachers, setTeachers] = useState<
        { value: string; label: string }[]
    >([]);

    const [debouncedSearchTerm] = useDebounce(teacherSearch, 500);

    const { data: teachersData } = tagService.useGetTagsQuery([
        ["searchTerm", debouncedSearchTerm || ""],
    ]);
    useEffect(() => {
        if (teachersData?.data) {
            const transformedTeachers = teachersData.data.result.map(
                (user: TTag) => ({
                    value: user.id,
                    label: user.name,
                })
            );
            setTeachers(transformedTeachers);
        } else {
            setTeachers([]); // reset properly
        }
    }, [teachersData]);

    return (
        <MultiSelectField
            name="teachers"
            placeholder="Select Teachers"
            label="Teachers"
            onSearch={setTeacherSearch}
            options={[...teachers]}
            disable={teachers.length === 0}
        />
    );
};

const Filter = () => {
    const submitHandler = async (data: FieldValues) => {
        console.log(data);
    };

    return (
        <Form onSubmit={submitHandler} defaultValues={{ teachers: [] }}>
            <TeachersSelectField />
        </Form>
    );
};

export default Filter;
