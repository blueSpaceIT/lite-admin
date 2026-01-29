import { useEffect, useMemo, useState } from "react";
import type { IQuestionCQ, TError, TTag } from "../../../types";
import { useDebounce } from "use-debounce";
import { tagService } from "../../../store/services/tagService";
import MultiSelectField from "../../../components/common/Form/MultiSelectField";
import Loader from "../../../components/common/Loader/Loader";
import FormButton from "../../../components/common/Form/FormButton";
import Editor from "../../../components/common/Form/Editor";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "../../../components/common/Form/Form";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import toast from "react-hot-toast";
import { questionService } from "../../../store/services/questionService";
import type { QuestionResolvers } from "../../../resolvers/question.resolvers";
import z from "zod";
import { useError } from "../../../hooks";
import { useNavigate, useParams } from "react-router-dom";

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

const CQUpdate = () => {
    const { cqID } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState<IQuestionCQ | null>(null);
    const { data, isSuccess, isError, error } =
        questionService.useGetQuestionQuery(cqID);
    useError(isError as boolean, error as TError);
    useEffect(() => {
        if (isSuccess && data?.success) {
            setQuestion(data?.data);
        }
    }, [isSuccess, data]);

    const cqFormSchema = z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
        explaination: z.string().optional(),
        tags: z.array(z.string()).optional(),
    });

    type TCQFormData = z.infer<typeof cqFormSchema>;

    const defaultValues = {
        question: question?.question || "",
        answer: question?.answer || "",
        explaination: question?.explaination || "",
        tags: question?.tags?.map((tag: TTag) => tag.id) || [],
    };

    type TUpdateCQFromData = z.infer<
        typeof QuestionResolvers.updateQuestionValidationSchema
    >;

    const [updateQuestion] = questionService.useUpdateQuestionMutation();

    const updateMCQHandler = async (data: TCQFormData) => {
        const toastId = toast.loading("Wait a while");

        const payload = {
            ...data,
            type: "CQ",
        } as TUpdateCQFromData;

        const result = await updateQuestion({ id: cqID, ...payload });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Update successful", {
                id: toastId,
            });
            navigate("/questions/CQ", { replace: true });
        }
    };

    return (
        <div className="max-w-[920px] lg:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Update CQ
                </h3>
            </TitleCard>

            {defaultValues.question ? (
                <Form<TCQFormData>
                    onSubmit={updateMCQHandler}
                    defaultValues={defaultValues}
                    resolver={zodResolver(cqFormSchema)}
                >
                    <Editor name="question" label="Question" />
                    <Editor name="answer" label="Answer" />
                    <Editor name="explaination" label="Explanation" />
                    <TagsSelectField defaultValue={question?.tags || []} />
                    <FormButton>Update CQ</FormButton>
                </Form>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default CQUpdate;
