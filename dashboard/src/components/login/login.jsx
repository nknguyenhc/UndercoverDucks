import { useCallback, useEffect, useState } from "react";
import { postContent, queryValue } from "../../utils/request";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = useCallback(() => {
        fetch('/user/login', postContent({
            username: username,
            password: password,
        }))
            .then(res => {
                if (res.status !== 200) {
                    alert("Something went wrong!");
                    return;
                }
                res.json().then(res => {
                    if (queryValue('next')) {
                        navigate(queryValue('next'));
                    } else {
                        navigate('/');
                    }
                });
            })
    }, [username, password, navigate]);

    useEffect(() => {
        fetch('/user/status')
            .then(res => {
                if (res.status !== 200) {
                    alert("Something went wrong");
                    return;
                }
                res.json().then(res => {
                    if (res.status) {
                        if (queryValue('next')) {
                            navigate(queryValue('next'));
                        } else {
                            navigate('/');
                        }
                    }
                })
            })
    }, [navigate]);

    return <div className="login">
        <div className="login-frame">
            <div className="text-center fs-4 fw-semibold">Login</div>
            <div className="login-username">
                <label htmlFor="username">Username</label>
                <input 
                    type="text"
                    id="username"
                    className="form-control"
                    onChange={event => setUsername(event.target.value)}
                />
            </div>
            <div className="login-password">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    className="form-control"
                    onChange={event => setPassword(event.target.value)}
                />
            </div>
            <button className="btn btn-primary login-submit" onClick={handleLogin}>Login</button>
        </div>
    </div>;
}