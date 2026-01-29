import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";
import type { IQuestionMCQ, TError } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "../../../components/common/Form/FormButton";
import { useEffect, useMemo, useState } from "react";
import Editor from "../../../components/common/Form/Editor";
import MultiSelectField from "../../../components/common/Form/MultiSelectField";
import { useDebounce } from "use-debounce";
import { questionService } from "../../../store/services/questionService";
import { QuestionResolvers } from "../../../resolvers/question.resolvers";
import { tagService } from "../../../store/services/tagService";
import type { TTag } from "../../../types/tag.types";
import SelectField from "../../../components/common/Form/SelectField";
import { useError } from "../../../hooks";
import Loader from "../../../components/common/Loader/Loader";

const TagsSelectField = ({ defaultValue }: { defaultValue: TTag[] }) => {
    const [tagSearch, setTagSearch] = useState<string>("");
    const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
    const selectedTags = useMemo(() => {
        return defaultValue.map((tag) => ({
            value: tag.id,
            label: tag.name,
        }));
    }, [defaultValue]);

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
            setTags([...selectedTags, ...transformedTags]);
        }
    }, [tagsData, selectedTags]);

    return (
        <MultiSelectField
            name="tags"
            placeholder="Select Tags"
            label="Tags"
            onSearch={setTagSearch}
            options={tags}
            disable={tags.length === 0}
        />
    );
};

const MCQUpdate = () => {
    const { mcqID } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState<IQuestionMCQ | null>(null);
    const { data, isSuccess, isError, error } =
        questionService.useGetQuestionQuery(mcqID);
    useError(isError as boolean, error as TError);
    useEffect(() => {
        if (isSuccess && data?.success) {
            setQuestion(data?.data);
        }
    }, [isSuccess, data]);

    const correctOptionIndex = question?.options.findIndex(
        (option: string) => option === question.answer
    );

    const mcqFormSchema = z.object({
        question: z.string().min(1, "Question is required"),
        options: z
            .array(z.string().min(1, "Option cannot be empty"))
            .length(4, "There must be 4 options"),
        correctOptionIndex: z.string(),
        explaination: z.string().optional(),
        tags: z.array(z.string()).optional(),
    });

    type TMCQFormData = z.infer<typeof mcqFormSchema>;

    const defaultValues = {
        question: question?.question || "",
        options: question?.options || ["", "", "", ""],
        correctOptionIndex:
            correctOptionIndex !== -1 ? correctOptionIndex?.toString() : "0",
        explaination: question?.explaination || "",
        tags: question?.tags?.map((tag: TTag) => tag.id) || [],
    };

    type TUpdateMCQFromData = z.infer<
        typeof QuestionResolvers.updateQuestionValidationSchema
    >;

    const [updateQuestion] = questionService.useUpdateQuestionMutation();

    const updateMCQHandler = async (data: TMCQFormData) => {
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
        } as TUpdateMCQFromData;

        const result = await updateQuestion({ id: mcqID, ...payload });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Update successful", {
                id: toastId,
            });
            navigate("/questions/MCQ", { replace: true });
        }
    };

    return (
        <div className="max-w-[920px] lg:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Update MCQ
                </h3>
            </TitleCard>

            {defaultValues.question ? (
                <Form<TMCQFormData>
                    onSubmit={updateMCQHandler}
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
                    <TagsSelectField defaultValue={question?.tags || []} />
                    <FormButton>Update MCQ</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default MCQUpdate;
