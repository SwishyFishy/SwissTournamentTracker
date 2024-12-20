import { useState, useEffect, useContext } from "react";
import { CONTEXT_serverBaseUrl } from "../main";

function Home(): JSX.Element
{
    const [resp, setResp] = useState("");
    const serverUrl: string = useContext(CONTEXT_serverBaseUrl);

    async function getData(): Promise<void>
    {
        const response = await fetch(serverUrl + "submit");

        if(response.ok)
        {
            setResp(await response.text())
        }
    }

    useEffect(() => {
        getData();
    }, [])

    return(
        <>
            <p>Home page</p>
            <p>Response: {resp}</p>
        </>
    );
}

export default Home;