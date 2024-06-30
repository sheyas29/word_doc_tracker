import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, TableHead, TableRow, TableCell, Checkbox, Button, Paper, Select, MenuItem, FormControl, InputLabel, Box, Typography, TableContainer, TableBody } from '@mui/material';
import './FormattedTable.css';

const FormattedTable = () => {
    const location = useLocation();
    const { data: initialData, boldRows: initialBoldRows, checkboxRows: initialCheckboxRows } = location.state || { data: [], boldRows: [], checkboxRows: [] };

    const [data, setData] = useState(initialData);
    const [boldRows, setBoldRows] = useState(initialBoldRows);
    const [checkboxRows, setCheckboxRows] = useState(initialCheckboxRows);
    const [checkedRows, setCheckedRows] = useState([]);
    const [filter, setFilter] = useState('all');
    const [confirmReset, setConfirmReset] = useState(0);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('data')) || initialData;
        const storedBoldRows = JSON.parse(localStorage.getItem('boldRows')) || initialBoldRows;
        const storedCheckboxRows = JSON.parse(localStorage.getItem('checkboxRows')) || initialCheckboxRows;
        const storedCheckedRows = JSON.parse(localStorage.getItem('checkedRows')) || [];

        setData(storedData);
        setBoldRows(storedBoldRows);
        setCheckboxRows(storedCheckboxRows);
        setCheckedRows(storedCheckedRows);
    }, [initialData, initialBoldRows, initialCheckboxRows]);

    useEffect(() => {
        localStorage.setItem('data', JSON.stringify(data));
        localStorage.setItem('boldRows', JSON.stringify(boldRows));
        localStorage.setItem('checkboxRows', JSON.stringify(checkboxRows));
        localStorage.setItem('checkedRows', JSON.stringify(checkedRows));
    }, [data, boldRows, checkboxRows, checkedRows]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = ''; // This is necessary for modern browsers to show the confirmation dialog
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleCheckboxClick = (id) => {
        setCheckedRows((prevCheckedRows) => {
            if (prevCheckedRows.includes(id)) {
                return prevCheckedRows.filter((i) => i !== id);
            } else {
                return [...prevCheckedRows, id];
            }
        });
    };

    const handleReset = () => {
        if (confirmReset === 0) {
            setConfirmReset(1);
        } else if (confirmReset === 1) {
            setConfirmReset(2);
        } else if (confirmReset === 2) {
            setCheckedRows([]);
            setConfirmReset(0);
        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const getFilteredData = () => {
        switch (filter) {
            case 'checked':
                return data.filter((row) => checkedRows.includes(row.id));
            case 'unchecked':
                return data.filter((row) => !checkedRows.includes(row.id) && checkboxRows.includes(row.id));
            case 'all':
            default:
                return data;
        }
    };

    const filteredData = getFilteredData();
    const totalCheckboxRows = checkboxRows.length;
    const checkedCount = checkedRows.filter(id => checkboxRows.includes(id)).length;
    const leftOutCount = totalCheckboxRows - checkedCount;
    const progressPercentage = totalCheckboxRows > 0 ? (checkedCount / totalCheckboxRows) * 100 : 0;

    const Row = ({ row }) => {
        const isBold = boldRows.includes(row.id);
        const isChecked = checkedRows.includes(row.id);
        return (
            <TableRow key={row.id} className={`${isBold ? 'bold-row' : ''} ${isChecked ? 'checked-row' : ''}`}>
                <TableCell className="table-cell"style={{width:'fit-content'}}>{row.hrs}</TableCell>
                <TableCell className="table-cell">{row.mins}</TableCell>
                <TableCell className="table-cell">{row.sec}</TableCell>
                <TableCell className="table-cell">{row['si.no']}</TableCell>
                <TableCell className="table-cell wrap-cell">{row.activity_name}</TableCell>
                <TableCell className="table-cell fit-content-cell">{row.confirmed_by}</TableCell>
                <TableCell className="table-cell checkbox-cell">
                    {checkboxRows.includes(row.id) && (
                        <Checkbox 
                            checked={checkedRows.includes(row.id)} 
                            onChange={() => handleCheckboxClick(row.id)}
                        />
                    )}
                </TableCell>
            </TableRow>
        );
    };

    return (
        <Box sx={{ padding: 2, background: 'linear-gradient(to right, #EBF4F6, #37B7C3, #088395, #071952)', minHeight: '100vh', color: '#333', display: 'flex' }}>
            <Box sx={{ width: '80%', display: 'flex', flexDirection: 'column' }}>
                <Box className="header-container" sx={{ width: '100%', marginBottom: '16px' }}>
                    <Typography variant="h5" style={{ textAlign: 'center', paddingBottom: '10px', paddingTop: '5px' }}>Activity Tracker</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'normal', marginBottom: 1 }}>
                        <Box className="info-box sleek-box">
                            <Typography variant="body1">Total Events</Typography>
                            <Typography variant="h5">{totalCheckboxRows}</Typography>
                        </Box>
                        <Box className="info-box sleek-box">
                            <Typography variant="body1">Completed Events</Typography>
                            <Typography variant="h5">{checkedCount}</Typography>
                        </Box>
                        <Box className="info-box sleek-box">
                            <Typography variant="body1">Leftout Events</Typography>
                            <Typography variant="h5">{leftOutCount}</Typography>
                        </Box>
                    </Box>
                    <FormControl fullWidth sx={{ marginTop: 1 }}>
                        <InputLabel id="filter-label" style={{ color: '#333' }}>Filter Activities</InputLabel>
                        <Select
                            labelId="filter-label"
                            id="filter"
                            value={filter}
                            label="Filter Activities"
                            onChange={handleFilterChange}
                            style={{ color: '#333' }}
                        >
                            <MenuItem value="all">All Activities</MenuItem>
                            <MenuItem value="checked">Checked Activities</MenuItem>
                            <MenuItem value="unchecked">Unchecked Activities</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <TableContainer component={Paper} sx={{ height: 500, backgroundColor: 'rgba(255, 255, 255, 0.9)', position: 'relative', width: '100%' }}>
                    <Table stickyHeader sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell className="table-header-cell small-cell">Hrs</TableCell>
                                <TableCell className="table-header-cell small-cell">Min</TableCell>
                                <TableCell className="table-header-cell small-cell">Sec</TableCell>
                                <TableCell className="table-header-cell small-cell">Si. No</TableCell>
                                <TableCell className="table-header-cell">Activity Name</TableCell>
                                <TableCell className="table-header-cell fit-content-cell">Confirmed By</TableCell>
                                <TableCell className="table-header-cell checkbox-cell">Check</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row) => (
                                <Row key={row.id} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={handleReset} 
                    sx={{ marginTop: 2, alignSelf: 'center' }}
                >
                    {confirmReset === 1 ? "Are you sure you want to reset?" : 
                    confirmReset === 2 ? "Are you really sure you want to reset?" : 
                    "Reset"}
                </Button>
            </Box>
            <Box sx={{ width: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box className="info-box" sx={{ marginBottom: 1, width: '100%', height: '100px',right:'-30px',position:'relative',top:'47px'}}>
                    <Typography variant="h6">Progress</Typography>
                    <Typography className="progress-percentage">{`${Math.round(progressPercentage)}%`}</Typography>
                </Box>
                <Box className="progress-container" sx={{ flexGrow: 1, justifyContent: 'center', width: '100%', height: '100%' }}>
                    <div className="custom-progress-bar" style={{ height: '85%', width: '100%',right:'-30px' }}>
                        <div className="progress-bar-fill" style={{ height: `${progressPercentage}%`, width: '100%' }}></div>
                    </div>
                </Box>
            </Box>
        </Box>
    );
};

export default FormattedTable;
