import { Outlet } from "react-router";

import '../styles/Layout.css';

function Layout(): JSX.Element
{
    return(
        <div className="layout">
            <Outlet />
        </div>
    );
}

export default Layout;