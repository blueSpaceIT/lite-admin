import { Button } from "@headlessui/react";
import type { ReactNode } from "react";

const FormButton = ({ children }: { children: ReactNode }) => {
    return (
        <Button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm text-white cursor-pointer"
        >
            {children}
        </Button>
    );
};

export default FormButton;
