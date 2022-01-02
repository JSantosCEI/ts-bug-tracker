import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router";
import Bug from "./bug";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddBug from "./popups/addBug";
import { UserContext } from "./userContext";

library.add(faPlus);

const BugList: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [bugs, setBugs] = useState<Array<any>>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [expired, setExpired] = useState<boolean>(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        axios.get('https://bug-tracker-project1.herokuapp.com/api/private', { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => {
                setUsername(res.data.data.username);
                axios.get(`https://bug-tracker-project1.herokuapp.com/bugs/user/${res.data.data.username}`)
                    .then(res => {
                        setBugs([...res.data]);
                    })
                    .catch((err) => console.error(err));
            })
            .catch((err) => {
                let message: string = err.message;
                let code: number = parseInt(message.slice(-3));
                console.log(code);
                code === 400 ? setExpired(true) : console.error(err);
            });
    }, [refresh, user])

    const unassignedList = bugs
        .filter((bug) => bug.status === "Unassigned")
        .map((bug) => <Bug key={bug["_id"]} bug={bug} />)

    const toDoList = bugs
        .filter((bug) => bug.status === "To Do")
        .map((bug) => <Bug key={bug["_id"]} bug={bug} />)

    const inProgressList = bugs
        .filter((bug) => bug.status === "In Progress")
        .map((bug) => <Bug key={bug["_id"]} bug={bug} />)

    const qaList = bugs
        .filter((bug) => bug.status === "QA")
        .map((bug) => <Bug key={bug["_id"]} bug={bug} />)

    const completeList = bugs
        .filter((bug) => bug.status === "Complete")
        .map((bug) => <Bug key={bug["_id"]} bug={bug} />)

    return (
        <div>
            {
                !user || expired ?
                    <Navigate to="/user" state={{ newUser: false, expired: true }} />
                    :
                    <div className="container mt-4">
                        <div className="d-flex justify-content-between">
                            <h1 className="text-capitalize">{username} Bug List</h1>
                            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#exampleModal"><FontAwesomeIcon icon={faPlus} size="2x" /></button>
                        </div>
                        <AddBug refresh={refresh} setRefresh={setRefresh} />
                        <br />
                        <div className="d-grid gap-5">
                            <div className="row pt-1" style={{ minHeight: "35vh" }}>
                                <ul className="list-group col-sm-4">
                                    <h4 className="align-self-center">To Do</h4>
                                    {toDoList}
                                </ul>
                                <ul className="list-group col-sm-4">
                                    <h4 className="align-self-center">In Progress</h4>
                                    {inProgressList}
                                </ul>
                                <ul className="list-group col-sm-4">
                                    <h4 className="align-self-center">Waiting On QA</h4>
                                    {qaList}
                                </ul>
                            </div>
                            <div className="row row-cols border-top pt-1">
                                <ul className="list-group col ">
                                    <h4 className="align-self-center">Unassgined</h4>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            {unassignedList}
                                        </div>
                                    </div>
                                </ul>
                            </div>
                            <div className="row row-cols border-top pt-1">
                                <ul className="list-group col">
                                    <h4 className="align-self-center">Completed</h4>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            {completeList}
                                        </div>
                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default BugList;