import { createBrowserRouter } from "react-router-dom";
import { mainRoutes } from "./main.routes";
import { authRoutes } from "./auth.routes";
import { errorRoutes } from "./error.route";

export const routes = createBrowserRouter([
    ...authRoutes,
    ...errorRoutes,
    ...mainRoutes,
]);
