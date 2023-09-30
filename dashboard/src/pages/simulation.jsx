import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PortList from "../components/port/portlist";
import NavBar from "../components/navbar/navbar";
import Greet from "../components/greet/greet";
import DateDisplay from "../components/greet/date";
import Pin from "../components/pin/pin";
import ViewPort from "../components/viewPort/viewPort";


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

    const [portlist, setPortlist] = useState([
        {
            name: "Tanjong Pagar Terminal",
            country: "SGP",
            volume: 1000,
        },
        {
            name: "Keppel Terminal",
            country: "SGP",
            volume: 500,
        },
        {
            name: "Pasir Panjang Terminal",
            country: "SGP",
            volume: 400,
        }
    ]);

    const sortMethods = [
        {
            name: "volume",
            sort: () => setPortlist(ports => ports.toSorted(
                (port1, port2) => port2.volume - port1.volume
            )),
        },
        {
            name: "name",
            sort: () => setPortlist(ports => ports.toSorted(
                (port1, port2) => port1.name > port2.name 
                    ? 1
                    : port1.name < port2.name
                    ? -1
                    : 0
            )),
        },
    ]

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
    
    //<PortList portlist={portlist} caption="Singapore" sortMethods={sortMethods} />
    //<Pin port={portlist[0]}/>
    // return <div>
    //     <ViewPort port={portlist[0]} data={data}/>
    // </div>;

    return <div className="simulation">
        <NavBar />
        <div className="simulation-page">
            <Greet />
            <div className="simulation-page-body">
                <PortList portlist={portlist} caption="Singapore" sortMethods={sortMethods} />
                <div className="simulation-page-highlight">
                    <DateDisplay />
                </div>
            </div>
        </div>
    </div>;
}