const Label = ({ label }: { label: string }) => {
    return (
        <label className="text-sm text-slate-500 font-semibold mb-1.5">
            {label}
        </label>
    );
};

export default Label;
