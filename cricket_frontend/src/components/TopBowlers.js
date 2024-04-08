import React, { Component } from 'react';

class TopBowlers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topBowlers: [], // Initialize state to hold top bowlers data
      selectedYear: '', // State to hold selected year
      years: [] // State to hold years for dropdown
    };
  }

  componentDidMount() {
    // Populate dropdown with years from 2008 to 2017
    const years = [];
    for (let year = 2008; year <= 2017; year++) {
      years.push(year.toString());
    }
    this.setState({ years });
  }

  fetchDataForYear = () => {
    const { selectedYear } = this.state;
    fetch(`http://localhost:8000/bowler-stats/?year=${selectedYear}`)
        .then(response => response.json())
        .then(data => {
            this.setState({ topBowlers: data }); // Update state with fetched data
        })
        .catch(error => {
            console.error('Error fetching top bowlers data:', error);
        });
  }

  handleYearChange = (event) => {
    this.setState({ selectedYear: event.target.value });
  }

  render() {
    return (
      <div style={{ background: '#222', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>Top Economical Bowlers</h1>
        <label htmlFor="yearSelect" style={{ marginBottom: '10px' }}>Select Year:</label>
        <select id="yearSelect" value={this.state.selectedYear} onChange={this.handleYearChange} style={{ marginBottom: '20px' }}>
          <option value="">--Select Year--</option>
          {this.state.years && this.state.years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <button onClick={this.fetchDataForYear} style={{ marginBottom: '20px' }}>Get Top Bowlers</button>
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
            {this.state.topBowlers.map((bowler, index) => (
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
  }
}

export default TopBowlers;
