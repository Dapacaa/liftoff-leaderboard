import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import buildPlayerList from './components/functions';
import fetchLeaderboard from './components/functions';
  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


