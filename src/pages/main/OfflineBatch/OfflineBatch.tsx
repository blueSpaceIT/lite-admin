import { Button } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "../../../components/common/Table/Table";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { offlineBatchService } from "../../../store/services/offlineBatchService";
import type { TData, TError, TMeta, TOfflineBatch, TTableData, TTableHeadingData } from "../../../types";
import OfflineBatchUpdateModal from "./components/OfflineBatchUpdateModal";

const ActionBtns = ({ item }: { item: TOfflineBatch }) => {
    const [deleteOfflineBatch] = offlineBatchService.useDeleteOfflineBatchMutation();

    const handleDelete = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete ${item.title}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteOfflineBatch(item._id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if ((response?.data as TData<TOfflineBatch>)?.success) {
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
            <OfflineBatchUpdateModal item={item} />
            <Button
                type="button"
                onClick={handleDelete}
                className="text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center cursor-pointer"
                title="Delete Batch"
            >
                <FaTrashAlt className="w-4 h-4" />
            </Button>
        </div>
    );
};

const OfflineBatch: React.FC = () => {
    const [data, setData] = useState<TOfflineBatch[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: offlineBatches, isSuccess, isLoading, isFetching } =
        offlineBatchService.useGetOfflineBatchesQuery(
            searchParams ? [...searchParams] : undefined
        );

    useEffect(() => {
        if (isSuccess && offlineBatches?.success) {
            setData(offlineBatches?.data);
            setMeta(offlineBatches?.meta);
        }
    }, [isSuccess, offlineBatches]);

    const tableHeadingData: TTableHeadingData = ["Title", "Class", "Action"];

    const tableData: TTableData = [];
    data?.forEach((item: TOfflineBatch) => {
        tableData.push([
            item.title,
            item.classId?.title || "N/A",
            <ActionBtns item={item} />
        ]);
    });

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Offline Batches
                </h3>
            </TitleCard>
            <div className="flex justify-end items-center gap-2 mb-6">
                <Link to={"/offline-batch-create"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        Create Batch
                    </Button>
                </Link>
            </div>

            <Table
                title="Offline Batches"
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={meta}
                loading={isFetching || isLoading}
                path="/offline-batch"
            />
        </div>
    );
};

export default OfflineBatch;
