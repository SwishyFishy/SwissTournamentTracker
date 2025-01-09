import { useEffect, useContext, createContext } from "react";
import { Outlet } from "react-router";

import { Match } from "../types";
import { CONTEXT_serverBaseUrl } from "../main";

import '../styles/Layout.css';

export const CONTEXT_currentMatches = createContext([]);

function Layout(): JSX.Element
{
    return(
        <CONTEXT_currentMatches.Provider value={[]}>
            <div className="layout">
                <Outlet />
                <footer>&copy; 2025 Jonah Galloway-Fenwick</footer>
            </div>
        </CONTEXT_currentMatches.Provider>
    );
}

export default Layout;