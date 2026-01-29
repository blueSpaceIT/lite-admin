import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { TCourseContent, TError, TQuestion } from "../../../types";
import { useError } from "../../../hooks";
import { examService } from "../../../store/services/examService";
import AddMCQManually from "./components/AddMCQManually";
import Loader from "../../../components/common/Loader/Loader";
import AddCQManually from "./components/AddCQManually";

const ExamsQuestionsAddManually = () => {
    const { examID } = useParams();
    const [exam, setExam] = useState<TCourseContent | null>(null);
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const { data, isSuccess, isError, error } =
        examService.useGetExamQuery(examID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data?.data) {
            setExam(data.data);
            setSelectedQuestions(
                data?.data?.content?.exam?.questions?.map(
                    (q: TQuestion) => q.id
                ) || []
            );
        }
    }, [isSuccess, data]);

    return (
        <div>
            {exam ? (
                exam.content.exam?.type === "MCQ" ? (
                    <AddMCQManually
                        exam={exam}
                        selectedQuestions={selectedQuestions}
                    />
                ) : exam.content.exam?.type === "CQ" ? (
                    <AddCQManually
                        exam={exam}
                        selectedQuestions={selectedQuestions}
                    />
                ) : (
                    ""
                )
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default ExamsQuestionsAddManually;
