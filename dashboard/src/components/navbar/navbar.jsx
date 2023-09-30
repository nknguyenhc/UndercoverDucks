import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dashboardIcon from './dashboard.png';
import portIcon from './port.png';
import trafficInfoIcon from './traffic-info.png';


export default function NavBar() {
    const navbarTabs = useMemo(() => [
        {
            text: 'Dashboard',
            urlPrefix: '/dashboard',
            img: dashboardIcon,
        },
        {
            text: 'Ports',
            urlPrefix: '/ports',
            img: portIcon,
        },
        {
            text: 'Traffic info',
            urlPrefix: '/traffic-info',
            img: trafficInfoIcon,
        },
    ], []);
    const location = useLocation();
    const navigate = useNavigate();
    const highlight = useMemo(() => Math.max(
        navbarTabs.indexOf(
            navbarTabs.find(e => location.pathname.startsWith(e.urlPrefix))
        ),
        0
    ), [navbarTabs, location]);

    return <div className="navbar-container bg-blue">
        <div className="navbar-top">Undercover Ducks</div>
        <div className="navbar-body">
            {navbarTabs.map((tab, tabIndex) => (
                <div 
                    className="navbar-tab" 
                    onClick={() => navigate(tab.urlPrefix)}
                    key={tabIndex}
                >
                    <div className="navbar-tab-icon">
                        <img src={tab.img} alt="" />
                    </div>
                    <div className={"navbar-tab-text" + (tabIndex === highlight ? " navbar-tab-highlight" : "")}>
                        {tab.text}
                    </div>
                </div>
            ))}
        </div>
    </div>;
}
