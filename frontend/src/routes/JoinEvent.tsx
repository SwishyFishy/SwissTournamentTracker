
import { useState } from "react";

function JoinEvent(): JSX.Element
{
    const [name, setName] = useState("");
    const [code, setCode] = useState("");

    const handleNameInput = (e: any) => {
        setName(e.currentTarget?.value);
    };
    
    const handleCodeInput = (e: any) => {
        setCode(e.currentTarget?.value);
    };

    return(
        <div className="joinEvent">
            <h1>Join Event</h1>
            <form>
                <input type="text" name="name" id="name" placeholder="Your Name" value={name} onChange={handleNameInput}/>
                <input type="text" name="code" id="code" placeholder="Event Code" value={code} onChange={handleCodeInput}/>
            </form>
        </div>
    );
}

export default JoinEvent;