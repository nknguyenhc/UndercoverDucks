import { useCallback, useState } from 'react';
import arrowRight from './arrow-right.png';

export default function TrafficInfo({ portFrom, portTo }) {
    return <div className="traffic">
        <div className="traffic-header">
            <div className="traffic-header-text">
                <div className="traffic-header-indicator">You have selected:</div>
                <div className="traffic-header-name">{portFrom.name}</div>
                <div className="traffic-header-name">{portTo.name}</div>
            </div>
            <div className="traffic-header-countries">
                <div className="traffic-header-country bg-yellow">{portFrom.country}</div>
                <div className="traffic-header-country bg-pink">{portTo.country}</div>
            </div>
        </div>
        <div className="traffic-body">
            <TrafficInfoBlock portFrom={portFrom} portTo={portTo} />
            <TrafficInfoBlock portFrom={portTo} portTo={portFrom} />
        </div>
    </div>;
}

const TrafficInfoBlock = ({ portFrom, portTo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [volumeValue, setVolumeValue] = useState(400);
    const [volumeTempValue, setVolumeTempValue] = useState(400);
    const [diversionIndex, setDiversionIndex] = useState(4.1);
    const [diversionTempIndex, setDiversionTempIndex] = useState(4.1);

    const handleSave = useCallback(() => {
        setIsEditing(false);
        setVolumeTempValue(volumeValue);
        setDiversionTempIndex(diversionIndex);
    }, [volumeValue, diversionIndex]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setVolumeTempValue(volumeValue);
        setDiversionTempIndex(diversionIndex);
    }, [volumeValue, diversionIndex]);

    return <div className="traffic-body-block">
        <div className="traffic-body-block-main">
            <div className="traffic-body-indicator">
                <div className="traffic-body-indicator-text">{portFrom.name}</div>
                <div className="traffic-body-indicator-icon">
                    <img src={arrowRight} alt="" />
                </div>
                <div className="traffic-body-indicator-text">{portTo.name}</div>
            </div>
            <div className="traffic-body-block-details">
                <div className="traffic-body-block-block">
                    <div className="traffic-body-block-block-text">Number of ships:</div>
                    <div className="traffic-body-block-block-stats">
                        {isEditing 
                        ? <input 
                            type="number"
                            className="traffic-body-block-block-input form-control"
                            value={volumeTempValue} 
                            onChange={e => setVolumeTempValue(e.target.value)}
                        /> 
                        : volumeValue}
                    </div>
                </div>
                <div className="traffic-body-block-block">
                    <div className="traffic-body-block-block-text">Diversion index:</div>
                    <div className="traffic-body-block-block-stats">
                        {isEditing 
                        ? <input 
                            type="number"
                            className="traffic-body-block-block-input form-control"
                            value={diversionTempIndex}
                            onChange={e => setDiversionTempIndex(e.target.value)}
                        /> 
                        : diversionIndex}
                    </div>
                </div>
            </div>
        </div>
        {isEditing
        ? <div className="traffic-body-block-editing">
            <div className="traffic-body-block-editing-button" onClick={handleSave}>save</div>
            <div className="traffic-body-block-editing-button" onClick={handleCancel}>cancel</div>
        </div>
        : <div className="traffic-body-block-edit" onClick={() => setIsEditing(true)}>edit</div>}
    </div>;
}
