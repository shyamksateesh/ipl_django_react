import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar'; 
import MatchWinLose from './components/MatchWinLose'; 
import TopBowlers from './components/TopBowlers'; 
import MatchStatsGraph from './components/MatchStatsGraph';
import StackedBarChart from './components/StackedBarChart';
import 'bootstrap/dist/css/bootstrap.min.css';
import NetRunsBarChart from './components/NetRunsBarChart';

const App = () => {
  return (
    <Router>
      <NavBar />
      <div style={{ paddingTop: '56px' }}> {/* Adjust the padding-top value according to your navbar's height */}
        <Routes>
          <Route path="/" element={<div>
            <StackedBarChart />
            <MatchStatsGraph />
          </div>} />
          <Route path="/match-win-lose" element={<MatchWinLose/>} />
          <Route path="/top-bowlers" element={<TopBowlers/>} />
          <Route path="/net-runs" element={<NetRunsBarChart/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
