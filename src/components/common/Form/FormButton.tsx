import { Button } from "@headlessui/react";
import type { ReactNode } from "react";

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

const FormButton = ({ children, className, ...props }: FormButtonProps) => {
    return (
        <Button
            type="submit"
            className={className || "w-full rounded-xl bg-primary px-4 py-2.5 text-sm text-white cursor-pointer"}
            {...props}
        >
            {children}
        </Button>
    );
};

export default FormButton;
