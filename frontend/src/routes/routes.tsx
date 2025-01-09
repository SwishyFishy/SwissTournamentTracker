import Layout from "./Layout";
import ErrorPage from "./ErrorPage";
import Home from "./Home";
import HostSetup from "./HostSetup";
import EventAdminHome from "./EventAdminHome";
import JoinEvent from "./JoinEvent";
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
                path: "/host/event",
                element: <EventAdminHome />
            },
            {
                path: "/join",
                element: <JoinEvent />
            },
            {
                path: "/join/event",
                element: <EventParticipantLobby />
            },
            {
                path: "/event/pairing",
                element: <EventParticipantMatch />
            },
            {
                path: "/event/postmatch",
                element: <EventParticipantPostmatch />
            },
            {
                path: "/event/conclusion",
                element: <DisplayLeaderboard />
            }
        ]
    }
];

export default routes;