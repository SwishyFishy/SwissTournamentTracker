import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router";

import MatchSummary from "../components/MatchSummary";
import { CONTEXT_eventDetails } from "./EventSubscriber";

import { Match } from "../types";

function EventParticipantPostmatch(): JSX.Element
{
    const eventDetails = useContext(CONTEXT_eventDetails);

    const location = useLocation();
    const navigate = useNavigate();
    const eventCode: string = location.state.code;
    const player: string = location.state.player;
    const match: Match = eventDetails.matches!.find((match) => match.p1 == player || match.p2 == player)!;

    const round: number = useState(eventDetails.rounds!.currentRound)[0];

    // Monitor for the round to update, then redirect to pairings
    useEffect(() => {
        if (round < eventDetails?.rounds?.currentRound!)
        {
            if(eventDetails.status == "running") 
            {
                navigate("/event/pairing", {state: {code: eventCode, player: player}});
            }
            else 
            {
                navigate("/event/conclusion");
            }
        }
    }, [eventDetails])

    return(
        <div className="wrapper" id="eventParticipantPostmatch">
            <h1>Round {round}</h1>
            <MatchSummary match={match}/>
            <span className="italics centered">If there is an issue with this score, please contact the event administrator as soon as possible.</span>
        </div>
    );
}

export default EventParticipantPostmatch;