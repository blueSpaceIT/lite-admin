import { useNavigate } from "react-router-dom";
import type { TError } from "../types";

export const useError = (isError: boolean, error: TError) => {
    const navigate = useNavigate();

    if (isError) {
        if (error.status === 403) {
            navigate("/forbidden", { replace: true });
        } else {
            navigate("/not-found", { replace: true });
        }
    }
};
