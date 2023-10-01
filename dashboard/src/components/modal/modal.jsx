

export default function Modal({ id, button, title, body }) {
    return <>
        <div type="button" data-bs-toggle="modal" data-bs-target={`#${id}`}>
            {button}
        </div>
        <div className="modal fade" id={`${id}`} tabindex="-1" aria-labelledby={`${id}-label`} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id={`${id}-label`}>{title}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {body}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </>;
}
