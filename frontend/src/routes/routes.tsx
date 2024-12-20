import Layout from "./Layout";
import ErrorPage from "./ErrorPage";
import Home from "./Home";
import HostSetup from "./HostSetup";
import EventAdminHome from "./EventAdminHome";
import JoinEvent from "./JoinEvent";
import EventParticipantHome from "./EventParticipantHome";

const routes = [
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/host",
                element: <HostSetup />
            },
            {
                path: "/host/event",
                element: <EventAdminHome />
            },
            {
                path: "/join",
                element: <JoinEvent />
            },
            {
                path: "/join/event",
                element: <EventParticipantHome />
            }
        ]
    }
];

export default routes;