// src/Routes.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Slink from "./Slink";

const AppRoutes: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Slink/>} />
            <Route path="/Slink" element={<Slink />} />\
        </Routes>
    </Router>
);

export default AppRoutes;
