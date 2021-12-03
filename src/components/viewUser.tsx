import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewUser: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [company, setCompany] = useState<string>('');
    const [companyList, setCompanyList] = useState<Array<string>>([]);
    const [id, setId] = useState<string>('');

    //call to the db for users and bug info
    useEffect(() => {
        axios.get('https://bug-tracker-project1.herokuapp.com/api/private', { headers: { Authorization: `Bearer ${sessionStorage.token}` } })
            .then((res) => {
                setUsername(res.data.data.username);
                setEmail(res.data.data.email);
                setCompany(res.data.data.company);
                setId(res.data.data._id);
            })
            .catch((err) => {
                console.log(err);
            });
        axios.get('https://bug-tracker-project1.herokuapp.com/company/')
            .then((res) => {
                setCompanyList([...res.data.member]);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [])

    const saveUser = () => {
        if (!companyList.includes(company)) {
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
        }

        axios.post('https://bug-tracker-project1.herokuapp.com/api/auth/update/' + id)
            .then((res) => {
                setUsername(res.data.data.username);
                setEmail(res.data.data.email);
                setCompany(res.data.data.company);
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
                    <label htmlFor="bugName">Username: </label>
                    <input type="text" value={username} name="username"
                        className="form-control"
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="bugName">Email: </label>
                    <input type="text" value={email} name="email"
                        className="form-control"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="bugName">Company: </label>
                    <input type="text" value={company} name="company"
                        className="form-control" placeholder="Enter Your Company"
                        onChange={e => setCompany(e.target.value)}
                    />
                </div>
                <button type="button" className="btn btn-secondary me-1" onClick={() => window.location.href = "/bug"}>Back</button>
                <input className="btn btn-primary me-1" type="submit" value="Save" />
            </form>
        </div>
    )
}

export default ViewUser;