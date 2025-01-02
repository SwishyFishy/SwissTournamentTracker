import { useState } from "react";

import '../styles/JoinEvent.css';

function JoinEvent(): JSX.Element
{
    const [name, setName] = useState<string>("");
    const [code, setCode] = useState<string>("");

    // State management for input fields
    const handleNameInput = (e: any) => {
        setName(e.currentTarget?.value);
    };

    const handleCodeInput = (e: any) => {
        setCode(e.currentTarget?.value);
    };

    return(
        <div className="wrapper joinEvent">
            <h1>Join Event</h1>
            <form>
                <input type="text" name="name" id="name" placeholder="Your Name" value={name} onChange={handleNameInput}/>
                <input type="text" name="code" id="code" placeholder="Event Code" value={code} onChange={handleCodeInput}/>
                <input type="button" name="join" id="join" value="Join Event" />
            </form>
        </div>
    );
}

export default JoinEvent;