import { useState, useEffect, useContext } from "react";
import { CONTEXT_serverBaseUrl } from "../main";

function Home()
{
    const [resp, setResp] = useState("");
    const serverUrl: string = useContext(CONTEXT_serverBaseUrl);

    async function getData()
    {
        const url: string = serverUrl + "submit";
        const response = await fetch(url);

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