import React from "react";
import { Check } from "../../interfaces";

const Checker: React.FC<Check> = ({ message, doThis, idTag }) => {
    return (
        <div>
            <div className="modal" id={idTag} tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Action</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>{message}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={doThis}>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checker;