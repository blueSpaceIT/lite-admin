import Swal from "sweetalert2";
import { tagService } from "../../../store/services/tagService";
import type {
    TData,
    TError,
    TMeta,
    TTableData,
    TTableHeadingData,
    TTag,
} from "../../../types";
import toast from "react-hot-toast";
import { Button } from "@headlessui/react";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Table from "../../../components/common/Table/Table";
import TagCreateModal from "./components/TagCreateModal";
import TagUpdateModal from "./components/TagUpdateModal";

const ActionBtns = ({ item }: { item: TTag }) => {
    const [deleteNews] = tagService.useDeleteTagMutation();
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
                const response = await deleteNews(item.id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<TTag>) {
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
            <TagUpdateModal tag={item} />

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

const Tags = () => {
    const [tags, setTags] = useState<TTag[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isSuccess, isLoading, isFetching } =
        tagService.useGetTagsQuery(
            searchParams ? [...searchParams] : undefined
        );

    useEffect(() => {
        if (isSuccess && data?.success) {
            setTags(data?.data?.result);
            setMeta(data?.data?.meta);
        }
    }, [isSuccess, data]);

    const tableHeadingData: TTableHeadingData = ["Name", "Action"];
    const tableData: TTableData = [];
    tags.forEach((item: TTag) =>
        tableData.push([item?.name, <ActionBtns item={item} />])
    );

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Tags
                </h3>
            </TitleCard>

            <div className="flex justify-end items-center gap-2 mb-6">
                <TagCreateModal />
            </div>

            <Table
                title="Tags"
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={meta}
                loading={isFetching || isLoading}
                path="/tags"
                assets={true}
            />
        </div>
    );
};

export default Tags;
