const FormHeading = ({ title }: { title: string }) => {
    return (
        <h3 className="text-slate-500 italic font-semibold tracking-wide mb-3">
            {title}
        </h3>
    );
};

export default FormHeading;
