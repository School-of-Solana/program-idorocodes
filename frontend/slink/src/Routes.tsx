// src/Routes.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Slink from "./Slink";

const AppRoutes: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/slink" element={<Slink />} />\
        </Routes>
    </Router>
);

export default AppRoutes;
