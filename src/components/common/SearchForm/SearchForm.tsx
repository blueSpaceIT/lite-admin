import { Input } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

type Props = {
    searchParams: URLSearchParams;
    path: string;
    full?: boolean;
};

const SearchForm = ({ searchParams, path, full }: Props) => {
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("searchTerm") || ""
    );

    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

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

    return (
        <div className="flex justify-center mb-6">
            <Input
                placeholder="Search"
                className={`${
                    full ? "w-full" : "max-w-[200px]"
                } w-full font-medium px-3.5 py-2.5 rounded-xl border-2 text-accent bg-slate-100 hover:bg-slate-100 border-slate-100 hover:border-primary focus:border-primary shadow-none`}
                defaultValue={searchParams.get("searchTerm") || ""}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default SearchForm;
