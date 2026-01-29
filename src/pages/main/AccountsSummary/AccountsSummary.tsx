import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { useAppSelector } from "../../../store/hook";
import { useCurrentUser } from "../../../store/slices/authSlice";
import AccountsSummaryForAdmin from "./components/AccountsSummaryForAdmin";
import AccountsSummaryByBranch from "./components/AccountsSummaryByBranch";

const AccountsSummary = () => {
    const user = useAppSelector(useCurrentUser);

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Accounts Summary
                </h3>
            </TitleCard>

            {user?.role === "superAdmin" ? (
                <AccountsSummaryForAdmin />
            ) : (
                <AccountsSummaryByBranch />
            )}
        </div>
    );
};

export default AccountsSummary;
