import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TableSelection from './TableSelection';
import FormattedTable from './FormattedTable';
import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TableSelection />} />
                <Route path="/formatted" element={<FormattedTable />} />
            </Routes>
        </Router>
    );
};

export default App;
