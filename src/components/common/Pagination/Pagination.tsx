import { Button } from "@headlessui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import type { TMeta } from "../../../types";
import type { SetURLSearchParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

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
    setSearchParams: SetURLSearchParams;
    meta: TMeta;
};

const Pagination = ({ setSearchParams, meta }: Props) => {
    const currentPage = meta.page;

    return (
        <div className="flex justify-center">
            <div className="w-max flex items-center gap-2">
                <Button
                    disabled={currentPage === 1}
                    onClick={() =>
                        setSearchParams((params) => {
                            params.set("page", String(Number(currentPage) - 1));
                            return params;
                        })
                    }
                    className="size-10 flex justify-center items-center gap-2 rounded-md bg-indigo-100 hover:bg-primary text-sm/6 font-semibold text-accent hover:text-white outline-0 cursor-pointer disabled:bg-transparent disabled:text-slate-400 disabled:cursor-none disabled:pointer-events-none"
                >
                    <FaArrowLeft />
                </Button>

                <div className="w-max flex items-center gap-1">
                    {renderPageButtons(currentPage, meta, setSearchParams)}
                </div>

                <Button
                    disabled={currentPage === meta?.totalPage}
                    onClick={() =>
                        setSearchParams((params) => {
                            params.set("page", String(Number(currentPage) + 1));
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
    );
};

export default Pagination;
