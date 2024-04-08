import React from 'react';
import './App.css';
import TopBowlers from './components/TopBowlers'; // Import TopBowlers component
import MatchStatsGraph from './components/MatchStatsGraph';
import StackedBarChart from './components/StackedBarChart';

function App() {
  return (
    <div className="App">
      <TopBowlers /> {/* Use TopBowlers component here */}
      <MatchStatsGraph />
      <StackedBarChart />
    </div>
  );
}

export default App;
