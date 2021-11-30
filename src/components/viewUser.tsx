import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewUser: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [company, setCompany] = useState<Array<string>>(['']);

    //call to the db for users and bug info
    useEffect(() => {
        axios.get('https://bug-tracker-project1.herokuapp.com/api/private', { headers: { Authorization: `Bearer ${sessionStorage.token}` } })
            .then((res) => {
                setUsername(res.data.data.username);
                setEmail(res.data.data.email);
                setCompany(res.data.data.company ? [...res.data.data.company] : ['']);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [])

    return (
        <div className="container mt-4">
            <h1>{username}</h1>
            <h3>{email}</h3>
            {company && <h3>{company}</h3>}
        </div>
    )
}

export default ViewUser;