import { useContext, useMemo } from "react";
import { PageContext } from "../../pages/simulation";
import { useLocation } from "react-router-dom";

export default function Port({ port, bg }) {
    const { highlightingPort, handlePortSelect, portFrom, portTo } = useContext(PageContext);
    const location = useLocation();
    const isHighlighting = useMemo(() => {
        if (location.pathname === '/dashboard' || location.pathname === '/ports') {
            return port.name === highlightingPort?.name;
        } else {
            return port.name === portFrom?.name || port.name === portTo?.name;
        }
    }, [location, highlightingPort, portFrom, portTo, port]);

    return <div 
        className={"port" + (isHighlighting ? " port-highlight" : "")}
        onClick={() => handlePortSelect(port)}
    >
        <div className={`port-country bg-${bg}`}>{port.country}</div>
        <div className="port-details">
            <div className="port-name">{port.name}</div>
            <div className="port-volume">Volume: {port.volume}</div>
        </div>
    </div>;
}