import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type {
    IQuestionCQ,
    IQuestionGaps,
    IQuestionMCQ,
    TCourseContent,
    TData,
    TError,
} from "../../../types";
import { examService } from "../../../store/services/examService";
import { useError } from "../../../hooks";
import Loader from "../../../components/common/Loader/Loader";
import MCQQuestionCard from "../../../features/question/components/QuestionCard/MCQQuestionCard";
import { Button } from "@headlessui/react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { questionService } from "../../../store/services/questionService";
import CQQuestionCard from "../../../features/question/components/QuestionCard/CQQuestionCard";

const ActionBtn = ({
    item,
}: {
    item: IQuestionMCQ | IQuestionCQ | IQuestionGaps;
}) => {
    const [deleteNews] = questionService.useDeleteQuestionMutation();
    const deleteStatusHandler = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete this question?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteNews(item.id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<IQuestionMCQ>) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Item has been deleted.",
                        icon: "success",
                    });
                }
            }
        });
    };

    return (
        <div className="flex justify-center items-center gap-3">
            <Link to={`/update-mcq/${item.id}`}>
                <Button className="text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer">
                    <FaRegEdit className="w-4 h-4" />
                </Button>
            </Link>

            <Button
                type="button"
                onClick={deleteStatusHandler}
                className="text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
            >
                <FaTrashAlt className="w-4 h-4" />
            </Button>
        </div>
    );
};

const ExamsView = () => {
    const { examID } = useParams();
    const [exam, setExam] = useState<TCourseContent | null>(null);
    const [questions, setQuestions] = useState<IQuestionMCQ[]>([]);

    const { data, isSuccess, isError, error } =
        examService.useGetExamQuery(examID);
    useError(isError as boolean, error as TError);

    const queryArgs: string[][] = [
        ...(exam?.content.exam?.questions?.map((q) => [
            "id",
            q.id.toString(),
        ]) ?? []),
        ["limit", exam?.content.exam?.totalQuestions?.toString() ?? "0"],
    ];

    const { data: questionData, isSuccess: questionSuccess } =
        questionService.useGetQuestionsQuery(queryArgs, {
            skip: exam?.content.exam?.questions?.length === 0,
        });

    useEffect(() => {
        if (isSuccess && data) {
            setExam(data?.data);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (questionSuccess && questionData) {
            setQuestions(questionData?.data.result);
        }
    }, [questionSuccess, questionData]);

    return (
        <div className="mb-10">
            {exam ? (
                <div>
                    <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
                        <Link to={`/exam/${examID}/add-questions`}>
                            <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                                Add Questions From Bank
                            </Button>
                        </Link>
                        <Link to={`/exam/${examID}/add-questions-manually`}>
                            <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                                Add Questions Manually
                            </Button>
                        </Link>
                    </div>
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
                                                    item={
                                                        question as IQuestionMCQ
                                                    }
                                                />
                                            }
                                        />
                                    ) : exam.content.exam?.type === "CQ" ? (
                                        <CQQuestionCard
                                            question={question as IQuestionCQ}
                                            action={
                                                <ActionBtn
                                                    item={
                                                        question as IQuestionCQ
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
                </div>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default ExamsView;
