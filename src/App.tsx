import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';

import NavBar from './components/navbar';
import Home from './components/home';
import CreateUser from './components/createUser';
import BugList from './components/bugList';
import ViewBug from './components/viewBug';
import CreateBug from './components/createBug';

const App: React.FC<{}> = () => {
    return (
        <div>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/user" element={<CreateUser />} />
                    <Route path="/bug" element={<BugList />} />
                    <Route path="/view/:id" element={<ViewBug />} />
                    <Route path="/create" element={<CreateBug />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;