import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

const Bug: React.FC<{ bug: any }> = ({ bug }) => {

    const shade = classNames(
        "list-group-item", "list-group-item-action", {
        "list-group-item-success": bug.priority === "Low",
        "list-group-item-warning": bug.priority === "Med",
        "list-group-item-danger": bug.priority === "High",
    })
    const link = "/view/" + bug["_id"];

    return (
        <div className="col">
            <li className="d-flex flex-row position-relative">
                <Link className={shade} to={link}>{bug.bugName}</Link>
            </li>
        </div>
    )
}

export default Bug;