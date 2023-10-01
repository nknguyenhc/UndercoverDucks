import { Modal, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useContext, useMemo, useState } from "react"; 
import { postContent } from '../../utils/request';
import { PageContext } from "../../pages/simulation";

export default function DeletePort({ refresh }) {

    const [isOpen, setIsOpen] = useState(false); 
    const openModal = () => { setIsOpen(true) }
    const closeModal = () => { setIsOpen(false) }
    const portId = useContext(PageContext).highlightingPort.id;

    const handleConfirm = () => {
        fetch('/traffic/close-port', postContent({
            port_id: portId,
        }))
            .then(res => {
                if (res.status !== 200) {
                    alert("Something went wrong");
                    return;
                }
                refresh();
                closeModal();
            })
    }

    const handleCancel = () => {
        closeModal(); 
    }

    const shutdownTooltip = useMemo(() => (
        <Tooltip>
            Simulate if this port shuts down at this time.
        </Tooltip>
    ), []);

    return <>
        <OverlayTrigger placement="left" overlay={shutdownTooltip}>
            <div className="deleteport-modalButton" onClick={openModal}>
                Shut down
            </div>
        </OverlayTrigger>
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