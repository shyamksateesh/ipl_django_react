import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar'; 
import MatchWinLose from './components/MatchWinLose'; 
import TopBowlers from './components/TopBowlers'; 
import MatchStatsGraph from './components/MatchStatsGraph';
import StackedBarChart from './components/StackedBarChart';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<div>
          <MatchStatsGraph />
          <StackedBarChart />
        </div>} />
        <Route path="/match-win-lose" element={<MatchWinLose/>} />
        <Route path="/top-bowlers" element={<TopBowlers/>} />
      </Routes>
    </Router>
  );
};

export default App;

