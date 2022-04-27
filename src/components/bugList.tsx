import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router";
import Bug from "./bug";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddBug from "./popups/addBug";
import { UserContext } from "./userContext";
import { authUser } from "./api/userApi";
import { getUserBugs } from "./api/bugApi";

library.add(faPlus);

const BugList: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [bugs, setBugs] = useState<Array<any>>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [expired, setExpired] = useState<boolean>(false);
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        console.log(user);
        axios.post(authUser + user, {"token": user}, { headers: { 'Authorization': `Bearer ${user}` } })
            .then((res) => {
                console.log(res.data);
                setUsername(res.data.username);
                axios.get(getUserBugs + res.data.userId, { headers: { Authorization: `Bearer ${user}` } })
                    .then(res => {
                        console.log(res.data);
                        setBugs([...res.data]);
                    })
                    .catch((err) => console.error(err));
            })
            .catch((err) => {
                setUser('');
                let message: string = err.message;
                let code: number = parseInt(message.slice(-3));
                code === 400 ? setExpired(true) : console.error(err);
            });
    }, [refresh, user, setUser])

    const unassignedList = bugs
        .filter((bug) => bug.status === "Unassigned")
        .map((bug) => <Bug key={bug["bugId"]} bug={bug} />)

    const toDoList = bugs
        .filter((bug) => bug.status === "To Do")
        .map((bug) => <Bug key={bug["bugId"]} bug={bug} />)

    const inProgressList = bugs
        .filter((bug) => bug.status === "In Progress")
        .map((bug) => <Bug key={bug["bugId"]} bug={bug} />)

    const qaList = bugs
        .filter((bug) => bug.status === "QA")
        .map((bug) => <Bug key={bug["bugId"]} bug={bug} />)

    const completeList = bugs
        .filter((bug) => bug.status === "Complete")
        .map((bug) => <Bug key={bug["bugId"]} bug={bug} />)

    return (
        <div>
            {
                !user || expired ?
                    <Navigate to="/user" state={{ newUser: false, expired: true }} />
                    :
                    <div className="container my-4 bugList">
                        <div className="d-flex justify-content-between align-items-baseline">
                            <h1 className="text-capitalize">{username} Bug List</h1>
                            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#exampleModal"><FontAwesomeIcon icon={faPlus} size="2x" /></button>
                        </div>
                        <AddBug refresh={refresh} setRefresh={setRefresh} />
                        <br />
                        <div className="d-grid gap-5">
                            <div className="row row-col-auto pt-1 justify-content-center" style={{ minHeight: "20vh" }}>
                                {(toDoList.length > 0) &&
                                    <ul className="list-group col-sm-4">
                                        <h4 className="align-self-center mt-2 mb-3">To Do</h4>
                                        {toDoList}
                                    </ul>
                                }
                                {(inProgressList.length > 0) &&
                                    <ul className="list-group col-sm-4">
                                        <h4 className="align-self-center mt-2 mb-3">In Progress</h4>
                                        {inProgressList}
                                    </ul>
                                }
                                {(qaList.length > 0) &&
                                    <ul className="list-group col-sm-4">
                                        <h4 className="align-self-center mt-2 mb-3">Waiting On QA</h4>
                                        {qaList}
                                    </ul>
                                }
                            </div>
                            {(unassignedList.length > 0) &&
                                <div className="row row-cols border-top pt-1">
                                    <ul className="list-group col">
                                        <h4 className="align-self-center mt-2 mb-3">Unassgined</h4>
                                        <div className="row row-cols-1 row-cols-sm-3">
                                            {unassignedList}
                                        </div>
                                    </ul>
                                </div>
                            }
                            {(completeList.length > 0) &&
                                <div className="row row-cols border-top pt-1">
                                    <ul className="list-group col">
                                        <h4 className="align-self-center mt-2 mb-3">Completed</h4>
                                        <div className="row row-cols-1 row-cols-sm-3">
                                            {completeList}
                                        </div>
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
            }
        </div>
    )
}

export default BugList;