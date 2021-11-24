import React, { FunctionComponent } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';

import NavBar from './components/navbar';
import Home from './components/home';

const App: FunctionComponent<{}> = () => {
    return (
        <div>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;