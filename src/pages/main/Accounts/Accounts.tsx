import { useEffect, useMemo, useState } from "react";
import type {
    TAccount,
    TBranch,
    TMeta,
    TTableData,
    TTableHeadingData,
} from "../../../types";
import { Link, useSearchParams } from "react-router-dom";
import { accountService } from "../../../store/services/accountService";
import { useAppSelector } from "../../../store/hook";
import { useCurrentUser } from "../../../store/slices/authSlice";
import { Select, Tag, type DatePickerProps } from "antd";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Table from "../../../components/common/Table/Table";
import localeDate from "../../../utils/localeDate";
import { DatePicker } from "antd";
import CreateExpenseModal from "./components/CreateExpenseModal";
import { accessPermission } from "../../../hooks";
import { USER_ROLES } from "../../../constants";
import { Button } from "@headlessui/react";
import { branchService } from "../../../store/services/branchService";
import CreateEarnModal from "./components/CreateEarnModal";

const { RangePicker } = DatePicker;

const dateFormat = "MMM DD, YYYY";

const customFormat: DatePickerProps["format"] = (value) =>
    `${value.format(dateFormat)}`;

const BranchSelectInput = ({
    branch,
    setBranch,
}: {
    branch: string;
    setBranch: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const [branches, setBranches] = useState<TBranch[]>([]);
    const { data, isSuccess } = branchService.useGetBranchesQuery(undefined);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setBranches(data?.data?.result);
        }
    }, [isSuccess, data]);

    return (
        <Select
            defaultValue={branch}
            onChange={(value) => setBranch(value)}
            className="font-medium px-1.5 py-5 rounded-xl border-2 text-accent bg-slate-200 hover:bg-slate-200 border-slate-200 hover:border-primary focus:border-primary shadow-none"
            options={branches.map((branch) => ({
                value: branch._id,
                label: branch.name,
            }))}
        />
    );
};

const Accounts = () => {
    const user = useAppSelector(useCurrentUser);
    const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
    const [branch, setBranch] = useState<string>(
        user?.branch?._id || "693166f5f52406266ee8b4f2"
    );
    const [accounts, setAccounts] = useState<TAccount[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const filterParams = useMemo(() => {
        const params: Record<string, unknown> = {};

        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        const startDate =
            dateRange[0] === "" ? new Date() : new Date(dateRange[0]);
        const endDate =
            dateRange[1] === "" ? new Date() : new Date(dateRange[1]);
        const startDateUTC = new Date(startDate);
        startDateUTC.setHours(0, 0, 0, 0);
        const endDateUTC = new Date(endDate);
        endDateUTC.setHours(23, 59, 59, 999);

        params.createdAt = {
            gte: startDateUTC.toISOString(),
            lte: endDateUTC.toISOString(),
        };

        if (branch) {
            params.branch = String(branch);
        }

        params.sort = "type";

        return Object.entries(params);
    }, [searchParams, branch, dateRange]);
    const { data, isSuccess, isLoading, isFetching } =
        accountService.useGetAccountsQuery(filterParams);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setAccounts(data?.data?.result);
            setMeta({
                page: 1,
                limit: data?.data?.result?.length || 20,
                totalPage: 1,
                totalDoc: data?.data?.result?.length || 0,
            });
        }
    }, [isSuccess, data]);

    const handleRangeChange = (dateStrings: [string, string]) => {
        const startDate = new Date(dateStrings[0]).toLocaleDateString();
        const endDate = new Date(dateStrings[1]).toLocaleDateString();
        setDateRange([startDate, endDate]);
    };

    const totalEarnings =
        accounts?.reduce(
            (acc, i) => acc + (i.type === "Earning" ? i.amount : 0),
            0
        ) ?? 0;

    const totalExpenses =
        accounts?.reduce(
            (acc, i) => acc + (i.type === "Expense" ? i.amount : 0),
            0
        ) ?? 0;

    const totalAmount = totalEarnings - totalExpenses;

    const tableHeadingData: TTableHeadingData = [
        "Branch",
        "Reason",
        "Type",
        "Method",
        "Amount",
        "PaidAt",
    ];
    const tableData: TTableData = [];
    accounts.forEach((item: TAccount) =>
        tableData.push([
            item?.branch.name,
            item?.reason.join(", "),
            item?.type,
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
            item?.amount + "/-",
            localeDate(item.createdAt as Date),
        ])
    );

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Accounts
                </h3>
            </TitleCard>

            <div className="flex justify-end items-center gap-3 mb-6">
                {accessPermission(user, [USER_ROLES.superAdmin]) && (
                    <Link to={"/accounts/summary"}>
                        <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                            Summary
                        </Button>
                    </Link>
                )}

                {accessPermission(user, [
                    USER_ROLES.admin,
                    USER_ROLES.moderator,
                    USER_ROLES.acountant,
                ]) && <CreateExpenseModal />}
                {accessPermission(user, [
                    USER_ROLES.admin,
                    USER_ROLES.moderator,
                    USER_ROLES.acountant,
                ]) && <CreateEarnModal />}
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-6">
                {accessPermission(user, [USER_ROLES.superAdmin]) && (
                    <BranchSelectInput branch={branch} setBranch={setBranch} />
                )}
                <RangePicker
                    format={customFormat}
                    onChange={(_, info) => handleRangeChange(info)}
                    className="font-medium px-3.5 py-2.5 rounded-xl border-2 text-accent bg-slate-200 hover:bg-slate-200 border-slate-200 hover:border-primary focus:border-primary shadow-none"
                />
            </div>

            <Table
                title="Accounts"
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={meta}
                loading={isFetching || isLoading}
                path="/accounts"
                assets={false}
            />

            <div className="grid md:grid-cols-3 gap-5">
                <div className="bg-emerald-400 p-5 rounded-2xl text-center font-semibold">
                    Earning: BDT {totalEarnings}/-
                </div>
                <div className="bg-orange-400 p-5 rounded-2xl text-center font-semibold">
                    Expense: BDT {totalExpenses}/-
                </div>
                <div className="bg-sky-400 p-5 rounded-2xl text-center font-semibold">
                    Total: BDT {totalAmount}/-
                </div>
            </div>
        </div>
    );
};

export default Accounts;
