import { Modal, Button } from "react-bootstrap";
import { useCallback, useContext, useState } from "react"; 
import { postContent } from '../../utils/request';
import { PageContext } from "../../pages/simulation";

export default function AddPort() {

    const [isOpen, setIsOpen] = useState(false); 
    const openModal = () => { setIsOpen(true) }
    const closeModal = () => { setIsOpen(false) }

    const [portName, setPortName] = useState(); 
    const [portCountry, setPortCountry] = useState(); 
    const [portVolume, setPortVolume] = useState(); 

    const { refreshPorts } = useContext(PageContext);

    const handleSubmit = useCallback(() => {
        fetch('/traffic/add-port', postContent({
            name: portName,
            country_code: portCountry,
            volume: portVolume,
        }))
            .then(res => {
                if (res.status !== 200) {
                    alert("Something went wrong");
                    return;
                }
                refreshPorts();
                closeModal();
            });
    }, [portName, portCountry, portVolume, refreshPorts]);

    return <>
        <div className="addport-modalButton">
            <Button variant="light" onClick={openModal}>
                Add port
            </Button>
        </div>
        <Modal show={isOpen} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add port</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="addport-textFields">
                    <div className="addport-field">
                        <div>Port Name:</div>
                        <input 
                            name="portName"
                            type="text" 
                            placeholder="Port Name"
                            className="form-control addport-box"
                            onChange={(e) => setPortName(e.target.value)}>
                        </input>
                    </div>
                    <div className="addport-field">
                        <div>Port Country:</div>
                        <input 
                            name="portCountry"
                            type="text" 
                            placeholder="Port Country"
                            className="addport-box form-control"
                            onChange={(e) => setPortCountry(e.target.value)}>
                        </input>
                    </div>
                    <div className="addport-field">
                        <div>Port Volume:</div>
                        <input 
                            name="portVolume"
                            type="number" 
                            placeholder="Port Volume"
                            className="addport-box form-control"
                            onChange={(e) => setPortVolume(e.target.value)}>
                        </input>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    </>; 
    
}