import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

import { Company as CompanySchema, User as UserSchema } from "../../interfaces";
import { UserContext } from "../../components/userContext";
import { apiUserBase, login } from "../../api/userApi";
import { apiCompanyBase } from "../../api/companyAPI";
import Spinner from "../../components/utilities/spinner";
import ErrorText from "../../components/utilities/errorText";
import CompanySelect from "../../components/companySelect";

// if newUser prop is true this form will register a user, else for login 
const CreateUser: React.FC = () => {
    const { setUser } = useContext(UserContext);
    const { state } = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [company, setCompany] = useState<number>(0);
    const [employers, setEmployers] = useState<CompanySchema[]>([{"companyId" : 0, "companyName": ""}]);
    const [isNew, setNew] = useState<boolean>(false);
    const [expired, setExpired] = useState(false);
    const [logging, setLogging] = useState<boolean>(false);
    const [failedLogIn, setFailedLogIn] = useState<boolean>(false);


    useEffect(() => {
        //get all companys
        axios.get(apiCompanyBase)
            .then((res) => {
                var employersList = res.data.map((com: CompanySchema) => ({"companyId" : com.companyId, "companyName": com.companyName}));
                setEmployers([{"companyId" : 0, "companyName": ""}, ...employersList]);
            })
            .catch(err => console.error(err));
    }, [])

    useEffect(() => {
        if (state !== null) {
            setNew(state.newUser);
            setExpired(state.expired);
        }
    }, [state])

    const authentication = async (e: React.FormEvent) => {
        e.preventDefault();
        setLogging(true);
        const thisUser: UserSchema = {
            username,
            password,
        }
        console.log(thisUser);

        if (isNew) {
            //create new user
            thisUser.email = email;
            thisUser.company = company;
            console.log(thisUser);
            await axios.post(apiUserBase, thisUser)
                .then((res) => {
                    //console.log(res.data);
                    sessionStorage.setItem('token', res.data);
                    setUser(res.data);
                    navigate('/bug');
                })
                .catch((err) => {
                    console.log(err);
                    setFailedLogIn(true);
                })
        } else {
            //login
            await axios.post(login, thisUser)
                .then((res) => {
                    //console.log(res.data);
                    sessionStorage.setItem('token', res.data);
                    setUser(res.data);
                    navigate('/bug');
                })
                .catch((err) => {
                    console.log(err);
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
                                <div className="mb-3">
                                    <label htmlFor="username">Username: </label>
                                    <input type="text" value={username} name="username"
                                        className="form-control" placeholder="Enter Username"
                                        onChange={e => setUsername(e.target.value)} required
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
                                    isNew &&
                                    <div>
                                        <div className="mb-3">
                                            <label htmlFor="email">Email: </label>
                                            <input type="email" value={email} name="email"
                                                className="form-control" placeholder="Enter Email"
                                                onChange={e => setEmail(e.target.value)} required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <CompanySelect companyList={employers} setCompany={setCompany}/>
                                        </div>
                                    </div>
                                }
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