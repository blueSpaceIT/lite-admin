import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type {
    TCourse,
    TCourseReview,
    TData,
    TError,
    TMeta,
    TTableData,
    TTableHeadingData,
} from "../../../types";
import { courseService } from "../../../store/services/courseService";
import { useError } from "../../../hooks";
import { courseReviewService } from "../../../store/services/courseReviewService";
import Table from "../../../components/common/Table/Table";
import Loader from "../../../components/common/Loader/Loader";
import { Switch, Tag } from "antd";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Button } from "@headlessui/react";
import { FaRegThumbsDown, FaRegThumbsUp, FaTrashAlt } from "react-icons/fa";
import Label from "../../../components/common/Form/Label";

const CoursesReviewsSwitch = ({ item }: { item: TCourse }) => {
    const [updateCourse] = courseService.useUpdateCourseMutation();

    const updateReviewStatusHandler = async (val: boolean) => {
        const result = await updateCourse({
            id: item.id,
            reviewed: val,
        });
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message);
        }
        if (result?.data as TData<TCourse>) {
            toast.success("Review On");
        }
    };

    return (
        <div className="flex justify-center items-center gap-2 mb-6">
            <div className="flex flex-col items-center gap-2">
                <Label label="Take Review??" />
                <Switch
                    value={item.reviewed}
                    onChange={(val) => updateReviewStatusHandler(val)}
                />
            </div>
        </div>
    );
};

const ActionBtns = ({ item }: { item: TCourseReview }) => {
    const [updateCourseContent] =
        courseReviewService.useUpdateCourseReviewMutation();
    const [deleteCourseContent] =
        courseReviewService.useDeleteCourseReviewMutation();

    const updateStatusHandler = async (
        status: "Approved" | "Pending" | "Rejected"
    ) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to change status to ${status}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await updateCourseContent({
                    id: item.id,
                    status,
                });
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<TCourseReview>) {
                    Swal.fire({
                        title: "Updated!",
                        text: "Item has been updated.",
                        icon: "success",
                    });
                }
            }
        });
    };

    const deleteStatusHandler = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete this review`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteCourseContent(item.id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<TCourseReview>) {
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
            <Button
                type="button"
                onClick={() =>
                    updateStatusHandler(
                        "Approved" as "Approved" | "Pending" | "Rejected"
                    )
                }
                className="text-lime-600 bg-lime-100 hover:bg-lime-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
            >
                <FaRegThumbsUp className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                onClick={() =>
                    updateStatusHandler(
                        "Rejected" as "Approved" | "Pending" | "Rejected"
                    )
                }
                className="text-orange-600 bg-orange-100 hover:bg-orange-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
            >
                <FaRegThumbsDown className="w-4 h-4" />
            </Button>
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

const CoursesReviews = () => {
    const { courseID } = useParams();
    const [course, setCourse] = useState<TCourse | null>(null);
    const [reviews, setReviews] = useState<TCourseReview[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });

    const { data, isSuccess, isError, error } =
        courseService.useGetCourseQuery(courseID);
    useError(isError as boolean, error as TError);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setCourse(data?.data);
        }
    }, [isSuccess, data]);

    const [searchParams, setSearchParams] = useSearchParams();
    const {
        data: reviewsData,
        isSuccess: reviewsSuccess,
        isLoading,
        isFetching,
    } = courseReviewService.useGetCourseReviewsQuery(
        searchParams
            ? [...searchParams, ["course", course?._id]]
            : [["course", course?._id]],
        { skip: !course?._id }
    );

    useEffect(() => {
        if (reviewsSuccess && reviewsData?.success) {
            setReviews(reviewsData?.data?.result);
            setMeta(reviewsData?.data?.meta);
        }
    }, [reviewsSuccess, reviewsData]);

    const tableHeadingData: TTableHeadingData = [
        "Name",
        "Rating",
        "Comment",
        "Status",
        "Action",
    ];

    const tableData: TTableData = [];
    reviews.forEach((item: TCourseReview) => {
        tableData.push([
            item.student.name,
            item.rating,
            item.comment,
            item?.status === "Approved" ? (
                <Tag color="cyan">{item?.status}</Tag>
            ) : item?.status === "Rejected" ? (
                <Tag color="volcano">{item?.status}</Tag>
            ) : (
                <Tag color="gold">{item?.status}</Tag>
            ),
            <ActionBtns item={item} />,
        ]);
    });

    return (
        <div className="mb-10">
            {course ? (
                <div>
                    <div className="pb-4 border-b border-slate-400">
                        <div>
                            <h4 className="text-sm md:text-base font-semibold mb-2">
                                Course Reviews - {course.name}
                            </h4>
                        </div>
                    </div>

                    <div>
                        <CoursesReviewsSwitch item={course} />
                    </div>

                    <Table
                        title="Course Reviews"
                        data={tableData}
                        headingData={tableHeadingData}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        meta={meta}
                        loading={isFetching || isLoading}
                        path={`/course/${courseID}/reviews`}
                    />
                </div>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default CoursesReviews;
