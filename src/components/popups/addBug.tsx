import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { User, SetRefresh, Employees } from '../../interfaces'
import { UserContext } from "../userContext";
import { apiBugBase } from "../../api/bugApi";
import { authUser, getAllUserByCompany } from "../../api/userApi";

const AddBug: React.FC<SetRefresh> = ({ refresh, setRefresh }) => {
    const [bugName, setBugName] = useState<string>('');
    const [userId, setUserId] = useState<number>();
    const [type, setType] = useState<string>('Bug');
    const [description, setDescription] = useState<string>('');
    const [assigneeId, setAssigneeId] = useState<number>();
    const [priority, setPriority] = useState<string>('Low');
    const [users, setUsers] = useState<Array<Employees>>([{"userId": 0, "username": "-"}]);
    const { user } = useContext(UserContext);

    //creates new bug and closes the popup
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const status = (assigneeId !== 0) ? "To Do" : "Unassigned"; 
        const bug = {
            bugName,
            type,
            description,
            status: status,
            priority,
            reporterId: userId,
            assigneeId,
        }
        console.log(bug);
        axios.post(apiBugBase, bug, { headers: { Authorization: `Bearer ${user}` } })
            .then((res: any) => console.log(res.data))
            .catch((err) => console.error(err));

        setRefresh(!refresh);
    }

    useEffect(() => {
        //get all users by token
        axios.get(getAllUserByCompany + user, { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => {
                const employees: Array<Employees> = res.data.map((user: User) => ({ "userId": user.userId, "username": user.username }));
                setUsers([{"userId": 0, "username": "-"}, ...employees]);
            })
            .catch((error) => { console.log("Could Not Get Company" + error) })
        //get user info
        axios.post(authUser + user, {"token": user}, { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => { setUserId(res.data.userId) })
            .catch((error) => { console.log("Could Not Get User" + error) })
    }, [user])

    return (
        <div className="modal" tabIndex={-1} id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create A New Bug</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <form className="col-sm-12 mx-auto">
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
                                    <label>Priority: </label>
                                    <select className="form-control"
                                        onChange={e => setPriority(e.target.value)}
                                    >
                                        <option value={"Low"}>Low</option>
                                        <option value={"Med"}>Med</option>
                                        <option value={"High"}>High</option>
                                    </select>
                                </div>

                                <div className='mb-3'>
                                    <label>Assginee: (Optional)</label>
                                    <select className="form-control"
                                        onChange={e => setAssigneeId(Number(e.target.value))}
                                    >
                                        {users.map((user) => <option key={user.userId} value={user.userId}>{user.username}</option>)}
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddBug;