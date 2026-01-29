import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import loader from "/loader.gif";
import { Empty, Input, Select, type InputRef } from "antd";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useDebounce } from "use-debounce";
import { Button } from "@headlessui/react";
import type {
    TMeta,
    TTableData,
    TTableHeadingData,
    TTableItemData,
} from "../../../types";
import type { SetURLSearchParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import "../../../assets/styles/selectInput.css";

const Tr = ({ data }: { data: TTableItemData }) => {
    return (
        <tr className="border-b border-dashed last:border-b-0 even:bg-slate-50">
            {data.map((item: string | number | ReactNode, index: number) => (
                <Td key={index}>
                    <div>{item}</div>
                </Td>
            ))}
        </tr>
    );
};

const Th = ({ name }: { name: string }) => {
    return (
        <th className="text-xs font-semibold py-2 text-center border-b border-slate-300 bg-slate-100">
            {name}
        </th>
    );
};

const Td = ({ children }: { children: ReactNode }) => {
    return <td className="p-3 text-center">{children}</td>;
};

const NoData = () => {
    return (
        <div className="border-b border-dashed last:border-b-0">
            <div className="flex justify-center items-center p-3">
                <Empty description={false} />
            </div>
        </div>
    );
};

const Spinner = () => {
    return (
        <div className="border-b border-dashed last:border-b-0">
            <div className="flex flex-col justify-center items-center gap-2 p-3">
                <img src={loader} alt="" className="max-w-[90px] w-full" />
                <h5 className="italic font-medium">Loading...</h5>
            </div>
        </div>
    );
};

const PageDots = () => {
    return (
        <Button className="inline-flex items-center gap-2 rounded-md bg-slate-200 px-3 py-1.5 text-sm/6 font-semibold text-slate-700 shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white cursor-pointer">
            <HiOutlineDotsHorizontal />
        </Button>
    );
};

const renderPageButtons = (
    currentPage: number,
    meta: TMeta,
    setSearchParams: SetURLSearchParams
) => {
    let pages = [];
    const pageArray = [...Array(meta?.totalPage).keys()].map((i) => i + 1);

    if (meta?.totalPage <= 4) {
        pages = pageArray;
    } else if (currentPage === 1 || currentPage === meta?.totalPage) {
        pages = [1, 2, <PageDots />, meta.totalPage - 1, meta.totalPage];
    } else if (currentPage <= 3) {
        pages = [1, 2, 3, <PageDots />, meta.totalPage - 1, meta.totalPage];
    } else if (currentPage >= meta.totalPage - 2) {
        pages = [
            1,
            2,
            <PageDots />,
            meta.totalPage - 2,
            meta.totalPage - 1,
            meta.totalPage,
        ];
    } else {
        pages = [
            1,
            <PageDots />,
            currentPage - 1,
            currentPage,
            currentPage + 1,
            <PageDots />,
            meta.totalPage,
        ];
    }

    return pages.map((item, index) =>
        typeof item !== "number" ? (
            <span key={index}>{item}</span>
        ) : (
            <Button
                key={index}
                onClick={() =>
                    setSearchParams((params) => {
                        params.set("page", String(item));
                        return params;
                    })
                }
                className={`size-10 flex justify-center items-center gap-2 rounded-md ${
                    currentPage === item
                        ? "bg-primary text-white"
                        : "bg-indigo-100 text-accent"
                } hover:bg-primary text-sm/6 font-semibold text-accent hover:text-white outline-0 cursor-pointer`}
            >
                {item}
            </Button>
        )
    );
};

type Props = {
    title: string;
    headingData: TTableHeadingData;
    data: TTableData;
    searchParams: URLSearchParams;
    setSearchParams: SetURLSearchParams;
    meta: TMeta;
    loading: boolean;
    path: string;
    assets?: boolean;
};

const Table = ({
    title,
    headingData,
    data,
    searchParams,
    setSearchParams,
    meta,
    loading,
    path,
    assets,
}: Props) => {
    const inputRef = useRef<InputRef>(null);
    const limit = searchParams.get("limit") || "20";
    const currentPage = Number(searchParams.get("page")) || 1;
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("searchTerm") || ""
    );

    const handleFocus = () => {
        if (inputRef.current?.input) {
            inputRef.current.input.focus();
            const el = inputRef.current.input;
            el.selectionStart = el.value.length;
        }
    };

    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const setLimit = (value: string) => {
        setSearchParams((params) => {
            params.set("limit", value);
            return params;
        });
    };

    const setDebouncedSearchTerm = useCallback(
        (value: string) => {
            window.location.href = path + "?searchTerm=" + value + "&page=" + 1;
        },
        [path]
    );

    useEffect(() => {
        const currentSearchTerm = searchParams.get("searchTerm") || "";
        if (debouncedSearchTerm === currentSearchTerm) return;

        setDebouncedSearchTerm(debouncedSearchTerm);
    }, [debouncedSearchTerm, searchParams, setDebouncedSearchTerm]);

    useEffect(() => {
        return handleFocus();
    }, []);

    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between items-center gap-3 mb-6">
                {/* table title */}
                <h4 className="lg:text-lg font-semibold">{title}</h4>

                {/* search field */}
                {assets && (
                    <Input
                        placeholder="Search"
                        className="max-w-[200px] w-full font-medium px-3.5 py-2.5 rounded-xl border-2 text-accent bg-slate-100 hover:bg-slate-100 border-slate-100 hover:border-primary focus:border-primary shadow-none"
                        defaultValue={searchParams.get("searchTerm") || ""}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        ref={inputRef}
                    />
                )}
            </div>

            {/* data presenting */}
            <div className="relative overflow-x-auto border border-slate-300 rounded-lg mb-5">
                {loading ? (
                    <Spinner />
                ) : data.length > 0 ? (
                    <table className="w-full align-middle border-neutral-200">
                        <thead className="align-bottom">
                            <tr className="font-semibold text-[0.95rem]">
                                {headingData.length > 0 &&
                                    headingData.map(
                                        (item: string, index: number) => (
                                            <Th key={index} name={item} />
                                        )
                                    )}
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((item: TTableItemData, index: number) => (
                                <Tr key={index} data={item} />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <NoData />
                )}
            </div>

            {assets && (
                <div className="flex justify-between items-center">
                    {/* limit selection */}
                    <Select
                        defaultValue={limit}
                        onChange={setLimit}
                        className="font-medium px-1.5 py-4 rounded-xl border-2 text-accent bg-slate-100 hover:bg-slate-100 border-slate-100 hover:border-primary focus:border-primary shadow-none"
                        options={[
                            { value: "10", label: "10" },
                            { value: "20", label: "20" },
                            { value: "50", label: "50" },
                        ]}
                    />

                    {/* pagination */}
                    <div className="w-max flex items-center gap-1">
                        <Button
                            disabled={currentPage === 1}
                            onClick={() =>
                                setSearchParams((params) => {
                                    params.set(
                                        "page",
                                        String(Number(currentPage) - 1)
                                    );
                                    return params;
                                })
                            }
                            className={
                                "size-10 flex justify-center items-center gap-2 rounded-md bg-indigo-100 hover:bg-primary text-sm/6 font-semibold text-accent hover:text-white outline-0 cursor-pointer disabled:bg-transparent disabled:text-slate-400 disabled:cursor-none disabled:pointer-events-none"
                            }
                        >
                            <FaArrowLeft />
                        </Button>

                        <div className="w-max flex items-center gap-1">
                            {renderPageButtons(
                                currentPage,
                                meta,
                                setSearchParams
                            )}
                        </div>

                        <Button
                            disabled={currentPage === meta?.totalPage}
                            onClick={() =>
                                setSearchParams((params) => {
                                    params.set(
                                        "page",
                                        String(Number(currentPage) + 1)
                                    );
                                    return params;
                                })
                            }
                            className={
                                "size-10 flex justify-center items-center gap-2 rounded-md bg-indigo-100 hover:bg-primary text-sm/6 font-semibold text-accent hover:text-white outline-0 cursor-pointer disabled:bg-transparent disabled:text-slate-400 disabled:cursor-none disabled:pointer-events-none"
                            }
                        >
                            <FaArrowRight />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
