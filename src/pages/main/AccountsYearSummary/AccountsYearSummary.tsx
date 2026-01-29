import { useParams, useSearchParams } from "react-router-dom";
import type {
    TTableData,
    TTableHeadingData,
    TTableItemData,
} from "../../../types";
import { useEffect, useState } from "react";
import { accountService } from "../../../store/services/accountService";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Table from "../../../components/common/Table/Table";

const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

type TAccountYearSummaryForAdminResponse = {
    branch: string;
    months: {
        monthNumber: number;
        month: string;
        earning: number;
        expense: number;
    }[];
};

const EarnExpenseCell = ({
    earning,
    expense,
}: {
    earning: number;
    expense: number;
}) => {
    return (
        <div className="text-xs text-right">
            <div className="border-b mb-1">In: {earning}</div>
            <div>Out: {expense}</div>
        </div>
    );
};

const AccountsYearSummary = () => {
    const { year } = useParams();
    const [summary, setSummary] = useState<
        TAccountYearSummaryForAdminResponse[]
    >([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isSuccess, isFetching, isLoading } =
        accountService.useGetAccountYearSummaryForAdminQuery(year);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setSummary(data?.data);
        }
    }, [isSuccess, data]);

    const tableHeadingData: TTableHeadingData = ["Branch"];

    MONTH_NAMES.forEach((month) => {
        tableHeadingData.push(`${month}`);
    });

    tableHeadingData.push("Total");

    const tableData: TTableData = [];
    summary.forEach((item: TAccountYearSummaryForAdminResponse) => {
        const row: TTableItemData = [];

        row.push(item.branch);

        let totalEarning = 0;
        let totalExpense = 0;

        const monthMap: Record<number, { earning: number; expense: number }> =
            {};
        for (let i = 1; i <= 12; i++) {
            monthMap[i] = { earning: 0, expense: 0 };
        }

        item.months.forEach((m) => {
            monthMap[m.monthNumber] = {
                earning: m.earning,
                expense: m.expense,
            };
        });

        for (let i = 1; i <= 12; i++) {
            const { earning, expense } = monthMap[i];

            row.push(<EarnExpenseCell earning={earning} expense={expense} />);

            totalEarning += earning;
            totalExpense += expense;
        }

        row.push(
            <EarnExpenseCell earning={totalEarning} expense={totalExpense} />
        );
        tableData.push(row);
    });

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Accounts Summary {year}
                </h3>
            </TitleCard>

            <Table
                title={`Summary of: ${year}`}
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={{
                    page: 1,
                    limit: summary.length,
                    totalPage: 1,
                    totalDoc: summary.length,
                }}
                loading={isFetching || isLoading}
                path="/accounts/summary"
                assets={false}
            />
        </div>
    );
};

export default AccountsYearSummary;
