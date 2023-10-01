import { Modal, Button } from "react-bootstrap";
import { useState } from "react"; 

export default function DeletePort() {

    const [isOpen, setIsOpen] = useState(false); 
    const openModal = () => { setIsOpen(true) }
    const closeModal = () => { setIsOpen(false) }

    const handleConfirm = () => {
        closeModal(); 
    }

    const handleCancel = () => {
        closeModal(); 
    }

    return <>
        <div className="deleteport-modalButton">
            <div className="deleteport-modalButton" onClick={openModal}>
                Shut down
            </div>
        </div>
        <Modal show={isOpen} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Shut down?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <div className="deleteport-buttons">
                    <Button variant="primary" onClick={handleConfirm}>
                        Confirm
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    </>; 
    
}