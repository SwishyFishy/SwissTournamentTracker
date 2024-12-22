import '../styles/errorPage.css';

function ErrorPage(): JSX.Element
{
    return(
        <div className="errorPage">
            <h1>Uh Oh...</h1>
            <p>Something went wrong. Please contact the event coordinator for assistance.</p>
        </div>
    );
}

export default ErrorPage;