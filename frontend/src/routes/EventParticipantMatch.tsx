import { useState, useContext } from "react";
import { useLocation } from "react-router";

import MatchPanel from "../components/MatchPanel";
import { CONTEXT_serverBaseUrl } from "../main";

import '../styles/EventParticipantMatch.css';

function EventParticipantMatch(): JSX.Element
{
    const location = useLocation();
    const eventCode = location.state.code;
    const p1 = location.state.match.p1;
    const p2 = location.state.match.p2;
    const round = location.state.round;
    const [p1Score, setp1Score] = useState<number>(location.state.match.p1wins);
    const [p2Score, setp2Score] = useState<number>(location.state.match.p2wins);

    const serverUrl = useContext(CONTEXT_serverBaseUrl);

    // Score submission
    const handleSubmitScore = () => {
        fetch(serverUrl + `/report/${eventCode}?p1=${p1}&p2=${p2}&p1wins=${p1Score}&p2wins=${p2Score}`)
        .then(response => { if (!response.ok) { console.log(response) }})
        .catch((err) => {
            console.log(err);
        })
    }

    return(
        <div className="wrapper" id="eventParticipantMatch">
            <h1>Round {round}</h1>
            <form className="playerPairings">
                <MatchPanel player={p1} wins={p1Score} callbackFn={setp1Score} />
                <MatchPanel player={p2} wins={p2Score} callbackFn={setp2Score} />
                <input type="button" name="submit" id="submit" value="Submit Match Score" onClick={handleSubmitScore} />
            </form>
        </div>
    );
}

export default EventParticipantMatch;