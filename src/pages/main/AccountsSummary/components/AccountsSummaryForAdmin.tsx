import { DatePicker, Dropdown, type MenuProps } from "antd";
import { type DatePickerProps } from "antd";
import { useEffect, useState } from "react";
import type {
    TBranch,
    TMethod,
    TTableData,
    TTableHeadingData,
} from "../../../../types";
import { accountService } from "../../../../store/services/accountService";
import { useSearchParams } from "react-router-dom";
import Table from "../../../../components/common/Table/Table";
import { Button } from "@headlessui/react";

const { RangePicker } = DatePicker;

const dateFormat = "MMM DD, YYYY";

const customFormat: DatePickerProps["format"] = (value) =>
    `${value.format(dateFormat)}`;

type TAccountSummaryApiParams = {
    startDate: string;
    endDate: string;
};

type TAccountSummaryForAdminResponse = {
    branch: TBranch;
    summary: {
        method: TMethod;
        earning: number;
        expense: number;
    }[];
};

const items: MenuProps["items"] = [
    {
        label: <a href="/accounts/summary/2024">2024</a>,
        key: "2024",
    },
    {
        label: <a href="/accounts/summary/2025">2025</a>,
        key: "2025",
    },
    {
        label: <a href="/accounts/summary/2026">2026</a>,
        key: "2026",
    },
    {
        label: <a href="/accounts/summary/2027">2027</a>,
        key: "2027",
    },
    {
        label: <a href="/accounts/summary/2028">2028</a>,
        key: "2028",
    },
];

const YearDropdown = () => {
    return (
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
            <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                Year
            </Button>
        </Dropdown>
    );
};

const AccountsSummaryForAdmin = () => {
    const [summary, setSummary] = useState<TAccountSummaryForAdminResponse[]>(
        []
    );
    const [apiParams, setApiParams] = useState<TAccountSummaryApiParams>({
        startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        endDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isSuccess, isFetching, isLoading } =
        accountService.useGetAccountSummaryForAdminQuery(apiParams);

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
        "Branch",
        "Earning",
        "Expense",
    ];
    const tableData: TTableData = [];
    summary.forEach((item: TAccountSummaryForAdminResponse) =>
        tableData.push([
            item?.branch?.name,
            item?.summary.reduce((acc, item) => acc + item.earning, 0) + "/-",
            item?.summary.reduce((acc, item) => acc + item.expense, 0) + "/-",
        ])
    );

    return (
        <div>
            <div className="flex justify-end items-center gap-3 mb-6">
                <YearDropdown />
            </div>
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

export default AccountsSummaryForAdmin;
