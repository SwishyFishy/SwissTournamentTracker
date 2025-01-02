import { useState } from "react";
import { useNavigate, useLocation } from "react-router";

import Popup from "reactjs-popup";

import '../styles/Home.css';

function Home(): JSX.Element
{
    // Detect if this page is the landing zone of an error
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState<boolean>(location.state?.error ? true : false);
    const emsg: string = location.state?.emsg;

    // Functionality for the buttons
    const handleCreateEvent = () => {
        navigate("/host");
    };

    const handleJoinEvent = () => {
        navigate("/join");
    };

    return(
        <div className="wrapper home">
            <h1>TMTGC Tournament Tracker</h1>
            <Popup open={open} closeOnDocumentClick>
                <h1>Uh Oh...</h1>
                <p>{emsg}</p>
                <input type="button" name="dismiss" id="dismiss" value="Dismiss" onClick={() => setOpen(false)} />
            </Popup>
            <form>
                <input type="button" name="CreateEvent" id="CreateEvent" value="Create Event" onClick={handleCreateEvent}/>
                <input type="button" name="JoinEvent" id="JoinEvent" value="Join Event" onClick={handleJoinEvent}/>
            </form>
        </div>
    );
}

export default Home;