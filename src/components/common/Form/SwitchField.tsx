import { Controller, useFormContext } from "react-hook-form";
import { Switch } from "antd";
import type { ReactNode } from "react";

type Props = {
    name: string;
    label: string;
    extra?: ReactNode;
    disable?: boolean;
};

const SwitchField = ({ name, label, extra, disable }: Props) => {
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
                        <Switch disabled={disable} {...field} />
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

export default SwitchField;
