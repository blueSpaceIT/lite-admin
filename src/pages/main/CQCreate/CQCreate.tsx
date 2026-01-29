import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { tagService } from "../../../store/services/tagService";
import MultiSelectField from "../../../components/common/Form/MultiSelectField";
import z from "zod";
import type { QuestionResolvers } from "../../../resolvers/question.resolvers";
import { questionService } from "../../../store/services/questionService";
import toast from "react-hot-toast";
import type { TError, TTag } from "../../../types";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { Link } from "react-router-dom";
import { Button } from "@headlessui/react";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import Editor from "../../../components/common/Form/Editor";
import FormButton from "../../../components/common/Form/FormButton";

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

const CQCreate = () => {
    const cqFormSchema = z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
        explaination: z.string().optional(),
        tags: z.array(z.string()).nullable().optional(),
    });

    type TCQFormData = z.infer<typeof cqFormSchema>;

    const defaultValues: TCQFormData = {
        question: "",
        answer: "",
        explaination: "",
        tags: null,
    };

    type TCreateCQFromData = z.infer<
        typeof QuestionResolvers.createQuestionValidationSchema
    >;

    const [createQuestion] = questionService.useCreateQuestionMutation();

    const createCQHandler = async (data: TCQFormData) => {
        const toastId = toast.loading("Wait a while");

        const payload = {
            ...data,
            type: "CQ",
        } as TCreateCQFromData;

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
                    Create CQ
                </h3>
            </TitleCard>

            <div className="flex justify-end items-center gap-2 mb-6">
                <Link to={"/questions/CQ"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        Questions
                    </Button>
                </Link>
            </div>

            <Form<TCQFormData>
                onSubmit={createCQHandler}
                defaultValues={defaultValues}
                resolver={zodResolver(cqFormSchema)}
            >
                <Editor name="question" label="Question" />
                <Editor name="answer" label="Answer" />
                <Editor name="explaination" label="Explanation" />
                <TagsSelectField />
                <FormButton>Create CQ</FormButton>
            </Form>
        </div>
    );
};

export default CQCreate;
