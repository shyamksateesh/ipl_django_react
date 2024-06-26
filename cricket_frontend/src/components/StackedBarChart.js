
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, Tooltip, Legend);

const StackedBarChart = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchStackedData();
    }, []);

    const fetchStackedData = async () => {
        try {
            const response = await fetch('http://localhost:8000/match-wins/');
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Error fetching stacked data:', error);
        }
    };

    const renderChart = () => {
        if (!data) return null;

        const allYears = Array.from(
            new Set(data.flatMap(teamData => teamData.years.map(yearData => yearData.year)))
        );

        const brighterColors = [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(220, 20, 60, 0.6)', 
            'rgba(0, 191, 255, 0.6)',
            'rgba(46, 139, 87, 0.6)', 
            'rgba(255, 182, 193, 0.6)', 
        ];

        const labels = data.map(teamData => teamData.team);
        const datasets = allYears.map((year, index) => ({
            label: year.toString(),
            data: data.map(teamData => {
                const teamYearData = teamData.years.find(data => data.year === year);
                return teamYearData ? teamYearData.num_wins : 0;
            }),
            backgroundColor: brighterColors[index % brighterColors.length], 
            borderColor: '#000',
            borderWidth: 1
        }));

        return (
            <Bar
                data={{
                    labels: labels,
                    datasets: datasets
                }}
                options={{
                    scales: {
                        x: {
                            stacked: true,
                            ticks: { color: 'white' } 
                        },
                        y: {
                            stacked: true,
                            ticks: { color: 'white' } 
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white'
                            }
                        }
                    }
                }}
                height={140}
            />
        );
    };

    return (
        <div style={{ background: '#222', color: 'white', padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Number of Matches Won by Each Team Over the Years</h2>
            {renderChart()}
        </div>
    );
};

export default StackedBarChart;
