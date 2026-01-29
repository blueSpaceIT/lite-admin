import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";
import { Transfer } from "antd";
import type { TransferProps } from "antd";

type Props = {
    name: string;
    label: string;
    content: string[];
};

interface RecordType {
    key: string;
    title: string;
    description: string;
}

const SerialField = ({ name, label, content }: Props) => {
    const form = useFormContext();
    const [selectedKeys, setSelectedKeys] = useState<
        TransferProps["targetKeys"]
    >([]);

    const mockData = content.map<RecordType>((item) => ({
        key: item,
        title: item,
        description: item,
    }));

    const onSelectChange: TransferProps["onSelectChange"] = (
        sourceSelectedKeys,
        targetSelectedKeys
    ) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

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
                    </div>
                    <div>
                        <Transfer
                            dataSource={mockData}
                            titles={["Source", "Target"]}
                            targetKeys={field.value}
                            selectedKeys={selectedKeys}
                            onChange={(nextTargetKeys) => {
                                field.onChange(nextTargetKeys);
                            }}
                            onSelectChange={onSelectChange}
                            render={(item) => item.title}
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

export default SerialField;
