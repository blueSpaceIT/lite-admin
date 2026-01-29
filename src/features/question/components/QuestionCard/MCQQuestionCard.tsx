import type { ReactNode } from "react";
import type { IQuestionMCQ } from "../../../../types";
import DOMPurify from "dompurify";

const options = ["A", "B", "C", "D"];

const MCQQuestionCard = ({
    question,
    action,
}: {
    question: IQuestionMCQ;
    action?: ReactNode;
}) => {
    return (
        <div className="h-max border rounded-xl p-4">
            {action && <div className="flex justify-end mb-2">{action}</div>}
            <div className="mb-3">
                <div
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(question?.question || ""),
                    }}
                ></div>
            </div>
            <div className="grid md:grid-cols-2 gap-2 mb-5">
                {question?.options?.map((option, index) => (
                    <div
                        key={index}
                        className={`px-4 py-2 rounded-lg border ${
                            option === question?.answer
                                ? "bg-lime-100 border-lime-400"
                                : "bg-slate-50 border-slate-300"
                        }`}
                    >
                        <span>({options[index]})</span>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(option || ""),
                            }}
                        ></div>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
                {question?.tags?.map((tag, index) => (
                    <span
                        key={index}
                        className={`text-xs ${
                            index % 2 === 0
                                ? "bg-pink-100 text-pink-600"
                                : "bg-purple-100 text-purple-600"
                        } px-2 py-1 rounded-lg`}
                    >
                        {tag.name}
                    </span>
                ))}
            </div>
            {question?.explaination && (
                <div className="italic text-xs text-slate-500 font-medium mb-1">
                    Explaination:
                </div>
            )}
            <div>
                <div
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                            question?.explaination || ""
                        ),
                    }}
                ></div>
            </div>
        </div>
    );
};

export default MCQQuestionCard;
