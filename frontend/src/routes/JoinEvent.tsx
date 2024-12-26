
import { useState } from "react";

function JoinEvent(): JSX.Element
{
    const [name, setName] = useState("");

    const handleTextInput = (e: any) => {
        setName(e.currentTarget?.value);
    };

    return(
        <div className="joinEvent">
            <h1>Join Event</h1>
            <form>
                <input type="text" name="name" id="name" placeholder="Your Name" value={name} onChange={handleTextInput}/>
            </form>
        </div>
    );
}

export default JoinEvent;