import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { UserContext } from "./components/userContext";

import NavBar from './components/navbar';
import Home from './components/home';
import CreateUser from './components/createUser';
import BugList from './components/bugList';
import ViewBug from './components/viewBug';
import CreateBug from './components/createBug';
import ViewUser from "./components/viewUser";

const App: React.FC = () => {
    const stored: String | null = sessionStorage.token ? sessionStorage.token : null;
    const [user, setUser] = useState<String | null>(stored);
    const value = useMemo(() => ({ user, setUser }), [user, setUser]);

    return (
        <div>
            <Router>
                <UserContext.Provider value={value}>
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/user" element={<CreateUser />} />
                        <Route path="/bug" element={<BugList />} />
                        <Route path="/view/:id" element={<ViewBug />} />
                        <Route path="/create" element={<CreateBug />} />
                        <Route path="/profile" element={<ViewUser />} />
                    </Routes>
                </UserContext.Provider>
            </Router>
        </div>
    );
};

export default App;