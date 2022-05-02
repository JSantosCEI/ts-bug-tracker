import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { Bug as BugSchema } from "../interfaces";

const Bug: React.FC<{ bug: BugSchema }> = ({ bug }) => {

    const shade = classNames(
        "list-group-item", "list-group-item-action", {
        "list-group-item-success": bug.priority === "Low",
        "list-group-item-warning": bug.priority === "Med",
        "list-group-item-danger": bug.priority === "High",
    })
    const link = "/view/" + bug.bugId;

    return (
        <div>
            <li className="d-flex flex-row position-relative rounded">
                <Link className={shade} to={link}>{bug.bugName}</Link>
            </li>
        </div>
    )
}

export default Bug;