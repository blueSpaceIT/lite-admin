import { Link } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";
import type { TError } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "../../../components/common/Form/FormButton";
import { useEffect, useState } from "react";
import Editor from "../../../components/common/Form/Editor";
import MultiSelectField from "../../../components/common/Form/MultiSelectField";
import { useDebounce } from "use-debounce";
import { questionService } from "../../../store/services/questionService";
import { QuestionResolvers } from "../../../resolvers/question.resolvers";
import { tagService } from "../../../store/services/tagService";
import type { TTag } from "../../../types/tag.types";
import SelectField from "../../../components/common/Form/SelectField";
import { Button } from "@headlessui/react";

const TagsSelectField = () => {
    const [tagSearch, setTagSearch] = useState<string>("");
    const [tags, setTags] = useState<{ value: string; label: string }[]>([]);

    const [debouncedSearchTerm] = useDebounce(tagSearch, 500);

    const { data: tagsData } = tagService.useGetTagsQuery(
        debouncedSearchTerm ? [["searchTerm", debouncedSearchTerm]] : []
    );
    useEffect(() => {
        if (tagsData?.data) {
            const transformedTags = tagsData.data.result.map((tag: TTag) => ({
                value: tag.id,
                label: tag.name,
            }));
            setTags(transformedTags);
        }
    }, [tagsData]);

    return (
        <MultiSelectField
            name="tags"
            placeholder="Select Tags"
            label="Tags"
            onSearch={setTagSearch}
            options={tags}
            disable={!tags}
        />
    );
};

const MCQCreate = () => {
    const mcqFormSchema = z.object({
        question: z.string().min(1, "Question is required"),
        options: z
            .array(z.string().min(1, "Option cannot be empty"))
            .length(4, "There must be 4 options"),
        correctOptionIndex: z.string(),
        explaination: z.string().optional(),
        tags: z.array(z.string()).nullable().optional(),
    });

    type TMCQFormData = z.infer<typeof mcqFormSchema>;

    const defaultValues: TMCQFormData = {
        question: "",
        options: ["", "", "", ""],
        correctOptionIndex: "0",
        explaination: "",
        tags: null,
    };

    type TCreateMCQFromData = z.infer<
        typeof QuestionResolvers.createQuestionValidationSchema
    >;

    const [createQuestion] = questionService.useCreateQuestionMutation();

    const createMCQHandler = async (data: TMCQFormData) => {
        const toastId = toast.loading("Wait a while");

        const { correctOptionIndex, ...rest } = data;
        const answer = data.options[parseInt(correctOptionIndex, 10)];

        if (!answer) {
            toast.error("Correct answer cannot be empty", { id: toastId });
            return;
        }

        const payload = {
            ...rest,
            answer,
            type: "MCQ",
        } as TCreateMCQFromData;

        if (!payload?.tags?.length) {
            delete payload.tags;
        }
        if (!payload?.explaination) {
            delete payload.explaination;
        }

        const result = await createQuestion(payload);
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Create successful", {
                id: toastId,
            });
        }
    };

    return (
        <div className="max-w-[920px] lg:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create MCQ
                </h3>
            </TitleCard>

            <div className="flex justify-end items-center gap-2 mb-6">
                <Link to={"/questions/MCQ"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        Questions
                    </Button>
                </Link>
            </div>

            <Form<TMCQFormData>
                onSubmit={createMCQHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(mcqFormSchema)}
            >
                <Editor name="question" label="Question" />
                <div className="grid md:grid-cols-2 gap-x-4">
                    <Editor name="options.0" label="Option 1" />
                    <Editor name="options.1" label="Option 2" />
                </div>
                <div className="grid md:grid-cols-2 gap-x-4">
                    <Editor name="options.2" label="Option 3" />
                    <Editor name="options.3" label="Option 4" />
                </div>
                <SelectField
                    name="correctOptionIndex"
                    label="Correct Answer"
                    placeholder="Select Correct Answer"
                    options={[
                        { label: "Option 1", value: "0" },
                        { label: "Option 2", value: "1" },
                        { label: "Option 3", value: "2" },
                        { label: "Option 4", value: "3" },
                    ]}
                />
                <Editor name="explaination" label="Explanation" />
                <TagsSelectField />
                <FormButton>Create MCQ</FormButton>
            </Form>
        </div>
    );
};

export default MCQCreate;
