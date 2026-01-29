import { useEffect, useState } from "react";
import { useAppSelector } from "../../../store/hook";
import { useCurrentUser } from "../../../store/slices/authSlice";
import type {
    TMeta,
    TPurchase,
    TTableData,
    TTableHeadingData,
} from "../../../types";
import { useSearchParams } from "react-router-dom";
import { purchaseService } from "../../../store/services/purchaseService";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Table from "../../../components/common/Table/Table";
import localeDate from "../../../utils/localeDate";
import DuePayModal from "./components/DuePayModal";

const ActionBtns = ({ item }: { item: TPurchase }) => {
    return (
        <div className="flex justify-center items-center gap-3">
            <DuePayModal purchase={item} />
        </div>
    );
};

const DuePayments = () => {
    const user = useAppSelector(useCurrentUser);
    const [purchases, setPurchases] = useState<TPurchase[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const filterParams = searchParams ? [...searchParams] : [];
    if (user?.branch) {
        filterParams.push(["branch", String(user.branch._id)]);
    }
    const { data, isSuccess, isLoading, isFetching } =
        purchaseService.useGetDuePurchasesQuery(filterParams);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setPurchases(data?.data?.result);
            setMeta(data?.data?.meta);
        }
    }, [isSuccess, data]);

    const tableHeadingData: TTableHeadingData = [
        "ID",
        "Name",
        "Phone",
        "UUID",
        "Course",
        "Branch",
        "Price",
        "Paid",
        "Due Date",
        "Action",
    ];
    const tableData: TTableData = [];
    purchases.forEach((item: TPurchase) =>
        tableData.push([
            item?.id,
            item?.student.name,
            item?.student.phone,
            item?.student.id,
            item?.course.name,
            item?.batch ? item?.batch?.name : "Online",
            item.totalAmount,
            item.paidAmount,
            localeDate(item.dueDate as Date),
            <ActionBtns item={item} />,
        ])
    );

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Due Payments
                </h3>
            </TitleCard>

            <Table
                title="Purchases"
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={meta}
                loading={isFetching || isLoading}
                path="/due-payments"
                assets={true}
            />
        </div>
    );
};

export default DuePayments;
