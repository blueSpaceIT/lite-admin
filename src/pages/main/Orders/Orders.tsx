import { useEffect, useState } from "react";
import type { TOrder } from "../../../types/order.types";
import type { TMeta, TTableData, TTableHeadingData } from "../../../types";
import { Link, useSearchParams } from "react-router-dom";
import { orderService } from "../../../store/services/orderService";
import { Tag } from "antd";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Table from "../../../components/common/Table/Table";
import { Button } from "@headlessui/react";
import { FaPrint } from "react-icons/fa6";
import OrderModal from "./components/OrderModal/OrderModal";
import OrderUpdateModal from "./components/OrderUpdateModal/OrderUpdateModal";

const ActionBtns = ({ item }: { item: TOrder }) => {
    return (
        <div className="flex justify-center items-center gap-3">
            {item.orderType === "hardcopy" && <OrderUpdateModal order={item} />}
            <OrderModal order={item} />

            <Link to={`/print-invoice/${item.id}`} target="_blank">
                <Button
                    type="button"
                    className="text-purple-600 bg-purple-100 hover:bg-purple-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
                >
                    <FaPrint className="w-4 h-4" />
                </Button>
            </Link>
        </div>
    );
};

const Orders = () => {
    const [orders, setOrders] = useState<TOrder[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isSuccess, isLoading, isFetching } =
        orderService.useGetOrdersQuery(
            searchParams ? [...searchParams] : undefined
        );

    useEffect(() => {
        if (isSuccess && data?.success) {
            setOrders(data?.data?.result);
            setMeta(data?.data?.meta);
        }
    }, [isSuccess, data]);

    const tableHeadingData: TTableHeadingData = [
        "OID",
        "Name",
        "Phone",
        "Order Type",
        "Area",
        "Status",
        "Pay Status",
        "Pay Method",
        "Action",
    ];
    const tableData: TTableData = [];
    orders.forEach((item: TOrder) =>
        tableData.push([
            item?.id,
            item?.name,
            item?.phone,
            item?.orderType === "ebook" ? (
                <Tag color="purple">{item?.orderType}</Tag>
            ) : (
                <Tag color="magenta">{item?.orderType}</Tag>
            ),
            item?.area,
            item?.status === "Delivered" ? (
                <Tag color="green">{item?.status}</Tag>
            ) : item?.status === "Cancelled" ? (
                <Tag color="volcano">{item?.status}</Tag>
            ) : item?.status === "Pending" ? (
                <Tag color="gold">{item?.status}</Tag>
            ) : item?.status === "On Hold" ? (
                <Tag color="purple">{item?.status}</Tag>
            ) : item?.status === "Accepted" ? (
                <Tag color="cyan">{item?.status}</Tag>
            ) : item?.status === "Out for delivery" ? (
                <Tag color="lime">{item?.status}</Tag>
            ) : (
                <Tag color="magenta">{item?.status}</Tag>
            ),
            item?.payStatus === "Paid" ? (
                <Tag color="green">{item?.payStatus}</Tag>
            ) : item?.payStatus === "Pending" ? (
                <Tag color="gold">{item?.payStatus}</Tag>
            ) : item?.payStatus === "Refunded" ? (
                <Tag color="volcano">{item?.payStatus}</Tag>
            ) : (
                <Tag color="magenta">{item?.payStatus}</Tag>
            ),
            item?.payMethod === "Cash On Delivery" ? (
                <Tag color="cyan">{item?.payMethod}</Tag>
            ) : item?.payMethod === "Payment Gateway" ? (
                <Tag color="pink">{item?.payMethod}</Tag>
            ) : (
                <Tag color="magenta">{item?.payMethod}</Tag>
            ),
            <ActionBtns item={item} />,
        ])
    );

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Orders
                </h3>
            </TitleCard>

            <Table
                title="Orders"
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={meta}
                loading={isFetching || isLoading}
                path="/orders"
                assets={true}
            />
        </div>
    );
};

export default Orders;
