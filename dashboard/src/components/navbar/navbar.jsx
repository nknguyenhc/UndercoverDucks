import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dashboardIcon from './dashboard.png';
import portIcon from './port.png';
import trafficInfoIcon from './traffic-info.png';
import logoutIcon from './logout.png';

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

    const handleLogout = useCallback(() => {
        fetch('/user/logout')
            .then(res => {
                if (res.status !== 200) {
                    alert("Something went wrong");
                    return;
                }
                navigate('/user');
            });
    }, [navigate]);

    return <div className="navbar-container bg-blue">
        <div className="navbar-main">
            <div className="navbar-top">
                <div className="navbar-top-icon">
                    <img src={process.env.PUBLIC_URL + "/favicon.ico"} alt="" />
                </div>
                Undercover Ducks
            </div>
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
        </div>
        <div className="navbar-tab navbar-logout" onClick={handleLogout}>
            <div className="navbar-tab-icon">
                <img src={logoutIcon} alt="" />
            </div>
            <div className="navbar-tab-text">Logout</div>
        </div>
    </div>;
}
