import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const NetRunsBarChart = () => {
    const [year, setYear] = useState(null);
    const [netRunsData, setNetRunsData] = useState(null);

    useEffect(() => {
        if (year) {
            fetchNetRunsData();
        }
    }, [year]);

    const fetchNetRunsData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/net-runs/?year=${year}`);
            const data = await response.json();
            setNetRunsData(data);
        } catch (error) {
            console.error('Error fetching net runs data:', error);
        }
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleSubmit = () => {
        if (year) {
            fetchNetRunsData();
        }
    };

    const renderChart = () => {
        if (!netRunsData) return null;

        const labels = netRunsData.map(entry => entry.team);
        const data = netRunsData.map(entry => entry.net_runs_conceded);
        const backgroundColors = data.map(value => value >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)');

        return (
            <Bar
                data={{
                    labels: labels,
                    datasets: [{
                        label: 'Net Runs Conceded',
                        data: data,
                        backgroundColor: backgroundColors,
                        borderColor: '#000',
                        borderWidth: 1
                    }]
                }}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: 'white' }
                        },
                        x: {
                            ticks: { color: 'white' }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }}
            />
        );
    };

    return (
        <div style={{ background: '#222', color: 'white', minHeight: '100vh', padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Net Runs Conceded by Each Team</h2>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <label htmlFor="year">Select Year:</label>
                <select id="year" onChange={handleYearChange} value={year}>
                    <option value="">Select</option>
                    {Array.from({ length: 10 }, (_, index) => (
                        <option key={2008 + index} value={2008 + index}>{2008 + index}</option>
                    ))}
                </select>
                <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>Submit</button>
            </div>
            {renderChart()}
        </div>
    );
};

export default NetRunsBarChart;