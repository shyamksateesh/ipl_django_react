import React from 'react';
import './App.css';
import TopBowlers from './components/TopBowlers'; // Import TopBowlers component
import MatchStatsGraph from './components/MatchStatsGraph';
import StackedBarChart from './components/StackedBarChart';
import MatchWinLose from './components/MatchWinLose';

function App() {
  return (
    <div className="App">
      <MatchWinLose />
      <TopBowlers /> 
      <MatchStatsGraph />
      <StackedBarChart />
    </div>
  );
}

export default App;
