import { useCallback , useContext, useEffect, useState } from "react";
import Graph from "../pin/graph";
import { PageContext } from "../../pages/simulation";
import { useLocation } from "react-router-dom";
import { postContent } from '../../utils/request';
import DeletePort from './delete-port'; 

export default function ViewPort() {
    const [showTextbox , setShowTextbox] = useState(false); 
    const port = useContext(PageContext).highlightingPort;
    const { setHighlightingPort, refreshPorts } = useContext(PageContext);
    const [editingPort, setEditingPort] = useState(port);
    const [data, setData] = useState([]);
    const location = useLocation();

    const handleCancel = useCallback(() => {
        setShowTextbox(false);
        setEditingPort(port);
    }, [port]);

    const handleSave = useCallback(() => {
        fetch('/traffic/set-port-info', postContent({
            port_id: port.id,
            update_dict: {
                name: editingPort.name,
                volume: editingPort.volume,
                country: editingPort.country,
            },
        }))
            .then(res => {
                if (res.status !== 200) {
                    alert("Something went wrong");
                    return;
                }
                setShowTextbox(false);
                refreshPorts();
                setHighlightingPort(editingPort);
            })
    }, [port, editingPort, refreshPorts, setHighlightingPort]);
    
    const handleEdit = useCallback(() => {
        setShowTextbox(true);
    }, []);

    const dateToText = useCallback(date => 
            `${new Date(date).getDate()}/${new Date(date).getMonth() + 1}`, 
            []);

    useEffect(() => {
        setEditingPort(port);
    }, [port]);

    const refreshData = useCallback(() => {
        if (port) {
            fetch(`/traffic/predict?port_id=${port.id}&weeks=5`)
                .then(res => {
                    if (res.status !== 200) {
                        alert("Something went wrong");
                        return;
                    }
                    res.json().then(res => {
                        const current = new Date();
                        const oneWeek = 1000 * 3600 * 24 * 7;
                        setData(res.volumes.map((volume, index) => ({
                            name: dateToText(current.getTime() + index * oneWeek),
                            ships: volume,
                        })));
                    })
                })
        }
    }, [port, dateToText]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    if (!port || (location.pathname === '/dashboard' && port.country !== 'SGP')) {
        return <div></div>;
    }

    return <div className="pin">
        <div className="pinContainer">
            <div className="pinDetails">
                {!showTextbox 
                    ? <div className="pinName">{port.name}</div>
                    : <div className="editing-block">
                        <div>Name</div>
                        <input className="form-control" 
                            value={editingPort.name} 
                            onChange={(e) => {
                                setEditingPort(editingPort => ({
                                    ...editingPort,
                                    name: e.target.value,
                                }));
                            }}>
                        </input>
                    </div>
                }
                {!showTextbox 
                    ? <div className="pinCountry">{port.country}</div>
                    : <div className="editing-block">
                        <div>Country</ div>
                        <input className="form-control" 
                            value={editingPort.country} 
                            onChange={(e) => {
                                setEditingPort(editingPort => ({
                                    ...editingPort,
                                    country: e.target.value,
                                }));
                            }}>
                        </input>
                    </ div>
                }
                {!showTextbox 
                    ? <div className="pinVolume">Volume: {port.volume}</div>
                    : <div className="editing-block">
                        <div>Volume</div>
                        <input className="form-control" 
                            value={editingPort.volume} 
                            onChange={(e) => {
                                setEditingPort(editingPort => ({
                                    ...editingPort,
                                    volume: e.target.value,
                                }));
                            }}>
                        </input>
                    </div>
                }
            </div>
            <div className="pinEdit">
                {!showTextbox
                    ? <div className="viewport-editAndDeleteButtons">
                        <button className='buttonContainer' onClick={handleEdit}>edit</button>
                        <DeletePort refresh={refreshData} />
                    </div>
                    : <div className="buttons">
                        <button className='buttonContainer' onClick={handleSave}>save</button>
                        <button className='buttonContainer' onClick={handleCancel}>cancel</button>
                    </div>
                }
            </div>
        </div>
        <div>
            <div className="predictions">Volume</div>
            <Graph data={data} />
            <div className="viewport-date-label">Date</div>
        </div>
    </div>;
}
