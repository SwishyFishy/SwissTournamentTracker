import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router";

import MatchPanel from "../components/MatchPanel";
import { CONTEXT_serverBaseUrl } from "../main";
import { CONTEXT_eventDetails } from "./EventSubscriber";

import { Match } from "../types";

import '../styles/EventParticipantMatch.css';

function EventParticipantMatch(): JSX.Element
{
    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    const eventDetails = useContext(CONTEXT_eventDetails);

    const location = useLocation();
    const navigate = useNavigate();
    const eventCode = location.state.code;
    const player = location.state.player;

    // Should probably fix my types such that I don't need to use the ! non-null, non-undefined assertion
    const match: Match = eventDetails.matches!.find((match) => match.p1 == player || match.p2 == player)!;
    const round = eventDetails.rounds?.currentRound;
    const [p1Score, setp1Score] = useState<number>(match.p1wins);
    const [p2Score, setp2Score] = useState<number>(match.p2wins);

    // Score submission
    const handleSubmitScore = () => {
        fetch(serverUrl + `/report/${eventCode}?p1=${match.p1}&p2=${match.p2}&p1wins=${p1Score}&p2wins=${p2Score}`)
        .then(response => { 
            if (!response.ok) 
            { 
                console.log(response);
                setp1Score(0);
                setp2Score(0);
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    // Monitor for match submission from either player, then redirect to postmatch page
    useEffect(() => {
        if (match.reported)
        {
            navigate("/event/postmatch", {state: {code: eventCode, player: player}});
        }
    }, [eventDetails])

    return(
        <div className="wrapper" id="eventParticipantMatch">
            <h1>Round {round}</h1>
            <form className="playerPairings">
                <MatchPanel player={match.p1} wins={p1Score} callbackFn={setp1Score} />
                <MatchPanel player={match.p2} wins={p2Score} callbackFn={setp2Score} />
                <input type="button" name="submit" id="submit" value="Submit Match Score" onClick={handleSubmitScore} />
            </form>
        </div>
    );
}

export default EventParticipantMatch;