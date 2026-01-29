import { useEffect, useState } from "react";
import type {
    TCourse,
    TMeta,
    TPurchase,
    TTableData,
    TTableHeadingData,
} from "../../../types";
import {
    Link,
    useSearchParams,
    type SetURLSearchParams,
} from "react-router-dom";
import { purchaseService } from "../../../store/services/purchaseService";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Table from "../../../components/common/Table/Table";
import { useAppSelector } from "../../../store/hook";
import { useCurrentUser } from "../../../store/slices/authSlice";
import { Button } from "@headlessui/react";
import { FaPrint } from "react-icons/fa6";
import { useDebounce } from "use-debounce";
import { courseService } from "../../../store/services/courseService";
import { Select } from "antd";
import DuePayModal from "../DuePayments/components/DuePayModal";

const ActionBtns = ({ item }: { item: TPurchase }) => {
    return (
        <div className="flex justify-center items-center gap-3">
            <DuePayModal purchase={item} />
            <Link to={`/print-reciept/${item.id}`} target="_blank">
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

const CourseSelectField = ({
    setSearchParams,
}: {
    setSearchParams: SetURLSearchParams;
}) => {
    const [value, setValue] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [options, setOptions] = useState<{ value: string; label: string }[]>(
        []
    );
    const [debouncedSearchTerm] = useDebounce(search, 500);

    const { data: coursesData } = courseService.useGetCoursesQuery(
        debouncedSearchTerm ? [["searchTerm", debouncedSearchTerm]] : undefined
    );

    useEffect(() => {
        if (coursesData?.data) {
            const transformed = coursesData.data.result.map(
                (course: TCourse) => ({
                    value: course._id,
                    label: course.name,
                })
            );
            setOptions(transformed);
        }
    }, [coursesData]);

    const onChangeHandler = (id: string) => {
        const course = coursesData?.data?.result.find(
            (item: TCourse) => item._id === id
        );
        if (course) {
            setSearchParams({ course: id });
            setValue(id);
        }
    };

    return (
        <Select
            showSearch
            filterOption={false}
            className="w-full font-medium px-1.5 py-5 rounded-xl border-2 text-accent bg-slate-200 hover:bg-slate-200 border-slate-200 hover:border-primary focus:border-primary shadow-none"
            placeholder={"Select course"}
            value={value}
            onSearch={setSearch}
            options={options}
            onChange={onChangeHandler}
            disabled={!options}
        />
    );
};

const Payments = () => {
    const user = useAppSelector(useCurrentUser);
    const [purchases, setPurchases] = useState<TPurchase[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const filterParams = searchParams
        ? [...searchParams, ["status", "Active"]]
        : [["status", "Active"]];
    if (user?.branch) {
        filterParams.push(["branch", String(user.branch._id)]);
    }
    const { data, isSuccess, isLoading, isFetching } =
        purchaseService.useGetPurchasesQuery(filterParams);

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
        "Batch",
        "Price",
        "Paid",
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
            <ActionBtns item={item} />,
        ])
    );

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Purchases
                </h3>
            </TitleCard>

            <div className="flex justify-end items-center gap-3 mb-6">
                <Link to={"/due-payments"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        Due Payments
                    </Button>
                </Link>
            </div>

            <div className="flex justify-center mb-6">
                <div className="max-w-[350px] md:w-full">
                    <div>
                        <p>Course Filter</p>
                        <div className="w-full">
                            <CourseSelectField
                                setSearchParams={setSearchParams}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Table
                title="Purchases"
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={meta}
                loading={isFetching || isLoading}
                path="/payments"
                assets={true}
            />
        </div>
    );
};

export default Payments;
