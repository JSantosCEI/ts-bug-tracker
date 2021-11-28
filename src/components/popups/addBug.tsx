import axios from "axios";
import React, { useState, useEffect } from "react";
import { User } from '../../interfaces'

const AddBug: React.FC = () => {
    const [bugName, setBugName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [type, setType] = useState<string>('Bug');
    const [description, setDescription] = useState<string>('');
    const [assginee, setAssginee] = useState<string>('');
    const [priority, setPriority] = useState<string>('Low');
    const [users, setUsers] = useState<Array<string>>(["-"]);

    //creates new bug and closes the popup
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const bug = {
            bugName,
            reporter: username,
            type,
            description,
            priority,
            assginee,
        }
        console.log(bug);
        axios.post('https://bug-tracker-project1.herokuapp.com/bugs/add', bug)
            .then((res: any) => console.log(res.data))
            .catch((err) => console.log("no user", err));
    }

    useEffect(() => {
        //get all users
        axios.get('https://bug-tracker-project1.herokuapp.com/api/auth')
            .then((res) => {
                const names: Array<string> = res.data.map((user: User) => user.username);
                setUsers(["-", ...names]);
            })
        //get user info
        axios.get('https://bug-tracker-project1.herokuapp.com/api/private', { headers: { Authorization: `Bearer ${sessionStorage.token}` } })
            .then((res) => {
                setUsername(res.data.data.username);
            })
    }, [])

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
                            <form className="col-sm-5 mx-auto">
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
                                        onChange={e => setAssginee(e.target.value)}
                                    >
                                        {users.map((user, index) => <option key={index}>{user}</option>)}
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={onSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddBug;