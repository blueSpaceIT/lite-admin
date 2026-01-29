import Swal from "sweetalert2";
import { couponService } from "../../../store/services/couponService";
import type {
    TCoupon,
    TData,
    TError,
    TMeta,
    TTableData,
    TTableHeadingData,
} from "../../../types";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@headlessui/react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Table from "../../../components/common/Table/Table";
import localeDate from "../../../utils/localeDate";

const ActionBtns = ({ item }: { item: TCoupon }) => {
    const [deleteCoupon] = couponService.useDeleteCouponMutation();

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
                const response = await deleteCoupon(item.id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message);
                }
                if (response?.data as TData<TCoupon>) {
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
            <Link to={`/update-coupon/${item.id}`}>
                <Button className="text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer">
                    <FaRegEdit className="w-4 h-4" />
                </Button>
            </Link>

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

const Coupons = () => {
    const [coupons, setCoupons] = useState<TCoupon[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isSuccess, isLoading, isFetching } =
        couponService.useGetCouponsQuery(
            searchParams ? [...searchParams] : undefined
        );

    useEffect(() => {
        if (isSuccess && data?.success) {
            setCoupons(data?.data?.result);
            setMeta(data?.data?.meta);
        }
    }, [isSuccess, data]);

    const tableHeadingData: TTableHeadingData = [
        "Name",
        "Discount",
        "Issued - Expired",
        "Action",
    ];
    const tableData: TTableData = [];
    coupons.forEach((item: TCoupon) =>
        tableData.push([
            item.name,
            (item.discount.type === "Fixed" ? "BDT " : "") +
                item.discount.amount +
                (item.discount.type === "Percentage" ? "%" : ""),
            localeDate(item.issuedAt) + " to " + localeDate(item.expiredAt),
            <ActionBtns item={item} />,
        ])
    );

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Coupons
                </h3>
            </TitleCard>

            <div className="flex justify-end items-center gap-2 mb-6">
                <Link to={"/create-coupon"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        Create Coupon
                    </Button>
                </Link>
            </div>

            <Table
                title="Coupons"
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={meta}
                loading={isFetching || isLoading}
                path="/articles"
                assets={true}
            />
        </div>
    );
};

export default Coupons;
