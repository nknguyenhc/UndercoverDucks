

export default function DateDisplay() {
    const date = new Date();
    const dateString = `Today, ${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`

    return <div className="date">
        <div className="date-date">{dateString}</div>
        <div className="date-location">Singapore</div>
    </div>
}
