import { useState, useContext } from "react";
import { useNavigate } from "react-router";

import { CONTEXT_serverBaseUrl } from "../main";

import '../styles/JoinEvent.css';

function JoinEvent(): JSX.Element
{
    const [name, setName] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const navigate = useNavigate();
    const serverUrl = useContext(CONTEXT_serverBaseUrl);

    // State management for input fields
    const handleNameInput = (e: any) => {
        setName(e.currentTarget?.value);
    };

    const handleCodeInput = (e: any) => {
        setCode(e.currentTarget?.value);
    };

    // Attempt to join event
    const handleSubmitJoin = () => {
        // Attempt to enter a tournament with the in-form code
        const joinTournament = async() => {
            await fetch(serverUrl + `join/${code}/${name}`)
            .then(response => {
                if (response.ok)
                {
                    navigate("/join/event");
                }
                else if (response.status == 400)
                {
                    navigate("/", {state: {error: true, emsg: "The tournament could not be joined - there is already a participant wiht that name"}});
                }
                else if (response.status == 404)
                {
                    navigate("/", {state: {error: true, emsg: "The tournament could not be joined - no tournament with that entry code exists"}});
                }
                else
                {
                    navigate("/", {state: {error: true, emsg: "The tournament could not be joined - the tournament has already started"}});
                }
            })
            .catch(err => {
                console.log(err);
                navigate("/", {state: {error: true, emsg: "The tournament could not be joined"}});
            })}
        joinTournament();
    };

    return(
        <div className="wrapper joinEvent">
            <h1>Join Event</h1>
            <form>
                <input type="text" name="name" id="name" placeholder="Your Name" value={name} onChange={handleNameInput}/>
                <input type="text" name="code" id="code" placeholder="Event Code" value={code} onChange={handleCodeInput}/>
                <input type="button" name="join" id="join" value="Join Event" onClick={handleSubmitJoin} />
            </form>
        </div>
    );
}

export default JoinEvent;