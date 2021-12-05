import React, { useState } from "react";
import { Link } from "react-router-dom";
import Checker from "./popups/checker";
import { useNavigate } from 'react-router';

const NavBar: React.FC = () => {
    const [isToken, setIsToken] = useState(sessionStorage.token !== undefined);
    const navigate = useNavigate();

    const removeToken = () => {
        sessionStorage.removeItem("token");
        setIsToken(false);
        navigate("/");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link to={isToken ? "/bug" : "/"} className="navbar-brand">Bug Tracker</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isToken ? "justify-content-between" : "justify-content-end"}`} id="navbarNav">
                    {
                        isToken &&
                        <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/bug">Bugs</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/create">Create Bug</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Profile</Link>
                            </li>
                        </ul>
                    }
                    {
                        isToken ?
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signOutBox">
                                Logout
                            </button> :
                            <Link to="/user" className="d-flex">
                                <button type="button" className="btn btn-primary">
                                    Login/Register
                                </button>
                            </Link>
                    }
                </div>
                <Checker message="Are You Sure You Want To Log Out?" doThis={removeToken} idTag="signOutBox" />
            </div>
        </nav>
    )
}

export default NavBar;