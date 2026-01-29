import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../store/hook";
import { useCurrentUser } from "../../../../store/slices/authSlice";
import { Tag, type DatePickerProps } from "antd";
import { DatePicker } from "antd";
import type { TMethod, TTableData, TTableHeadingData } from "../../../../types";
import { accountService } from "../../../../store/services/accountService";
import { useSearchParams } from "react-router-dom";
import Table from "../../../../components/common/Table/Table";

const { RangePicker } = DatePicker;

const dateFormat = "MMM DD, YYYY";

const customFormat: DatePickerProps["format"] = (value) =>
    `${value.format(dateFormat)}`;

type TAccountSummaryApiParams = {
    id: string;
    startDate: string;
    endDate: string;
};

type TAccountSummaryByBranchResponse = {
    method: TMethod;
    earning: number;
    expense: number;
};

const AccountsSummaryByBranch = () => {
    const user = useAppSelector(useCurrentUser);
    const [summary, setSummary] = useState<TAccountSummaryByBranchResponse[]>(
        []
    );
    const [apiParams, setApiParams] = useState<TAccountSummaryApiParams>({
        id: String(user?.branch?.id),
        startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        endDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isSuccess, isFetching, isLoading } =
        accountService.useGetAccountSummaryQuery(apiParams);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setSummary(data?.data);
        }
    }, [isSuccess, data]);

    const handleRangeChange = (dateStrings: [string, string]) => {
        const startDate = new Date(
            new Date(dateStrings[0]).setHours(0, 0, 0, 0)
        ).toISOString();
        const endDate = new Date(
            new Date(dateStrings[1]).setHours(23, 59, 59, 999)
        ).toISOString();
        setApiParams((prev) => ({
            ...prev,
            startDate,
            endDate,
        }));
    };

    const tableHeadingData: TTableHeadingData = [
        "Method",
        "Earning",
        "Expense",
    ];
    const tableData: TTableData = [];
    summary.forEach((item: TAccountSummaryByBranchResponse) =>
        tableData.push([
            item?.method === "SSLCommerz" ? (
                <Tag color="cyan">{item?.method}</Tag>
            ) : item?.method === "Bkash" ? (
                <Tag color="volcano">{item?.method}</Tag>
            ) : item?.method === "Cash" ? (
                <Tag color="geekblue">{item?.method}</Tag>
            ) : item?.method === "Nagad" ? (
                <Tag color="orange">{item?.method}</Tag>
            ) : item?.method === "Rocket" ? (
                <Tag color="purple">{item?.method}</Tag>
            ) : (
                <Tag color="gold">{item?.method}</Tag>
            ),
            item?.earning + "/-",
            item?.expense + "/-",
        ])
    );

    return (
        <div>
            <div className="flex justify-center mb-6">
                <RangePicker
                    format={customFormat}
                    onChange={(_, info) => handleRangeChange(info)}
                    className="font-medium px-3.5 py-2.5 rounded-xl border-2 text-accent bg-slate-200 hover:bg-slate-200 border-slate-200 hover:border-primary focus:border-primary shadow-none"
                />
            </div>

            <Table
                title={`Summary of: ${new Date(
                    apiParams.startDate
                ).toDateString()} to ${new Date(
                    apiParams.endDate
                ).toDateString()}`}
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
                path="/accounts"
                assets={false}
            />
        </div>
    );
};

export default AccountsSummaryByBranch;
