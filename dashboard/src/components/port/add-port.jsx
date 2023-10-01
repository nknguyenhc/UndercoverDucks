import { Modal, Button } from "react-bootstrap";
import { useState } from "react"; 

export default function AddPort() {

    const [isOpen, setIsOpen] = useState(false); 
    const openModal = () => { setIsOpen(true) }
    const closeModal = () => { setIsOpen(false) }

    const [portName, setPortName] = useState(); 
    const [portCountry, setPortCountry] = useState(); 
    const [portVolume, setPortVolume] = useState(); 

    const handleSubmit = () => {
        closeModal(); 
    }

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
                <Button variant="secondary" onClick={closeModal}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    </>; 
    
}