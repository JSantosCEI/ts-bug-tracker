import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

library.add(faExclamationCircle);

const ErrorText: React.FC<{ message: String }> = ({ message }) => {
    return (
        <div>
            <p className="text-danger"><FontAwesomeIcon icon={faExclamationCircle} /> {message}</p>
        </div>
    )
}

export default ErrorText;