import { useCallback, useContext, useEffect, useState } from 'react';
import arrowRight from './arrow-right.png';
import { PageContext } from '../../pages/simulation';
import { postContent } from '../../utils/request';

export default function TrafficInfo() {
    const { portFrom, portTo } = useContext(PageContext);

    if (!portFrom || !portTo) {
        return <div>Please select 2 ports</div>;
    }

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
    const [proportionIndex, setProportionIndex] = useState(0);
    const [proportionTempValue, setProportionTempValue] = useState(0);
    const [diversionIndex, setDiversionIndex] = useState(0);
    const [diversionTempIndex, setDiversionTempIndex] = useState(0);

    const handleSave = useCallback(() => {
        fetch('/traffic/set-proportion', postContent([
            {
                port_from_id: portFrom.id,
                port_to_list: [
                    {
                        port_to_id: portTo.id,
                        proportion: proportionTempValue,
                    },
                ],
            },
        ]))
            .then(res => {
                if (res.status !== 200) {
                    alert("Something went wrong");
                    return;
                }
                res.json().then(res => {
                    setProportionIndex(proportionTempValue);
                })
                    .then(() => fetch('/traffic/set-similarity', postContent({
                        port_from_id: portFrom.id,
                        port_to_id: portTo.id,
                        similarity: diversionTempIndex,
                    })))
                    .then(res => {
                        if (res.status !== 200) {
                            alert("Something went wrong");
                            return;
                        }
                        res.json().then(res => {
                            setIsEditing(false);
                            setDiversionIndex(diversionTempIndex);
                        });
                    });
            })
    }, [proportionTempValue, diversionTempIndex, portFrom, portTo]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setProportionTempValue(proportionIndex);
        setDiversionTempIndex(diversionIndex);
    }, [proportionIndex, diversionIndex]);

    const refreshIndices = useCallback(() => {
        fetch(`/traffic/between?port_from_id=${portFrom.id}&port_to_id=${portTo.id}`)
            .then(res => {
                if (res.status !== 200) {
                    alert("Something went wrong");
                    return;
                }
                res.json().then(res => {
                    setProportionIndex(res.traffic.proportion);
                    setProportionTempValue(res.traffic.proportion);
                })
            })
    }, [portFrom, portTo]);

    useEffect(() => {
        refreshIndices();
    }, [refreshIndices]);

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
                    <div className="traffic-body-block-block-text">Proportion index:</div>
                    <div className="traffic-body-block-block-stats">
                        {isEditing 
                        ? <input 
                            type="number"
                            className="traffic-body-block-block-input form-control"
                            value={proportionTempValue} 
                            onChange={e => setProportionTempValue(e.target.value)}
                        /> 
                        : proportionIndex}
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
