import { useNavigate } from "react-router";

import '../styles/Home.css';

function Home(): JSX.Element
{
    const navigate = useNavigate();

    const handleCreateEvent = () =>{
        navigate("/host");
    };

    const handleJoinEvent = () => {
        navigate("/join");
    };

    return(
        <div className="home">
            <h1>TMTGC Draft Tracker</h1>
            <form>
                <input type="button" name="CreateEvent" id="CreateEvent" value="Create Event" onClick={handleCreateEvent}/>
                <input type="button" name="JoinEvent" id="JoinEvent" value="Join Event" onClick={handleJoinEvent}/>
            </form>
        </div>
    );
}

export default Home;