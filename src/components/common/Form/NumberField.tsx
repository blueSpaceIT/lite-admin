import { Controller, useFormContext } from "react-hook-form";
import { InputNumber } from "antd";
import type { ReactNode } from "react";
import "../../../assets/styles/numberInput.css";

type Props = {
    name: string;
    label: string;
    min?: number;
    max?: number;
    step?: number;
    addonBefore?: string;
    addonAfter?: string;
    extra?: ReactNode;
    disable?: boolean;
};

const NumberField = ({
    name,
    label,
    min,
    max,
    step,
    addonBefore,
    addonAfter,
    extra,
    disable,
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
                        <InputNumber
                            className="w-full font-medium px-2.5 py-1.5 rounded-xl border-2 text-accent bg-slate-200 hover:bg-slate-200 border-slate-200 hover:border-primary focus:border-primary shadow-none"
                            disabled={disable}
                            min={min || 0}
                            max={max || 9999999999}
                            step={step || 1}
                            addonBefore={addonBefore}
                            addonAfter={addonAfter}
                            {...field}
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

export default NumberField;
