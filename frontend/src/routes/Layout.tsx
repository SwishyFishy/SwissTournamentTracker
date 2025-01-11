import { Outlet } from "react-router";

import Footer from "../components/Footer";

import '../styles/Layout.css';

function Layout(): JSX.Element
{
    return(
        <div className="layout">
            <Outlet />
            <Footer />
        </div>
    );
}

export default Layout;