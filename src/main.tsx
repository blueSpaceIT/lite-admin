import { createRoot } from "react-dom/client";
import { StyleProvider } from "@ant-design/cssinjs";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/index.routes.ts";
import "./index.css";
import "./assets/styles/reusable.css";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <StyleProvider layer>
            <RouterProvider router={routes} />
        </StyleProvider>
    </Provider>
);
