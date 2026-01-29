import TitleCard from "../../../components/common/TitleCard/TitleCard";
import ChangePassword from "./components/ChangePassword";
import UpdateProfile from "./components/UpdateProfile";
import UploadProfile from "./components/UploadProfile";

const Settings = () => {
    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Profile
                </h3>
            </TitleCard>

            <div className="grid gap-6">
                <UploadProfile />
                <UpdateProfile />
                <ChangePassword />
            </div>
        </div>
    );
};

export default Settings;
