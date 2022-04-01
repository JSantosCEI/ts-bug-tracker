import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { Employees, User as UserSchema } from '../interfaces';
import { apiBugBase, apiBugWithId } from "./api/bugApi";
import { getAllUserByCompany } from "./api/userApi";
import Checker from "./popups/checker";
import { UserContext } from "./userContext";

const ViewBug: React.FC = () => {
    const [bugName, setBugName] = useState<string>('');
    const [reporterId, setReporterId] = useState<string>('');
    const [type, setType] = useState<string>('Bug');
    const [description, setDescription] = useState<string>('');
    const [assgineeId, setAssgineeId] = useState<number>();
    const [status, setStatus] = useState<string>('');
    const [priority, setPriority] = useState<string>('Low');
    const [users, setUsers] = useState<Array<Employees>>([{"userId": 0, "username": "-"}]);
    const [viewMode, setMode] = useState<boolean>(true);
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    let { id } = useParams();

    //call to the db for users and bug info
    useEffect(() => {
        axios.get(apiBugWithId + id, { headers: { Authorization: `Bearer ${user}` } })
            .then((result) => {
                console.log(result.data);
                setBugName(result.data.bugName);
                setType(result.data.type);
                setDescription(result.data.description);
                setPriority(result.data.priority);
                setStatus(result.data.status);
                setReporterId(result.data.reporterId);
                setAssgineeId(result.data.assigneeId);
            })
            .catch((err) => {
                console.log(err);
                setUser('');
            });

        axios.get(getAllUserByCompany + user, { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => {
                const employees: Array<Employees> = res.data.map((user: UserSchema) => ({ "userId": user.userId, "username": user.username }));
                setUsers([{"userId": 0, "username": "-"}, ...employees]);
            })
            .catch((error) => { console.log("Could Not Get Company" + error) })
    }, [id, user, setUser])

    useEffect(() => {
        //there's a assginee, so it can't be unassigned 
        if (assgineeId !== 0  && status === "Unassigned") {
            console.log("terms met, change status");
            setStatus("To Do");
        }

        //there's no assginee, so its unassigned 
        if (assgineeId === 0 && status !== "Unassigned") {
            setStatus("Unassigned");
        }

    }, [assgineeId, status])

    const saveBug = (e: React.FormEvent) => {
        e.preventDefault();
        const bug = {
            bugId: id,
            bugName,
            type,
            description,
            status,
            priority,
            reporterId,
            assgineeId
        }
        console.log(bug);
        axios.put(apiBugBase, bug, { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => console.log(res.data))
            .catch((err) => { console.log(err); });

        setMode(true);
    }

    const deleteBug = () => {
        console.log("Deleting");
        axios.delete(apiBugWithId + id, { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => console.log(res.data));

        window.location.href = "/bug";
    }

    return (
        <div>
            {
                viewMode ?
                    <div className="mx-auto col-sm-7 ps-3 pe-1 overflow-hidden mt-4">
                        <div className="row gy-2">
                            <h1> {bugName} </h1>
                            <div className="row row-cols-auto fs-4">
                                <div className="col">Type: {type}</div>
                                <div className="col">Priority: {priority}</div>
                            </div>
                            <div>
                                <p className="fs-5">Description: <br /> {description} </p>
                                <button type="button" className="btn btn-secondary me-1" onClick={() => navigate('/bug')}>Back</button>
                                <button type="button" className="btn btn-primary" onClick={() => setMode(false)}>Edit</button>
                            </div>
                        </div>
                    </div> :
                    <div className="mx-auto col-sm-5 mt-4">
                        <h1>Editing: {bugName} </h1>
                        <form className="container" onSubmit={saveBug}>
                            <div className="mb-3">
                                <label htmlFor="bugName">Bug Name: </label>
                                <input type="text" value={bugName} name="bugName"
                                    className="form-control" placeholder="Enter Bug Name"
                                    onChange={e => setBugName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Type: </label>
                                <select className="form-control"
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                >
                                    <option value={"Bug"}>Bug</option>
                                    <option value={"Task"}>Task</option>
                                    <option value={"Feature"}>Feature</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description">Description: </label>
                                <textarea value={description} name="description"
                                    className="form-control" placeholder="Enter Description"
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Status: </label>
                                <select className="form-control"
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                >
                                    <option value={"Unassigned"}>Unassigned</option>
                                    <option value={"To Do"}>To Do</option>
                                    <option value={"In Progress"}>In Progress</option>
                                    <option value={"QA"}>QA</option>
                                    <option value={"Complete"}>Complete</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label>Priority: </label>
                                <select className="form-control"
                                    value={priority}
                                    onChange={e => setPriority(e.target.value)}
                                >
                                    <option value={"Low"}>Low</option>
                                    <option value={"Med"}>Med</option>
                                    <option value={"High"}>High</option>
                                </select>
                            </div>

                            <div className='mb-3'>
                                <label>Assginee: </label>
                                <select className="form-control"
                                    value={assgineeId}
                                    onChange={e => setAssgineeId(Number(e.target.value))}
                                >
                                    {users.map((user) => <option key={user.userId} value={user.userId}>{user.username}</option>)}
                                </select>
                            </div>
                            <input className="btn btn-primary me-1" type="submit" value="Save" />
                            <button type="button" className="btn btn-secondary me-1" onClick={() => setMode(true)}>Cancel</button>
                            <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteBox">Delete</button>
                        </form>
                        <Checker message={"Are You Sure You Want To Delete This " + type + "?"} doThis={deleteBug} idTag="deleteBox" />
                    </div>
            }
        </div>
    )
}

export default ViewBug;