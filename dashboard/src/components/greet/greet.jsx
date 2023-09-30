import { useEffect, useState } from 'react';
import personIcon from './person.png';

export default function Greet() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        fetch('/user/status')
            .then(res => {
                if (res.status !== 200) {
                    alert("Something went wrong");
                    return;
                }
                res.json().then(res => {
                    setUsername(res.username);
                })
            })
    }, []);

    return <div className="greet">
        <div className="greet-icon">
            <img src={personIcon} alt="" />
        </div>
        <div className="greet-text">Good day, {username}</div>
    </div>
}