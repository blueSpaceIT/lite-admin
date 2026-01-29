import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Input, Button } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

type Props = {
    name: string;
    label?: string;
};

const ArrayInputField = ({ name, label }: Props) => {
    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    return (
        <div className="mb-5">
            {label && (
                <label className="text-sm text-slate-500 font-semibold mb-2 block">
                    {label}
                </label>
            )}

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="flex items-start gap-3 border p-3 rounded-xl bg-slate-50"
                    >
                        {/* Key */}
                        <Controller
                            name={`${name}[${index}].key`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <div className="flex-1">
                                    <Input
                                        placeholder="Key"
                                        className="!rounded-xl"
                                        {...field}
                                    />
                                    {error && (
                                        <p className="text-sm text-rose-600 mt-1">
                                            {error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />

                        {/* Value */}
                        <Controller
                            name={`${name}[${index}].value`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <div className="flex-1">
                                    <Input.TextArea
                                        placeholder="Value"
                                        autoSize={{ minRows: 1, maxRows: 3 }}
                                        className="!rounded-xl"
                                        {...field}
                                    />
                                    {error && (
                                        <p className="text-sm text-rose-600 mt-1">
                                            {error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />

                        {/* Remove button */}
                        <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(index)}
                        />
                    </div>
                ))}
            </div>

            <Button
                type="dashed"
                onClick={() => append({ key: "", value: "" })}
                icon={<PlusOutlined />}
                className="mt-3 w-full !rounded-xl"
            >
                Add
            </Button>
        </div>
    );
};

export default ArrayInputField;
