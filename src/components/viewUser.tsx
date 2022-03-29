import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Company as CompanySchema } from "../interfaces";
import { useNavigate } from "react-router";
import { UserContext } from "./userContext";
import { apiCompanyBase } from "./api/companyAPI";
import { apiUserBase, authUser } from "./api/userApi";

const ViewUser: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [company, setCompany] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [companyList, setCompanyList] = useState<Array<CompanySchema>>([]);
    const [id, setId] = useState<string>('');
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    //call to the db for users and company info
    useEffect(() => {
        //get User Data
        axios.post(authUser, { "token": user }, { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => {
                console.log(res.data.data);
                setUsername(res.data.data.username);
                setPassword(res.data.data.password);
                setEmail(res.data.data.email);
                setCompany(res.data.data.company);
                setId(res.data.data._id);
            })
            .catch((err) => {
                console.log(err);
                setUser('');
            });
        //get all Company
        axios.get(apiCompanyBase, { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => {
                console.log(res.data);
                setCompanyList(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [user, setUser])

    const saveUser = (e: React.FormEvent) => {
        e.preventDefault();
        //if company is new, create a new one
        if (!companyList.map((com: CompanySchema) => com.companyName).includes(company)) {
            const newCompany = {
                companyName: company,
                owner: id,
            }

            axios.post(apiCompanyBase, newCompany, { headers: { Authorization: `Bearer ${user}` } })
                .then((res) => {
                    console.log("New company created ", res.data);
                })
                .catch((err) => {
                    console.error(err);
                })
        } 

        const thisUser = { id, username, email, password, company };
        axios.put(apiUserBase, thisUser, { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="container mt-4">
            <form className="col-sm-5 mx-auto" onSubmit={saveUser}>
                <h1>User Profile</h1>
                <div className="mb-3">
                    <label htmlFor="username">Username: </label>
                    <input type="text" value={username} name="username"
                        className="form-control"
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email">Email: </label>
                    <input type="text" value={email} name="email"
                        className="form-control"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="company">Company: </label>
                    <input type="text" value={company} name="company"
                        className="form-control" placeholder="Enter Your Company"
                        onChange={e => setCompany(e.target.value)}
                    />
                </div>
                <button type="button" className="btn btn-secondary me-1" onClick={() => navigate("/bug")}>Back</button>
                <input className="btn btn-primary me-1" type="submit" value="Save" />
            </form>
        </div>
    )
}

export default ViewUser;