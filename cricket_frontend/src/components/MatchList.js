import React, { useState, useEffect } from 'react';

const MatchList = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('http://localhost:8000/matches/');
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  return (
    <div>
      <h2>Match List</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Team 1</th>
            <th>Team 2</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr key={index}>
              <td>{match.date}</td>
              <td>{match.team1}</td>
              <td>{match.team2}</td>
              <td>{match.winner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchList;
