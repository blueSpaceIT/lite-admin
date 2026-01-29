import type { ReactNode } from "react";

const TitleCard = ({ children }: { children: ReactNode }) => {
    return (
        <div className="bg-indigo-100 text-xl font-semibold px-3 py-6 rounded-xl mb-3">
            {children}
        </div>
    );
};

export default TitleCard;
