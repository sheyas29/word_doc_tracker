import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Paper, Box, TableBody } from '@mui/material';
import './TableSelection.css';

const TableSelection = () => {
    const [data, setData] = useState([]);
    const [boldRows, setBoldRows] = useState([]);
    const [checkboxRows, setCheckboxRows] = useState([]);
    const [initialBoldRows, setInitialBoldRows] = useState([]);
    const [initialCheckboxRows, setInitialCheckboxRows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/activities');
                const fetchedData = response.data;

                const boldRowsFromData = fetchedData.filter(row => row.is_bold).map(row => row.id);
                const checkboxRowsFromData = fetchedData.filter(row => row['si.no'].includes('.') || row.confirmed_by).map(row => row.id);

                setData(fetchedData);
                setBoldRows(boldRowsFromData);
                setCheckboxRows(checkboxRowsFromData);
                setInitialBoldRows(boldRowsFromData);
                setInitialCheckboxRows(checkboxRowsFromData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleBoldToggle = (id) => {
        setBoldRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleCheckboxToggle = (id) => {
        setCheckboxRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleCheckAll = () => {
        setCheckboxRows(data.map(row => row.id));
    };

    const handleReset = () => {
        setBoldRows(initialBoldRows);
        setCheckboxRows(initialCheckboxRows);
    };

    const handleSubmit = () => {
        localStorage.setItem('boldRows', JSON.stringify(boldRows));
        localStorage.setItem('checkboxRows', JSON.stringify(checkboxRows));
        navigate('/formatted', { state: { data, boldRows, checkboxRows } });
    };

    return (
        <Box sx={{ padding: 2, backgroundColor: '#EDF2F4', minHeight: '100vh' }}>
            <TableContainer component={Paper} sx={{ height: 600, width: '100%', marginBottom: 2 }}>
                <Table stickyHeader sx={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow className="table-header-row">
                            <TableCell className="table-header-cell">Hrs</TableCell>
                            <TableCell className="table-header-cell">Min</TableCell>
                            <TableCell className="table-header-cell">Sec</TableCell>
                            <TableCell className="table-header-cell">Si. No</TableCell>
                            <TableCell className="table-header-cell">Activity Name</TableCell>
                            <TableCell className="table-header-cell">Confirmed By</TableCell>
                            <TableCell className="table-header-cell">Bold</TableCell>
                            <TableCell className="table-header-cell">Checkbox</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id} className={boldRows.includes(row.id) ? 'bold-row' : ''}>
                                <TableCell className="table-cell">{row.hrs}</TableCell>
                                <TableCell className="table-cell">{row.mins}</TableCell>
                                <TableCell className="table-cell">{row.sec}</TableCell>
                                <TableCell className="table-cell">{row['si.no']}</TableCell>
                                <TableCell className="table-cell">{row.activity_name}</TableCell>
                                <TableCell className="table-cell">{row.confirmed_by}</TableCell>
                                <TableCell className="table-cell">
                                    <Checkbox 
                                        checked={boldRows.includes(row.id)} 
                                        onChange={() => handleBoldToggle(row.id)} 
                                    />
                                </TableCell>
                                <TableCell className="table-cell">
                                    <Checkbox 
                                        checked={checkboxRows.includes(row.id)} 
                                        onChange={() => handleCheckboxToggle(row.id)} 
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleCheckAll} sx={{ backgroundColor: '#8D99AE', color: '#EDF2F4' }}>
                    Check All
                </Button>
                <Button variant="contained" color="secondary" onClick={handleReset} sx={{ backgroundColor: '#D80032', color: '#EDF2F4' }}>
                    Reset
                </Button>
                <Button variant="contained" color="success" onClick={handleSubmit} sx={{ backgroundColor: '#2B2D42', color: '#EDF2F4' }}>
                    Proceed
                </Button>
            </Box>
        </Box>
    );
};

export default TableSelection;
