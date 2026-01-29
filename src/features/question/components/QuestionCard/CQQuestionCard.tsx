import type { ReactNode } from "react";
import type { IQuestionCQ } from "../../../../types";
import DOMPurify from "dompurify";

const CQQuestionCard = ({
    question,
    action,
}: {
    question: IQuestionCQ;
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
            <div className="italic text-xs text-slate-500 font-medium mb-1">
                Answer:
            </div>
            <div>
                <div
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(question.answer || ""),
                    }}
                ></div>
            </div>
        </div>
    );
};

export default CQQuestionCard;
