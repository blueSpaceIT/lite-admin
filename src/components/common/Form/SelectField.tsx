import { Controller, useFormContext } from "react-hook-form";
import { Select } from "antd";
import type { ReactNode } from "react";

type Props = {
    name: string;
    label: string;
    options: { value: string; label: string }[];
    placeholder?: string;
    extra?: ReactNode;
    disable?: boolean;
    onSearch?: (value: string) => void;
    onChange?: (value: string) => void;
};

const SelectField = ({
    name,
    label,
    options,
    placeholder,
    extra,
    disable,
    onSearch,
    onChange,
}: Props) => {
    const form = useFormContext();

    return (
        <Controller
            control={form.control}
            name={name}
            defaultValue={""}
            render={({ field, fieldState: { error } }) => (
                <div className="mb-5">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-slate-500 font-semibold mb-1.5">
                            {label}
                        </label>
                        {extra && extra}
                    </div>
                    <div>
                        <Select
                            showSearch
                            filterOption={false}
                            className="w-full font-medium px-1.5 py-5 rounded-xl border-2 text-accent bg-slate-200 hover:bg-slate-200 border-slate-200 hover:border-primary focus:border-primary shadow-none"
                            placeholder={placeholder}
                            options={options}
                            disabled={disable}
                            {...field}
                            onSearch={onSearch}
                            onChange={(value) => {
                                field.onChange(value);
                                if (onChange) {
                                    onChange(value);
                                }
                            }}
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-rose-600 mt-1">
                            {error.message}
                        </p>
                    )}
                </div>
            )}
        />
    );
};

export default SelectField;
