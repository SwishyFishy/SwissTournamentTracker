import { useNavigate } from "react-router";

function HostSetup(): JSX.Element
{
    const navigate = useNavigate();
    navigate("/host/event");

    return(
        <div className="hostSetup">
            <p>Creating your event...</p>
        </div>
    );
}

export default HostSetup;