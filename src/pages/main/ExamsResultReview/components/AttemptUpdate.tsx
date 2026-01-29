import { useState } from "react";
import type {
    TAnswer,
    TCQAnswer,
    TError,
    TExamAttempt,
} from "../../../../types";
import DOMPurify from "dompurify";
import { Input } from "antd";
import { examAttemptService } from "../../../../store/services/examAttemptService";
import toast from "react-hot-toast";

const AttemptUpdate = ({
    examID,
    attempt,
}: {
    examID: string;
    attempt: TExamAttempt;
}) => {
    const defaultValues = attempt.answers?.map(
        (answer: TAnswer | TCQAnswer) => ({
            question: answer.question._id,
            answer: answer.answer,
            mark: 0,
        })
    );

    type TUpdateMarksFormData = typeof defaultValues;

    const [updateMarksFormData, setUpdateMarksFormData] =
        useState<TUpdateMarksFormData>(defaultValues);

    const [updateMarks] = examAttemptService.useUpdateCQMarkMutation();

    const updateMarksHandler = async (data: TUpdateMarksFormData) => {
        const toastId = toast.loading("Wait a while");
        const payload = {
            userID: attempt.student.id,
            examID: examID,
            data,
        };

        const result = await updateMarks(payload);
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Update successful", {
                id: toastId,
            });
            window.location.href = `/result/${examID}`;
        }
    };

    return (
        <div>
            {attempt.answers && (
                <div>
                    {attempt.answers?.map((answer) => (
                        <div
                            key={answer.question._id}
                            className="mb-6 p-4 border rounded"
                        >
                            <div className="mb-3 font-semibold">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            answer.question?.question || ""
                                        ),
                                    }}
                                ></div>
                            </div>
                            <p className="mb-2">
                                Answers: <br />
                                {Array.isArray(answer.answer) ? (
                                    <div className="flex items-start gap-2">
                                        {answer.answer.map((item) => (
                                            <img
                                                key={item}
                                                src={item}
                                                alt=""
                                                className="w-[350px]"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    String(answer.answer)
                                )}
                            </p>
                            <p>
                                Current Mark:{" "}
                                {answer.mark !== undefined
                                    ? answer.mark
                                    : "Not yet"}
                                <Input
                                    type="number"
                                    className="w-20 ml-4"
                                    defaultValue={answer.mark || 0}
                                    onChange={(e) => {
                                        const updatedData =
                                            updateMarksFormData?.map((item) =>
                                                item.question ===
                                                answer.question._id
                                                    ? {
                                                          ...item,
                                                          mark: Number(
                                                              e.target.value
                                                          ),
                                                      }
                                                    : item
                                            );
                                        setUpdateMarksFormData(updatedData);
                                    }}
                                />
                            </p>
                        </div>
                    ))}
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={() => updateMarksHandler(updateMarksFormData)}
                    >
                        Update Marks
                    </button>
                </div>
            )}
        </div>
    );
};

export default AttemptUpdate;
