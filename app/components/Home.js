import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';


export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <h2>Home</h2>
          <ul>
            <li><Link to="/game">to Game</Link></li>
            {/* <li><Link to="/particle-storm">to ParticleStorm</Link></li> */}
          </ul>
        </div>
      </div>
    );
  }
}
