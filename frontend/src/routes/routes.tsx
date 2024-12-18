import App from "../App";
import Layout from "./Layout";

const router: {path: string, element: any}[] = [
    {
        path: "/",
        element: <App />
    },
    {
        path: "/Layout",
        element: <Layout />
    }
];

export default router;