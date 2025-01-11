// Create an event handler that calls the given callback function when messages are received from the /subscribe endpoint
function CreateConnection(serverUrl: string, eventCode: string, callbackFn: Function)
{
    const events: EventSource = new EventSource(serverUrl + `/subscribe/${eventCode}`);
    events.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);
        callbackFn(data);
    }
}

export default CreateConnection;