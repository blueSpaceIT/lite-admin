import { useEffect, useState } from "react";
import type { IQuestionMCQ, TData, TError, TMeta, TTag } from "../../../types";
import { Link, useSearchParams } from "react-router-dom";
import { questionService } from "../../../store/services/questionService";
import MCQQuestionCard from "../../../features/question/components/QuestionCard/MCQQuestionCard";
import Loader from "../../../components/common/Loader/Loader";
import Pagination from "../../../components/common/Pagination/Pagination";
import { useDebounce } from "use-debounce";
import { tagService } from "../../../store/services/tagService";
import { Select, Switch } from "antd";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Button } from "@headlessui/react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

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

const ActionBtn = ({ item }: { item: IQuestionMCQ }) => {
    const [deleteQuestion] = questionService.useDeleteQuestionMutation();
    const deleteQuestionHandler = async () => {
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
                const response = await deleteQuestion(item.id);
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
                onClick={deleteQuestionHandler}
                className="text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
            >
                <FaTrashAlt className="w-4 h-4" />
            </Button>
        </div>
    );
};

const MCQQuestions = () => {
    const [depthFilter, setDepthFilter] = useState<boolean>(false);
    const [questions, setQuestions] = useState<IQuestionMCQ[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const getQuestionsQuery = depthFilter
        ? questionService.useGetQuestionsByTagsInDepthQuery
        : questionService.useGetQuestionsByTagsQuery;
    const { data, isSuccess, isFetching, isLoading } = getQuestionsQuery(
        searchParams ? [...searchParams, ["type", "MCQ"]] : [["type", "MCQ"]]
    );

    useEffect(() => {
        if (isSuccess && data?.success) {
            setQuestions(data?.data?.result);
            setMeta(data?.data?.meta);
        }
    }, [isSuccess, data]);

    return (
        <div className="mb-10">
            <div>
                <div>
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

                {isFetching || isLoading ? (
                    <div className="flex justify-center mt-12 mb-5">
                        <Loader />
                    </div>
                ) : (
                    <div>
                        <div className="columns-1 lg:columns-2 gap-5 lg:gap-8 mb-10">
                            {questions.map((question) => (
                                <div
                                    key={question.id}
                                    className="mb-5 break-inside-avoid"
                                >
                                    <MCQQuestionCard
                                        question={question}
                                        action={<ActionBtn item={question} />}
                                    />
                                </div>
                            ))}
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
        </div>
    );
};

export default MCQQuestions;
