

export default function Port({ port, bg }) {
    return <div className="port">
        <div className={`port-country bg-${bg}`}>{port.country}</div>
        <div className="port-details">
            <div className="port-name">{port.name}</div>
            <div className="port-volume">Volume: {port.volume}</div>
        </div>
    </div>;
}