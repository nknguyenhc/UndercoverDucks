import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PortList from "../components/port/portlist";
import NavBar from "../components/navbar/navbar";
import Greet from "../components/greet/greet";
import Reset from "../components/reset/reset";

export const PageContext = createContext(null);

export default function Simulate() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [portlist, setPortlist] = useState([]);
    const [filteredPortlist, setFilteredPortlist] = useState(portlist);
    const [isNewLocation, setIsNewLocation] = useState(true);

    useEffect(() => {
        fetch('/user/status')
            .then(res => {
                if (res.status !== 200) {
                    alert("Something went wrong");
                    return;
                }
                res.json().then(res => {
                    if (!res.status) {
                        navigate('/user?next=' + location.pathname);
                    } else {
                        setIsAuthenticated(true);
                        if (location.pathname === '/') {
                            navigate('/dashboard/');
                        }
                    }
                });
            })
    }, [navigate, location]);

    const refreshPorts = useCallback(() => {
        if (isAuthenticated) {
            fetch('/traffic/')
                .then(res => {
                    if (res.status !== 200) {
                        alert("Something went wrong");
                        return;
                    }
                    res.json().then(res => {
                        setPortlist(res.ports);
                        setIsNewLocation(true);
                        if (location.pathname === '/' || location.pathname.startsWith('/dashboard')) {
                            setFilteredPortlist(res.ports.filter(port => port.country === 'SGP'));
                        } else {
                            setFilteredPortlist(res.ports);
                        }
                    })
                });
        }
    }, [isAuthenticated, location]);

    useEffect(() => {
        refreshPorts();
    }, [refreshPorts]);

    const sortMethods = useMemo(() => [
        {
            name: "volume",
            sort: () => setFilteredPortlist(ports => ports.toSorted(
                (port1, port2) => port2.volume - port1.volume
            )),
        },
        {
            name: "name",
            sort: () => setFilteredPortlist(ports => ports.toSorted(
                (port1, port2) => port1.name > port2.name 
                    ? 1
                    : port1.name < port2.name
                    ? -1
                    : 0
            )),
        },
    ], []);

    const [highlightingPort, setHighlightingPort] = useState(undefined);
    const [portFrom, setPortFrom] = useState(undefined);
    const [portTo, setPortTo] = useState(undefined);
    const [selectingIndex, setSelectingIndex] = useState(0);
    const [isJustEditedBulk, setIsJustEditedBulk] = useState(true);

    const handlePortSelect = useCallback((port) => {
        if (location.pathname === '/dashboard' || location.pathname === '/ports') {
            setHighlightingPort(port);
        } else {
            switch (selectingIndex) {
                case 0:
                    setPortFrom(port);
                    setSelectingIndex(1);
                    break;
                case 1:
                    if (port.name === portFrom.name) {
                        setPortFrom(undefined);
                        setSelectingIndex(0);
                        break;
                    } else {
                        setPortTo(port);
                        setSelectingIndex(2);
                        break;
                    }
                case 2:
                    switch (port.name) {
                        case portFrom.name:
                            setPortFrom(portTo);
                            setPortTo(undefined);
                            setSelectingIndex(1);
                            break;
                        case portTo.name:
                            setPortTo(undefined);
                            setSelectingIndex(1);
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    setPortFrom(undefined);
                    setPortTo(undefined);
                    setSelectingIndex(0);
                    break;
            }
            setIsJustEditedBulk(true);
        }
    }, [location, selectingIndex, portFrom, portTo]);

    const [isEditingBulk, setIsEditingBulk] = useState(false);
    const [proportionList, setProportionList] = useState([]);

    const addProportion = useCallback((portFrom, portTo, proportion) => {
        setProportionList(proportionList => ([
            ...proportionList.filter(item => (
                item.portFrom.name !== portFrom.name
                || item.portTo.name !== portTo.name
            )),
            {
                portFrom,
                portTo,
                proportion,
            },
        ]));
    }, []);

    const removeProportionItem = useCallback((portFrom, portTo) => {
        setProportionList(proportionList => proportionList.filter(item => (
            item.portFrom.name !== portFrom.name
            || item.portTo.name !== portTo.name
        )))
    }, []);

    const clearProportions = useCallback(() => {
        setProportionList([]);
    }, []);

    const handleResetData = useCallback(() => {
        refreshPorts();
        navigate('/dashboard');
    }, [refreshPorts, navigate])

    return <div className="simulation">
        <NavBar />
        <div className="simulation-page">
            <div className="simulation-page-top">
                <Greet />
                <Reset refresh={handleResetData} />
            </div>
            <div className="simulation-page-body">
                <PageContext.Provider
                    value={{
                        highlightingPort,
                        setHighlightingPort,
                        handlePortSelect,
                        portFrom,
                        portTo,
                        refreshPorts,
                        isNewLocation,
                        setIsNewLocation,
                        isEditingBulk,
                        setIsEditingBulk,
                        proportionList,
                        addProportion,
                        clearProportions,
                        removeProportionItem,
                        isJustEditedBulk,
                        setIsJustEditedBulk,
                    }}
                >
                    <PortList 
                        portlist={filteredPortlist}
                        caption="Singapore" 
                        sortMethods={sortMethods}
                    />
                    <div className="simulation-page-highlight">
                        <Outlet />
                    </div>
                </PageContext.Provider>
            </div>
        </div>
    </div>;
}
