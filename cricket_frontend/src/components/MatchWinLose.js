import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const MatchWinLose = () => {
    const [chartData, setChartData] = useState(null);
    const [selectedYear, setSelectedYear] = useState('');
    const [years, setYears] = useState([]);

    useEffect(() => {
        fetchYears();
    }, []);

    const fetchYears = () => {
        const yearsArray = [];
        for (let year = 2008; year <= 2017; year++) {
            yearsArray.push(year.toString());
        }
        setYears(yearsArray);
    };

    const fetchDataForYear = () => {
        fetch(`http://localhost:8000/match-win-lose/?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const formattedData = formatData(data);
                setChartData(formattedData);
            })
            .catch(error => {
                console.error('Error fetching match win/lose data:', error);
            });
    };

    const formatData = (data) => {
        const labels = data.map(item => item.team);
        const datasets = [{
            label: 'Matches Won',
            data: data.map(item => item.matches_won),
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue color
        }, {
            label: 'Matches Lost',
            data: data.map(item => item.matches_played - item.matches_won),
            backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red color
        }];
        return { labels, datasets };
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <div style={{ background: '#222', color: 'white', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ textAlign: 'center' }}>Matches Played vs Matches Won for Each Team</h2>
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
            {chartData && <Bar
                data={chartData}
                options={{
                    plugins: { 
                        legend: { 
                            labels: { color: 'white' } 
                        } 
                    }, 
                    scales: { 
                        x: { 
                            stacked: true, 
                            ticks: { color: 'white' }
                        }, 
                        y: { 
                            stacked: true, 
                            ticks: { color: 'white' } 
                        } 
                    } 
                }} 
                height={125}
            />}
        </div>
    );
};

export default MatchWinLose;
