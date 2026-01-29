import { Switch } from "antd";
import Label from "../../../components/common/Form/Label";
import Loader from "../../../components/common/Loader/Loader";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { TCourseContent, TError, TExamAttempt } from "../../../types";
import { examService } from "../../../store/services/examService";
import { useError } from "../../../hooks";
import toast from "react-hot-toast";
import { examAttemptService } from "../../../store/services/examAttemptService";
import MCQResult from "./components/MCQResult";
import CQResult from "./components/CQResult";

const ExamsResult = () => {
    const { examID } = useParams();
    const [exam, setExam] = useState<TCourseContent | null>(null);
    const [attempts, setAttempts] = useState<TExamAttempt[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const { data, isSuccess, isError, error } =
        examService.useGetExamQuery(examID);
    useError(isError as boolean, error as TError);

    const {
        data: attemptsData,
        isSuccess: attemptsSuccess,
        isFetching: attemptsFetching,
        isLoading: attemptsLoading,
    } = examAttemptService.useGetExamAttemptsQuery(examID);

    useEffect(() => {
        if (isSuccess && data) {
            setExam(data?.data);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (!attemptsFetching && attemptsSuccess && attemptsData?.data) {
            setAttempts(attemptsData.data);
        }
    }, [attemptsData, attemptsSuccess, attemptsFetching]);

    const [updateExam] = examService.useUpdateExamMutation();

    const updateExamResultStatus = async (val: boolean) => {
        const toastId = toast.loading("Updating exam...");
        const payload = {
            content: {
                exam: {
                    title: exam?.content?.exam?.title || "",
                    description: exam?.content?.exam?.description || "",
                    type: exam?.content?.exam?.type || "MCQ",
                    totalQuestions: exam?.content?.exam?.totalQuestions || 0,
                    totalMarks: exam?.content?.exam?.totalMarks || 0,
                    passingMarks: exam?.content?.exam?.passingMarks || 0,
                    positiveMarks: exam?.content?.exam?.positiveMarks || 0,
                    negativeMarks: exam?.content?.exam?.negativeMarks || 0,
                    duration: { ...exam?.content?.exam?.duration },
                    result: val,
                    validity: exam?.content?.exam?.validity,
                    questions:
                        exam?.content?.exam?.questions?.map((q) => q.id) || [],
                },
            },
        };

        const result = await updateExam({
            id: (exam as TCourseContent).id,
            ...payload,
        });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Exam updated successfully", {
                id: toastId,
            });

            window.location.reload();
        }
    };

    return (
        <div className="mb-10">
            {exam ? (
                <div>
                    <div className="flex justify-center items-center gap-2 mb-6">
                        <div className="flex flex-col items-center gap-2">
                            <Label label="Result & Answer Sheet Published??" />
                            <Switch
                                value={exam?.content.exam?.result}
                                onChange={(val) => updateExamResultStatus(val)}
                            />
                        </div>
                    </div>

                    <div>
                        {exam.content.exam?.type === "MCQ" ? (
                            <MCQResult
                                exam={exam}
                                loading={attemptsLoading || attemptsFetching}
                                attempts={attempts}
                                searchParams={searchParams}
                                setSearchParams={setSearchParams}
                            />
                        ) : (
                            <CQResult
                                exam={exam}
                                loading={attemptsLoading || attemptsFetching}
                                attempts={attempts}
                                searchParams={searchParams}
                                setSearchParams={setSearchParams}
                            />
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

export default ExamsResult;
