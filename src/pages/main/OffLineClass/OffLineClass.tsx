import { Button } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "../../../components/common/Table/Table";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { offlineClassService } from "../../../store/services/offlineClassService";
import type { TData, TError, TMeta, TOfflineClass, TTableData, TTableHeadingData } from "../../../types";
import OffLineClassUpdateModal from "./components/OffLineClassUpdateModal";

const ActionBtns = ({ item }: { item: TOfflineClass }) => {
  const [deleteOfflineClass] = offlineClassService.useDeleteOfflineClassMutation();

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
        const response = await deleteOfflineClass(item._id);
        if (response?.error) {
          toast.error((response?.error as TError)?.data?.message);
        }
        if ((response?.data as TData<TOfflineClass>)?.success) {
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
      <OffLineClassUpdateModal item={item} />
      <Button
        type="button"
        onClick={handleDelete}
        className="text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center cursor-pointer"
        title="Delete Class"
      >
        <FaTrashAlt className="w-4 h-4" />
      </Button>
    </div>
  );
};

const OffLineClass: React.FC = () => {
  const [data, setData] = useState<TOfflineClass[]>([]);
  const [meta, setMeta] = useState<TMeta>({
    page: 1,
    limit: 20,
    totalPage: 1,
    totalDoc: 0,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: offlineClasses, isSuccess, isLoading, isFetching } =
    offlineClassService.useGetOfflineClassesQuery(
      searchParams ? [...searchParams] : undefined
    );

  useEffect(() => {
    if (isSuccess && offlineClasses?.success) {
      setData(offlineClasses?.data);
      setMeta(offlineClasses?.meta); // Meta is now used
    }
  }, [isSuccess, offlineClasses]);

  const tableHeadingData: TTableHeadingData = ["Title", "Action"];

  const tableData: TTableData = [];
  data?.forEach((item: TOfflineClass) => {
    tableData.push([item.title, <ActionBtns item={item} />]);
  });
  return (
    <div className="mb-10">
      <TitleCard>
        <h3 className="text-center text-lg lg:text-2xl font-bold">
          Offline Classes
        </h3>
      </TitleCard>
      <div className="flex justify-end items-center gap-2 mb-6">
        <Link to={"/offline-class-create"}>
          <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
            Create Class
          </Button>
        </Link>
      </div>

      <Table
        title="Offline Classes"
        data={tableData}
        headingData={tableHeadingData}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        meta={meta}
        loading={isFetching || isLoading}
        path="/offline-class"
      />
    </div>
  );
};

export default OffLineClass;
