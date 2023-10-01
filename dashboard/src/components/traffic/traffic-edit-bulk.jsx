import { useCallback, useContext, useState } from "react";
import { PageContext } from "../../pages/simulation";
import { Modal, CloseButton, Button } from 'react-bootstrap';
import arrowRight from './arrow-right.png';
import { postContent } from "../../utils/request";

export default function TrafficEditBulk() {
    const { isEditingBulk, setIsEditingBulk, clearProportions } = useContext(PageContext);
    const [showList, setShowList] = useState(false);

    const handleEnable = useCallback(() => {
        setIsEditingBulk(true);
    }, [setIsEditingBulk]);

    const handleCancel = useCallback(() => {
        setIsEditingBulk(false);
        clearProportions();
    }, [setIsEditingBulk, clearProportions]);

    return <div className="editbulk">
        {!isEditingBulk
        ? <div className="editbulk-button" onClick={handleEnable}>enable edit bulk</div>
        : <>
            <div className="editbulk-button" onClick={() => setShowList(true)}>my list</div>
            <div className="editbulk-button" onClick={handleCancel}>disable edit bulk</div>
        </>}
        <EditBulkModal isOpen={showList} close={() => setShowList(false)} />
    </div>;
}

const EditBulkModal = ({ isOpen, close }) => {
    const { proportionList, setIsEditingBulk, clearProportions, setIsJustEditedBulk } = useContext(PageContext);

    const handleConfirm = useCallback(() => {
        const proportionListData = [];
        for (let i = 0; i < proportionList.length; i++) {
            const index = proportionListData.findIndex(e => e.port_from_id === proportionList[i].portFrom.id);
            if (index === -1) {
                proportionListData.push({
                    port_from_id: proportionList[i].portFrom.id,
                    port_to_list: [
                        {
                            port_to_id: proportionList[i].portTo.id,
                            proportion: proportionList[i].proportion,
                        },
                    ]
                });
            } else {
                proportionListData[index] = {
                    ...proportionListData[index],
                    port_to_list: [
                        ...proportionListData[index],
                        {
                            port_to_id: proportionList[i].portTo.id,
                            proportion: proportionList[i].proportion,
                        },
                    ]
                }
            }
        }
        fetch('/traffic/set-proportion', postContent(proportionListData))
            .then(res => {
                if (res.status !== 200) {
                    res.json().then(res => console.log(res));
                    alert("Something went wrong");
                    return;
                }
                setIsEditingBulk(false);
                clearProportions();
                setIsJustEditedBulk(true);
                close();
            })
    }, [proportionList, setIsEditingBulk, close, clearProportions, setIsJustEditedBulk]);

    return <Modal show={isOpen} centered={true}>
        <Modal.Header>
            <Modal.Title>Proportions</Modal.Title>
            <CloseButton onClick={close} />
        </Modal.Header>
        <Modal.Body>
            {proportionList.length === 0
            ? <div>No change in proportions to show</div>
            : proportionList.map((entry, entryIndex) => (
                <ProportionEntry entry={entry} key={entryIndex} />
            ))}
        </Modal.Body>
        {proportionList.length > 0 && <Modal.Footer>
            <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
        </Modal.Footer>}
    </Modal>
}

const ProportionEntry = ({ entry }) => {
    const { removeProportionItem } = useContext(PageContext);

    const handleRemove = useCallback(() => {
        removeProportionItem(entry.portFrom, entry.portTo);
    }, [removeProportionItem, entry]);

    return <div className="editbulk-entry">
        <div className="editbulk-entry-info">
            <div className="editbulk-entry-name">{entry.portFrom.name}</div>
            <div className="editbulk-entry-arrow">
                <img src={arrowRight} alt="" />
            </div>
            <div className="editbulk-entry-name">{entry.portTo.name}</div>
        </div>
        <div className="editbulk-entry-value">
            <div className="editbulk-entry-value-text">{entry.proportion}</div>
            <CloseButton onClick={handleRemove} />
        </div>
    </div>;
}
