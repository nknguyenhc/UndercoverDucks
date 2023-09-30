import { useCallback , useState } from "react";
import Graph from "../pin/graph";

export default function ViewPort({port , data}) {
    const [showTextbox , setShowTextbox] = useState(false); 
    const onPress = useCallback(() => {
        setShowTextbox(showTextbox => !showTextbox); 
    }, []);
    const [portName , setPortName] = useState(port.name); 
    const [portCountry , setPortCountry] = useState(port.country); 
    const [portVolume , setPortVolume] = useState(port.volume); 

    return <div className="pin">
        <div className="pinContainer">
            <div className="pinDetails">
                {!showTextbox 
                    ? <div className="pinName">{portName}</div>
                    : <div>
                        <div>Name</div>
                        <input className="form-control" 
                            value={portName} 
                            onChange={(e) => setPortName(e.target.value)}>
                        </input>
                    </div>
                }
                {!showTextbox 
                    ? <div className="pinCountry">{portCountry}</div>
                    : <div>
                        <div>Country</ div>
                        <input className="form-control" 
                            value={portCountry} 
                            onChange={(e) => setPortCountry(e.target.value)}>
                        </input>
                    </ div>
                }
                {!showTextbox 
                    ? <div className="pinVolume">Volume: {portVolume}</div>
                    : <div>
                        <div>Volume</div>
                        <input className="form-control" 
                            value={portVolume} 
                            onChange={(e) => setPortVolume(e.target.value)}>
                        </input>
                    </div>
                }
            </div>
            <div className="pinEdit">
                {!showTextbox
                    ? <button className='buttonContainer' onClick={onPress}>edit</button>
                    : <button className='buttonContainer' onClick={onPress}>save</button>
                }
            </div>
        </div>
        <div>
            <div className="predictions">Predictions</div>
            <Graph data={data} />
        </div>
    </div>;
}
