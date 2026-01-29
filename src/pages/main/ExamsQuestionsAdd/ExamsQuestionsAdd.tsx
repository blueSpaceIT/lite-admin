import { useEffect, useState } from "react";
import type {
    IQuestionCQ,
    IQuestionGaps,
    IQuestionMCQ,
    TCourseContent,
    TError,
    TMeta,
    TQuestion,
    TTag,
} from "../../../types";
import { useParams, useSearchParams } from "react-router-dom";
import { questionService } from "../../../store/services/questionService";
import MCQQuestionCard from "../../../features/question/components/QuestionCard/MCQQuestionCard";
import Loader from "../../../components/common/Loader/Loader";
import Pagination from "../../../components/common/Pagination/Pagination";
import { useDebounce } from "use-debounce";
import { tagService } from "../../../store/services/tagService";
import { Select, Switch } from "antd";
import { Button } from "@headlessui/react";
import { examService } from "../../../store/services/examService";
import { useError } from "../../../hooks";
import z from "zod";
import { FaMinus, FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";
import type { CourseContentResolvers } from "../../../resolvers/courseContent.resolvers";
import CQQuestionCard from "../../../features/question/components/QuestionCard/CQQuestionCard";

const TagsSelectField = () => {
    const [tagSearch, setTagSearch] = useState("");
    const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
    const [debouncedSearchTerm] = useDebounce(tagSearch, 500);

    const [searchParams, setSearchParams] = useSearchParams();

    const searchedTags = Array.from(new Set(searchParams.getAll("tags")));

    const { data: tagsData } = tagService.useGetTagsQuery(
        debouncedSearchTerm ? [["searchTerm", debouncedSearchTerm]] : undefined
    );

    useEffect(() => {
        if (tagsData?.data) {
            const transformedTags = tagsData.data.result.map((tag: TTag) => ({
                value: tag._id,
                label: tag.name,
            }));
            setTags(transformedTags);
        }
    }, [tagsData]);

    const handleChange = (newTags: string[]) => {
        const uniqueTags = Array.from(new Set(newTags));

        const params = new URLSearchParams(searchParams);
        params.delete("tags");
        uniqueTags.forEach((tag) => params.append("tags", tag));
        params.set("page", "1");

        setSearchParams(params);
    };

    return (
        <Select
            mode="multiple"
            allowClear
            showSearch
            filterOption={false}
            onSearch={(val) => setTagSearch(val)}
            className="w-full font-medium px-1.5 py-1.5 rounded-xl border-2 text-accent bg-slate-200 hover:bg-slate-200 border-slate-200 hover:border-primary focus:border-primary shadow-none"
            placeholder="Select Tags"
            options={tags}
            value={searchedTags}
            onChange={handleChange}
        />
    );
};

const ActionBtn = ({
    item,
    selectedQuestions,
    setSelectedQuestions,
    totalQuestion,
}: {
    item: IQuestionMCQ | IQuestionCQ | IQuestionGaps;
    selectedQuestions: string[];
    setSelectedQuestions: React.Dispatch<React.SetStateAction<string[]>>;
    totalQuestion: number;
}) => {
    const isSelected = selectedQuestions.includes(item.id);
    const addQuestionHandler = (id: string) => {
        setSelectedQuestions((prev) => {
            if (prev.length < totalQuestion) {
                return [...prev, id];
            }
            toast.error(
                "You have reached the maximum number of questions allowed"
            );
            return prev;
        });
    };

    const deleteQuestionHandler = (id: string) => {
        setSelectedQuestions((prev) => prev.filter((qID) => qID !== id));
    };

    return (
        <div className="flex justify-center items-center gap-3">
            {isSelected ? (
                <Button
                    type="button"
                    onClick={() => deleteQuestionHandler(item.id)}
                    className="text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
                >
                    <FaMinus className="w-4 h-4" />
                </Button>
            ) : (
                <Button
                    type="button"
                    onClick={() => addQuestionHandler(item.id)}
                    className="text-lime-600 bg-lime-100 hover:bg-lime-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
                >
                    <FaPlus className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
};

const QuestionsAddForm = ({
    exam,
    questions,
    totalQuestion,
}: {
    exam: TCourseContent;
    questions: string[];
    totalQuestion: number;
}) => {
    type TUpdateExamFormData = z.infer<
        typeof CourseContentResolvers.updateCourseContentValidationSchema
    >;

    const [updateExam] = examService.useUpdateExamMutation();

    const updateExamHandler = async (data: string[]) => {
        const toastId = toast.loading("Wait a while");
        const payload = {
            id: exam.id as string,
            content: { exam: { ...exam.content.exam, questions: data } },
        } as TUpdateExamFormData;

        const result = await updateExam(payload);
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Added successful", {
                id: toastId,
            });
            window.location.href = `/exam/${exam.id}`;
        }
    };

    return (
        <div className="flex justify-center items-center mb-6">
            <Button
                type="button"
                onClick={() => updateExamHandler(questions)}
                className={`border ${
                    questions.length === totalQuestion
                        ? "bg-lime-500"
                        : questions.length >= Math.round(totalQuestion / 2)
                        ? "bg-amber-500"
                        : "bg-rose-500"
                } text-white px-3 py-1.5 rounded-lg cursor-pointer`}
                disabled={questions.length === 0}
            >
                Add [ {questions.length} / {totalQuestion} ]
            </Button>
        </div>
    );
};

const ExamsQuestionsAdd = () => {
    const { examID } = useParams();
    const [depthFilter, setDepthFilter] = useState<boolean>(false);
    const [exam, setExam] = useState<TCourseContent | null>(null);
    const [questions, setQuestions] = useState<IQuestionMCQ[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

    const { data, isSuccess, isError, error } =
        examService.useGetExamQuery(examID);
    useError(isError as boolean, error as TError);

    const [searchParams, setSearchParams] = useSearchParams();
    const getQuestionsQuery = depthFilter
        ? questionService.useGetQuestionsByTagsInDepthQuery
        : questionService.useGetQuestionsByTagsQuery;
    const {
        data: questionData,
        isSuccess: questionSuccess,
        isFetching: questionFetching,
        isLoading: questionLoading,
    } = getQuestionsQuery(
        searchParams
            ? [...searchParams, ["type", exam?.content.exam?.type]]
            : [["type", exam?.content.exam?.type]],
        { skip: !exam }
    );

    useEffect(() => {
        if (isSuccess && data) {
            setExam(data?.data);
            setSelectedQuestions(
                data?.data?.content?.exam?.questions?.map(
                    (q: TQuestion) => q.id
                ) || []
            );
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (questionSuccess && questionData?.success) {
            setQuestions(questionData?.data?.result);
            setMeta(questionData?.data?.meta);
        }
    }, [questionSuccess, questionData]);

    return (
        <div className="mb-10">
            <div>
                {exam && (
                    <QuestionsAddForm
                        exam={exam}
                        questions={selectedQuestions}
                        totalQuestion={exam?.content.exam?.totalQuestions || 1}
                    />
                )}

                <div className="flex items-center gap-2 mb-3">
                    <Switch
                        value={depthFilter}
                        onChange={(val) => setDepthFilter(val)}
                    />
                    <p className="text-sm text-slate-600 italic font-semibold">
                        Depth Filter?
                    </p>
                </div>
                <div className="mb-5">
                    <TagsSelectField />
                </div>
            </div>

            {questionFetching || questionLoading || !exam ? (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            ) : (
                <div>
                    <div className="columns-1 lg:columns-2 gap-5 lg:gap-8 mb-10">
                        {questions.map(
                            (
                                question:
                                    | IQuestionMCQ
                                    | IQuestionCQ
                                    | IQuestionGaps
                            ) => (
                                <div
                                    key={question.id}
                                    className="mb-5 break-inside-avoid"
                                >
                                    {exam.content.exam?.type === "MCQ" ? (
                                        <MCQQuestionCard
                                            question={question as IQuestionMCQ}
                                            action={
                                                <ActionBtn
                                                    item={question}
                                                    selectedQuestions={
                                                        selectedQuestions
                                                    }
                                                    setSelectedQuestions={
                                                        setSelectedQuestions
                                                    }
                                                    totalQuestion={
                                                        exam?.content.exam
                                                            ?.totalQuestions ||
                                                        1
                                                    }
                                                />
                                            }
                                        />
                                    ) : exam.content.exam?.type === "CQ" ? (
                                        <CQQuestionCard
                                            question={question as IQuestionCQ}
                                            action={
                                                <ActionBtn
                                                    item={question}
                                                    selectedQuestions={
                                                        selectedQuestions
                                                    }
                                                    setSelectedQuestions={
                                                        setSelectedQuestions
                                                    }
                                                    totalQuestion={
                                                        exam?.content.exam
                                                            ?.totalQuestions ||
                                                        1
                                                    }
                                                />
                                            }
                                        />
                                    ) : (
                                        ""
                                    )}
                                </div>
                            )
                        )}
                    </div>
                    <div className="flex justify-center">
                        <Pagination
                            meta={meta}
                            setSearchParams={setSearchParams}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamsQuestionsAdd;
