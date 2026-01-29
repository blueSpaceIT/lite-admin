import { Link } from "react-router-dom";

type Props = {
    icon?: string;
    title: string;
    destination: string;
};

const WidgetCard = ({ icon, title, destination }: Props) => {
    return (
        <Link
            to={destination}
            className="bg-indigo-100 font-medium text-center px-3 py-6 rounded-xl"
        >
            {icon && (
                <div className="flex justify-center items-center mb-2">
                    <img src={icon} alt="" className="w-[30px] lg:w-[50px]" />
                </div>
            )}
            <p className="text-xs md:text-sm lg:text-lg">{title}</p>
        </Link>
    );
};

export default WidgetCard;
