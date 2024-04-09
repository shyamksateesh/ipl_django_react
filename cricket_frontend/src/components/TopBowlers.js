import React, { useState, useEffect } from 'react';

const TopBowlers = () => {
    const [topBowlers, setTopBowlers] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [years, setYears] = useState([]);

    useEffect(() => {
        populateYears();
    }, []);

    const populateYears = () => {
        const yearsArray = [];
        for (let year = 2008; year <= 2017; year++) {
            yearsArray.push(year.toString());
        }
        setYears(yearsArray);
    };

    const fetchDataForYear = () => {
        fetch(`http://localhost:8000/bowler-stats/?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                setTopBowlers(data);
            })
            .catch(error => {
                console.error('Error fetching top bowlers data:', error);
            });
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <div style={{ background: '#222', color: 'white', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ textAlign: 'center' }}>Top Economical Bowlers</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <label htmlFor="yearSelect" style={{ marginRight: '10px' }}>Select Year:</label>
                <select id="yearSelect" value={selectedYear} onChange={handleYearChange} style={{ marginRight: '10px' }}>
                    <option value="">--Select Year--</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <button onClick={fetchDataForYear} style={{ backgroundColor: '#cb9d06', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>Submit</button>
            </div>
            <table style={{ width: '80%', maxWidth: '800px', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ width: '10%', border: '1px solid #ddd', padding: '8px', backgroundColor: '#333' }}>Serial No.</th>
                        <th style={{ width: '30%', border: '1px solid #ddd', padding: '8px', backgroundColor: '#333' }}>Bowler</th>
                        <th style={{ width: '20%', border: '1px solid #ddd', padding: '8px', backgroundColor: '#333' }}>Economy</th>
                        <th style={{ width: '20%', border: '1px solid #ddd', padding: '8px', backgroundColor: '#333' }}>Overs</th>
                    </tr>
                </thead>
                <tbody>
                    {topBowlers.map((bowler, index) => (
                        <tr key={bowler.bowler}>
                            <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#444' }}>{index + 1}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#444' }}>{bowler.bowler}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#444' }}>{bowler.economy}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#444' }}>{bowler.overs}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopBowlers;
