import { useEffect, useState } from "react";
import Table from "../../../../components/common/Table/Table";
import type {
    TBatch,
    TCourse,
    TData,
    TError,
    TMeta,
    TTableData,
    TTableHeadingData,
} from "../../../../types";
import { batchService } from "../../../../store/services/batchService";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Button } from "@headlessui/react";
import { FaTrashAlt } from "react-icons/fa";
import BatchCreateModal from "./BatchCreateModal";
import BatchUpdateModal from "./BatchUpdateModal";
import { useAppSelector } from "../../../../store/hook";
import { useCurrentUser } from "../../../../store/slices/authSlice";

const ActionBtns = ({ item }: { item: TBatch }) => {
    const [deleteBatch] = batchService.useDeleteBatchMutation();
    const deleteStatusHandler = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete ${item.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteBatch(item.id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<TBatch>) {
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
            <BatchUpdateModal batch={item} />

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

const CourseBatch = ({ course }: { course: TCourse }) => {
    const user = useAppSelector(useCurrentUser);
    const [batches, setBatches] = useState<TBatch[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const filterParams = searchParams
        ? [...searchParams, ["course", course._id]]
        : [["course", course._id]];
    if (user?.branch) {
        filterParams.push(["branch", String(user.branch._id)]);
    }
    const { data, isSuccess, isLoading, isFetching } =
        batchService.useGetBatchesQuery(filterParams);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setBatches(data?.data?.result);
            setMeta(data?.data?.meta);
        }
    }, [isSuccess, data]);

    const tableHeadingData: TTableHeadingData = ["Name", "Branch", "Action"];
    const tableData: TTableData = [];
    batches.forEach((item: TBatch) =>
        tableData.push([
            item?.name,
            item?.branch.name,
            <ActionBtns item={item} />,
        ])
    );

    return (
        <div className="mb-8">
            <div className="flex justify-end items-center gap-2 mt-6 mb-2">
                <BatchCreateModal courseID={course.id} />
            </div>

            <Table
                title="Batches"
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={meta}
                loading={isFetching || isLoading}
                path={`/course/${course.id}`}
            />
        </div>
    );
};

export default CourseBatch;
