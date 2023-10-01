import { useCallback, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { postContent } from "../../utils/request";

export default function Reset({ refresh }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleReset = useCallback(() => {
        fetch('/traffic/reset', postContent({}))
            .then(res => {
                if (res.status !== 200) {
                    alert("Something went wrong");
                    return;
                }
                refresh();
                setIsOpen(false);
            })
    }, [refresh]);

    return <>
        <div className="reset"onClick={() => setIsOpen(true)}>reset data</div>
        <Modal show={isOpen} onHide={() => setIsOpen(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Reset data?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <div className="reset-buttons">
                    <Button variant="primary" onClick={handleReset}>Yes</Button>
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>No</Button>
                </div>
            </Modal.Footer>
        </Modal>
    </>;
}
