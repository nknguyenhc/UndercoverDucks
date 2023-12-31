import Port from "./port";
import arrowDown from './arrow-down.svg';
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PageContext } from "../../pages/simulation";
import AddPort from "./add-port";
import { useLocation } from "react-router-dom";

export default function PortList({
    portlist,
    caption,
    sortMethods,
}) {
    const colors = ['pink', 'yellow', 'green'];
    const [sortMethodIndex, setSortMethodIndex] = useState(-1);
    const [showSort, setShowSort] = useState(false);
    const { isNewLocation, setIsNewLocation } = useContext(PageContext);
    const location = useLocation();
    const showCaption = useMemo(() => location.pathname === '/dashboard', [location]);

    const handleClick = useCallback((newIndex) => {
        setSortMethodIndex(newIndex);
        sortMethods[newIndex].sort();
        setShowSort(false);
    }, [sortMethods]);

    useEffect(() => {
        if (isNewLocation) {
            setIsNewLocation(false);
            setSortMethodIndex(-1);
        }
    }, [isNewLocation, setIsNewLocation]);

    return <div className="portlist">
        <div className="portlist-header">
            <div className="portlist-header-top">
                <div className="portlist-header-title">Ports</div>
                {showCaption && <div className="portlist-header-caption">
                    {caption}
                </div>}
            </div>
            <div className="portlist-header-sort-container">
                <div className="portlist-header-sort" onClick={() => setShowSort(showSort => !showSort)}>
                    <div>Sorted by: {sortMethodIndex > -1 ? sortMethods[sortMethodIndex].name : "not selected"}</div>
                    <img src={arrowDown} className={showSort ? "inverted" : ""} alt="" />
                </div>
                <div className="portlist-header-sort-list-container">
                    {showSort &&<div className="portlist-header-sort-list">
                        {sortMethods.map((sortMethod, sortIndex) => (
                            <div 
                                className={"portlist-header-sort-item" + (sortIndex === sortMethodIndex ? " portlist-header-sort-item-highlight" : "")}
                                onClick={() => handleClick(sortIndex)}
                                key={sortMethod.name}
                            >
                                {sortMethod.name}
                            </div>
                        ))}
                    </div>}
                </div>
            </div>
        </div>
        <div className="portlist-list">
            {portlist.map((port, portIndex) => (
                <Port
                    port={port}
                    key={port.name}
                    bg={colors[portIndex % 3]}
                />
            ))}
        </div>
        <AddPort />
    </div>;
}