import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import type { ReactNode } from "react";

type Props = {
    name: string;
    label: string;
    extra?: ReactNode;
    disable?: boolean;
};

const DateTimeField = ({ name, label, extra, disable }: Props) => {
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
                        <DatePicker
                            className="w-full font-medium px-3.5 py-2.5 rounded-xl border-2 text-accent bg-slate-200 hover:bg-slate-200 border-slate-200 hover:border-primary focus:border-primary shadow-none"
                            format="YYYY-MM-DD HH:mm:ss"
                            showTime
                            disabled={disable}
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) => {
                                field.onChange(date ? date.toISOString() : "");
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

export default DateTimeField;
