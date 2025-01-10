import { useState, useContext } from "react";
import { useNavigate } from "react-router";

import { CONTEXT_serverBaseUrl } from "../main";

import '../styles/JoinEvent.css';

function JoinEvent(): JSX.Element
{
    const [name, setName] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [nameError, setNameError] = useState<boolean>(false);
    const [codeError, setCodeError] = useState<boolean>(false);
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

        setNameError(false);
        setCodeError(false);

        // Validate user input
        if (name == "")
        {
            setNameError(true);
        }
        else if (code == "")
        {
            setCodeError(true);
        }
        // Attempt to enter a tournament with the in-form code
        else
        {
            const joinTournament = async() => {
                await fetch(serverUrl + `/join/${code}?name=${name}`)
                .then(response => {
                    if (response.ok)
                    {
                        navigate("/join/event", {state: {code: code, player: name}});
                    }
                    else if (response.status == 400)
                    {
                        setNameError(true);
                    }
                    else
                    {
                        setCodeError(true);
                    }
                })
                .catch(err => {
                    console.log(err);
                    navigate("/", {state: {error: true, emsg: "Network Error"}});
                })}
            joinTournament();
        }
    };

    const handleCancelJoin = () => {
        navigate("/");
    };

    return(
        <div className="wrapper joinEvent">
            <h1>Join Event</h1>
            <form>
                <input type="text" name="name" id="name" placeholder="Your Name" value={name} onChange={handleNameInput}/>
                <span className={nameError ? "italics" : "hidden"}>Name unavailable</span>
                <input type="text" name="code" id="code" placeholder="Event Code" value={code} onChange={handleCodeInput}/>
                <span className={codeError ? "italics" : "hidden"}>Tournament unavailable</span>
                <input type="button" name="join" id="join" value="Join Event" onClick={handleSubmitJoin} />
                <input type="button" name="return" id="return" value="Cancel" onClick={handleCancelJoin} />
            </form>
        </div>
    );
}

export default JoinEvent;