import WidgetCard from "../../../components/common/WidgetCard/WidgetCard";
import { widgetItems } from "../../../constants/widgets.constants";
import { accessPermission } from "../../../hooks";
import { useAppSelector } from "../../../store/hook";
import { useCurrentUser } from "../../../store/slices/authSlice";

const Home = () => {
    const user = useAppSelector(useCurrentUser);

    return (
        <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-8 gap-2 mb-10">
            {widgetItems.map((item, index) => {
                if (accessPermission(user, item.permission)) {
                    return (
                        <WidgetCard
                            key={index}
                            icon={item.icon}
                            title={item.title}
                            destination={item.destination}
                        />
                    );
                }
            })}
        </div>
    );
};

export default Home;
