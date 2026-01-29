import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { TCourseContent, TError, TExamAttempt } from "../../../types";
import { examService } from "../../../store/services/examService";
import { examAttemptService } from "../../../store/services/examAttemptService";
import { useError } from "../../../hooks";
import Loader from "../../../components/common/Loader/Loader";
import AttemptUpdate from "./components/AttemptUpdate";

const ExamsResultReview = () => {
    const { examID, userID } = useParams();
    const [exam, setExam] = useState<TCourseContent | null>(null);
    const [attempt, setAttempt] = useState<TExamAttempt | null>(null);

    const { data, isSuccess, isError, error } =
        examService.useGetExamQuery(examID);
    useError(isError as boolean, error as TError);

    const {
        data: attemptData,
        isSuccess: attemptSuccess,
        isFetching: attemptFetching,
        isLoading: attemptLoading,
    } = examAttemptService.useGetExamAttemptQuery({ examID, userID });

    useEffect(() => {
        if (isSuccess && data) {
            setExam(data?.data);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (
            !attemptLoading &&
            !attemptFetching &&
            attemptSuccess &&
            attemptData?.data
        ) {
            setAttempt(attemptData.data);
        }
    }, [attemptData, attemptSuccess, attemptFetching, attemptLoading]);

    return (
        <div className="mb-10">
            {exam ? (
                <div>
                    {exam.content.exam?.type === "CQ" ? (
                        attemptSuccess &&
                        attempt && (
                            <AttemptUpdate
                                examID={examID as string}
                                attempt={attempt}
                            />
                        )
                    ) : (
                        <p>No Attempt Found</p>
                    )}
                </div>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default ExamsResultReview;
