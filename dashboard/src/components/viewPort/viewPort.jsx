import { useCallback , useContext, useEffect, useState } from "react";
import Graph from "../pin/graph";
import { PageContext } from "../../pages/simulation";
import { useLocation } from "react-router-dom";

export default function ViewPort() {
    const [showTextbox , setShowTextbox] = useState(false); 
    const port = useContext(PageContext).highlightingPort;
    const [editingPort, setEditingPort] = useState(port);
    const data = [
        {
          name: '30 Sep',
          ships: 4000,
          amt: 2400,
        },
        {
          name: '7 Oct',
          ships: 3000,
          amt: 2210,
        },
        {
          name: '14 Oct',
          ships: 2000,
          amt: 2290,
        },
        {
          name: '21 Oct',
          ships: 2780,
          amt: 2000,
        },
        {
          name: '28 Oct',
          ships: 1890,
          amt: 2181,
        },
    ];
    const location = useLocation();

    const handleCancel = useCallback(() => {
        setShowTextbox(false);
        setEditingPort(port);
    }, [port]);

    const handleSave = useCallback(() => {
        setShowTextbox(false);
    }, []);
    
    const handleEdit = useCallback(() => {
        setShowTextbox(true);
    }, []);

    useEffect(() => {
        setEditingPort(port);
    }, [port]);

    if (!port || (location.pathname === '/ports' && port.country !== 'SGP')) {
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
                    ? <button className='buttonContainer' onClick={handleEdit}>edit</button>
                    : <div className="buttons">
                        <button className='buttonContainer' onClick={handleSave}>save</button>
                        <button className='buttonContainer' onClick={handleCancel}>cancel</button>
                    </div>
                }
            </div>
        </div>
        <div>
            <div className="predictions">Predictions</div>
            <Graph data={data} />
        </div>
    </div>;
}
