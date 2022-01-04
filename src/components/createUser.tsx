import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { User as UserSchema } from "../interfaces";
import { UserContext } from "./userContext";
import Spinner from "./utilities/spinner";
import ErrorText from "./utilities/errorText";

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
    const [failedLogIn, setFailedLogIn] = useState<boolean>(false);

    useEffect(() => {
        if (state !== null) {
            setNew(state.newUser);
            setExpired(state.expired);
        }
    }, [state])

    const authentication = async (e: React.FormEvent) => {
        e.preventDefault();
        setLogging(true);
        console.log(logging);
        const thisUser: UserSchema = {
            email,
            password,
        }
        console.log(thisUser);

        if (isNew) {
            //create new user
            thisUser.username = username;
            thisUser.company = company ? company : "";
            await axios.post('https://bug-tracker-project1.herokuapp.com/api/auth/register', thisUser)
                .then((res) => {
                    console.log(res.data);
                    sessionStorage.setItem('token', res.data.token);
                    setUser(res.data.token);
                    navigate('/bug');
                })
                .catch((err) => {
                    console.log(err);
                    setFailedLogIn(true);
                })
        } else {
            //login
            await axios.post('https://bug-tracker-project1.herokuapp.com/api/auth/login', thisUser)
                .then((res) => {
                    console.log(res.data);
                    sessionStorage.setItem('token', res.data.token);
                    setUser(res.data.token);
                    navigate('/bug');
                })
                .catch((err) => {
                    console.log(err, "hello");
                    setFailedLogIn(true);
                })
        }
        console.log(logging);
        setLogging(false);
    }

    return (
        <div className="container mt-4">
            {
                logging ?
                    <Spinner /> :
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
                                                onChange={e => setUsername(e.target.value)} required
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
                                        onChange={e => setEmail(e.target.value)} required
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
                                {expired && <ErrorText message="Session Expired. Please Sign In Again" />}
                                {failedLogIn && <ErrorText message="Incorrect Email or Password. Try Again" />}

                                <div className="d-flex justify-content-between">
                                    <input className="btn btn-primary" type="submit" />

                                    <button type="button" className="btn btn-link text-decoration-none" onClick={() => setNew(!isNew)}>
                                        {isNew ? "Have An Account?" : "Create New?"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
            }
        </div>
    )
}

export default CreateUser;