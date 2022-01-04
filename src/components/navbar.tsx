import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Checker from "./popups/checker";
import { useNavigate } from 'react-router';
import { UserContext } from "./userContext";

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const clearUser = () => {
        sessionStorage.removeItem("token");
        setUser(null);
        navigate("/");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link to={user ? "/bug" : "/"} className="navbar-brand">Bug Tracker</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${user ? "justify-content-between" : "justify-content-end"}`} id="navbarNav">
                    {
                        user &&
                        <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/bug">Bugs</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Profile</Link>
                            </li>
                        </ul>
                    }
                    {
                        user ?
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
                <Checker message="Are You Sure You Want To Log Out?" doThis={clearUser} idTag="signOutBox" />
            </div>
        </nav>
    )
}

export default NavBar;