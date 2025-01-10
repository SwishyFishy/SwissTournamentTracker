import { createContext } from "react";
import { Outlet } from "react-router";

import Footer from "../components/Footer";

import '../styles/Layout.css';

export const CONTEXT_currentMatches = createContext([]);

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