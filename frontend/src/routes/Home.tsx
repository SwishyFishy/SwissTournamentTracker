import { useNavigate, useLocation } from "react-router";
import Popup from "reactjs-popup";

import '../styles/Home.css';

function Home(): JSX.Element
{
    // Detect if this page is the landing zone of an error
    const navigate = useNavigate();
    const location = useLocation();
    let error: boolean = false;
    let emsg: string = "";
    if (location.state?.error)
    {
        error = true;
        emsg = location.state.emsg;
    }

    // Functionality for the buttons
    const handleCreateEvent = () => {
        navigate("/host");
    };

    const handleJoinEvent = () => {
        navigate("/join");
    };

    return(
        <div className="wrapper home">
            <h1>TMTGC Draft Tracker</h1>
            <Popup open={error} closeOnDocumentClick>
                <h1>Uh Oh...</h1>
                <p>{emsg}</p>
                <p className="italics">Click to dismiss</p>
            </Popup>
            <form>
                <input type="button" name="CreateEvent" id="CreateEvent" value="Create Event" onClick={handleCreateEvent}/>
                <input type="button" name="JoinEvent" id="JoinEvent" value="Join Event" onClick={handleJoinEvent}/>
            </form>
        </div>
    );
}

export default Home;