import { Outlet } from "react-router";

import '../styles/Layout.css';

function Layout(): JSX.Element
{
    return(
        <div className="layout">
            <Outlet />
            <footer>&copy; 2025 Jonah Galloway-Fenwick</footer>
        </div>
    );
}

export default Layout;