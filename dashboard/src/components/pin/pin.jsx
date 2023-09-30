import React, { useState } from 'react';
import Graph from './graph'; 

export default function Pin({port , data}) {
    return <div className="pin">
        <div className="pinContainer">
            <div className="pinDetails">
                <div className="pinName">{port.name}</div>
                <div className="pinCountry">{port.country}</div>
                <div className="pinVolume">Volume: {port.volume}</div>
            </div>
        </div>
        
        <div>
            <div className="predictions">Predictions</div>
            <Graph data={data} />
        </div>
    </div>;
}