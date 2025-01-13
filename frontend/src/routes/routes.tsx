import Layout from "./Layout";
import ErrorPage from "./ErrorPage";
import Home from "./Home";
import HostSetup from "./HostSetup";
import EventAdminHome from "./EventAdminHome";
import JoinEvent from "./JoinEvent";
import EventSubscriber from "./EventSubscriber";
import EventParticipantLobby from "./EventParticipantLobby";
import EventParticipantMatch from "./EventParticipantMatch";
import EventParticipantPostmatch from "./EventParticipantPostmatch";
import DisplayLeaderboard from "./DisplayLeaderboard";

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
                path: "/host/:eventCode",
                element: <EventAdminHome />
            },
            {
                path: "/join",
                element: <JoinEvent />
            },
            {
                path: "/:eventCode",
                element: <EventSubscriber />,
                children: [
                    {
                        path: "/:eventCode/lobby",
                        element: <EventParticipantLobby />
                    },
                    {
                        path: "/:eventCode/pairing",
                        element: <EventParticipantMatch />
                    },
                    {
                        path: "/:eventCode/postmatch",
                        element: <EventParticipantPostmatch />
                    }
                ]
            },
            {
                path: "/:eventCode/conclusion",
                element: <DisplayLeaderboard />
            }
        ]
    }
];

export default routes;