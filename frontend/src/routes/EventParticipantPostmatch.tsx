import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import MatchSummary from "../components/MatchSummary";
import { CONTEXT_eventDetails } from "./EventSubscriber";

import { Match } from "../types";

function EventParticipantPostmatch(): JSX.Element
{
    const eventDetails = useContext(CONTEXT_eventDetails);
    const {eventCode} = useParams() as {eventCode: string};
    const player: string = useSearchParams()[0].get("player")!;
    const match: Match = eventDetails.matches!.find((match) => match.p1 == player || match.p2 == player)!;
    const round: number = useState(eventDetails.rounds!.currentRound)[0];

    const navigate = useNavigate();

    // Monitor for the round to update, then redirect to pairings or event conclusion
    useEffect(() => {
        if (eventDetails?.players !== undefined && eventDetails?.players?.find((p) => p.name == player) == undefined)
        {
            navigate("/", {state: {error: true, emsg: "You have been removed from the tournament"}});
        }
        else if (round < eventDetails?.rounds?.currentRound!)
        {
            if(eventDetails.status == "running") 
            {
                navigate(`/${eventCode}/pairing?player=${player}`);
            }
            else 
            {
                navigate(`/${eventCode}/conclusion?player=${player}`);
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