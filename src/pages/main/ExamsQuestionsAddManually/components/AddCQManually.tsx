import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { tagService } from "../../../../store/services/tagService";
import MultiSelectField from "../../../../components/common/Form/MultiSelectField";
import z from "zod";
import type { QuestionResolvers } from "../../../../resolvers/question.resolvers";
import type { TCourseContent, TError, TTag } from "../../../../types";
import { questionService } from "../../../../store/services/questionService";
import toast from "react-hot-toast";
import TitleCard from "../../../../components/common/TitleCard/TitleCard";
import Form from "../../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import Editor from "../../../../components/common/Form/Editor";
import FormButton from "../../../../components/common/Form/FormButton";
import { examService } from "../../../../store/services/examService";
import type { CourseContentResolvers } from "../../../../resolvers/courseContent.resolvers";

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

const AddCQManually = ({
    exam,
    selectedQuestions,
}: {
    exam: TCourseContent;
    selectedQuestions: string[];
}) => {
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
    type TUpdateExamFormData = z.infer<
        typeof CourseContentResolvers.updateCourseContentValidationSchema
    >;

    const [createQuestion] = questionService.useCreateQuestionMutation();
    const [updateExam] = examService.useUpdateExamMutation();

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

            const examPayload = {
                id: exam.id as string,
                content: {
                    exam: {
                        ...exam.content.exam,
                        questions: [...selectedQuestions, result.data.data.id],
                    },
                },
            } as TUpdateExamFormData;

            const resultExam = await updateExam(examPayload);
            if (resultExam?.error) {
                toast.error((result?.error as TError)?.data?.message, {
                    id: toastId,
                });
            }

            if (resultExam?.data) {
                toast.success("Added successful", {
                    id: toastId,
                });
            }
        }
    };

    return (
        <div className="max-w-[920px] lg:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Create CQ
                </h3>
            </TitleCard>

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

export default AddCQManually;
