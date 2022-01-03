import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Company as CompanySchema } from "../interfaces";
import { useNavigate } from "react-router";
import { UserContext } from "./userContext";

const ViewUser: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [company, setCompany] = useState<string>('');
    const [companyList, setCompanyList] = useState<Array<CompanySchema>>([]);
    const [id, setId] = useState<string>('');
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    //call to the db for users and company info
    useEffect(() => {
        axios.get('https://bug-tracker-project1.herokuapp.com/api/private', { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => {
                console.log(res.data.data);
                setUsername(res.data.data.username);
                setEmail(res.data.data.email);
                setCompany(res.data.data.company);
                setId(res.data.data._id);
            })
            .catch((err) => {
                console.log(err);
                setUser('');
            });
        axios.get('https://bug-tracker-project1.herokuapp.com/company/')
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
        //if company is new, create a new one, else check if users in members for that Company
        if (!companyList.map((com: CompanySchema) => com.companyName).includes(company)) {
            const newCompany = {
                companyName: company,
                owner: username,
                members: [username],
            }

            axios.post('https://bug-tracker-project1.herokuapp.com/company/add', newCompany)
                .then((res) => {
                    console.log("New company created ", res.data);
                })
                .catch((err) => {
                    console.error(err);
                })
        } else {
            let thatCompany = companyList.filter((com) => com.companyName === company);
            console.log(thatCompany);
            if (!thatCompany[0].members.includes(username)) {
                axios.post('https://bug-tracker-project1.herokuapp.com/company/join/' + thatCompany[0].id, username)
                    .then((res) => {
                        console.log("New company created ", res.data);
                    })
                    .catch((err) => {
                        console.error(err);
                    })
            }
        }

        const thisUser = { username, email, company };
        axios.post('https://bug-tracker-project1.herokuapp.com/api/auth/update/' + id, thisUser)
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