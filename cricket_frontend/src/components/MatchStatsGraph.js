import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const MatchStatsGraph = () => {
    const [matchStats, setMatchStats] = useState([]);
    const chartContainerRef = useRef(null);

    useEffect(() => {
        fetchMatchStats();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        handleResize(); 
    }, [matchStats]);

    const fetchMatchStats = async () => {
        try {
            const response = await fetch('http://localhost:8000/match-stats/');
            const data = await response.json();
            setMatchStats(data);
        } catch (error) {
            console.error('Error fetching match stats:', error);
        }
    };

    const handleResize = () => {
        if (chartContainerRef.current) {
            const { clientWidth } = chartContainerRef.current;
            const newHeight = Math.min(clientWidth * 0.6, 400); 
            setChartHeight(newHeight);
        }
    };

    const [chartHeight, setChartHeight] = useState(400);

    const renderChart = () => {
        if (!matchStats) return null;

        const brighterColor = 'rgba(75, 192, 192, 0.6)';

        return (
            <Bar
                data={{
                    labels: matchStats.map(stat => stat.year),
                    datasets: [{
                        label: 'Number of Matches',
                        data: matchStats.map(stat => stat.num_matches),
                        backgroundColor: brighterColor,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                }}
                options={{
                    aspectRatio: false, 
                    scales: {
                        x: {
                            stacked: true,
                            ticks: {
                                color: 'white'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            stacked: true,
                            ticks: {
                                color: 'white' 
                            }
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
                height={chartHeight} 
            />
        );
    };

    return (
        <div style={{ background: '#222', color: 'white', width: '100vw', height: '100vh', padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Total Matches Played Per Year</h2>
            <div ref={chartContainerRef} style={{ height: '80%', width: '80%', margin: 'auto' }}>
                {renderChart()}
            </div>
        </div>
    );
};

export default MatchStatsGraph;
