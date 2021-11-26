import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
    const [isToken, setIsToken] = useState(sessionStorage.token !== undefined);

    const removeToken = () => {
        sessionStorage.removeItem("token");
        setIsToken(false);
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
                            <Link to="/" className="d-flex" onClick={removeToken}>
                                <button type="button" className="btn btn-primary">
                                    Logout
                                </button>
                            </Link> :
                            <Link to="/user" className="d-flex">
                                <button type="button" className="btn btn-primary">
                                    Login/Register
                                </button>
                            </Link>
                    }
                </div>
            </div>
        </nav>
    )
}

export default NavBar;