import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export default function Simulate() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetch('/user/status')
            .then(res => {
                if (res.status !== 200) {
                    alert("Something went wrong");
                    return;
                }
                res.json().then(res => {
                    if (!res.status) {
                        navigate('/user?next=' + location.pathname);
                    }
                })
            })
    }, [navigate, location]);

    return <div>Simulation</div>;
}
