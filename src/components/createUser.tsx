import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { User as UserSchema } from "../interfaces";
import { UserContext } from "./userContext";

library.add(faExclamationCircle);

// if newUser prop is true this form will register a user, else for login 
const CreateUser: React.FC = () => {
    const { setUser } = useContext(UserContext);
    const { state } = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [company, setCompany] = useState('');
    const [isNew, setNew] = useState<boolean>(false);
    const [expired, setExpired] = useState(false);
    const [logging, setLogging] = useState<boolean>(false);

    useEffect(() => {
        if (state !== null) {
            setNew(state.newUser);
            setExpired(state.expired);
        }
    }, [state])

    const authentication = (e: React.FormEvent) => {
        e.preventDefault();
        setLogging(true);
        const thisUser: UserSchema = {
            email,
            password,
        }
        console.log(thisUser);

        if (isNew) {
            //create new user
            thisUser.username = username;
            thisUser.company = company ? company : "";
            axios.post('https://bug-tracker-project1.herokuapp.com/api/auth/register', thisUser)
                .then((res) => {
                    console.log(res.data);
                    sessionStorage.setItem('token', res.data.token);
                    setUser(res.data.token);
                    navigate('/bug');
                })
                .catch((err) => console.log(err))
        } else {
            //login
            axios.post('https://bug-tracker-project1.herokuapp.com/api/auth/login', thisUser)
                .then((res) => {
                    console.log(res.data);
                    sessionStorage.setItem('token', res.data.token);
                    setUser(res.data.token);
                    navigate('/bug');
                })
                .catch((err) => console.log(err))
        }
        setLogging(false);
    }

    return (
        <div className="container mt-4">
            <div className="col-sm-5 mx-auto">
                {isNew ? <h2>Create New Account</h2> : <h2>Log In</h2>}
                <div className="container-fluid">
                    <form onSubmit={authentication}>
                        {
                            isNew &&
                            <div>
                                <div className="mb-3">
                                    <label htmlFor="username">Username: </label>
                                    <input type="text" value={username} name="username"
                                        className="form-control" placeholder="Enter Username"
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="compnay">Company: </label>
                                    <input type="text" value={company} name="company"
                                        className="form-control" placeholder="Enter Company Name (Optional)"
                                        onChange={e => setCompany(e.target.value)}
                                    />
                                </div>
                            </div>
                        }

                        <div className="mb-3">
                            <label htmlFor="email">Email: </label>
                            <input type="email" value={email} name="email"
                                className="form-control" placeholder="Enter Email"
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password">Password: </label>
                            <input type="password" value={password} name="password"
                                className="form-control" placeholder="Enter Password"
                                minLength={5} required
                                onChange={e => setPassword(e.target.value)}
                            />
                            {
                                isNew &&
                                <span id="passwordHelpInline" className="form-text">
                                    Must at least 5 characters long
                                </span>
                                /* :
                                <button type="button" className="btn btn-sm btn-link text-decoration-none">
                                    Forgot Password?
                                </button> 
                                */
                            }
                        </div>
                        {
                            (expired) &&
                            <div>
                                <p className="text-danger"><FontAwesomeIcon icon={faExclamationCircle} /> Session Expired. Please Sign In Again</p>
                            </div>
                        }
                        <div className="d-flex justify-content-between">
                            {
                                logging ?
                                    <div className="spinner-grow text-success" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div> :
                                    <input className="btn btn-primary" type="submit" />
                            }
                            <button type="button" className="btn btn-link text-decoration-none" onClick={() => setNew(!isNew)}>
                                {isNew ? "Have An Account?" : "Create New?"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateUser;