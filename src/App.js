import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'

import Header from './components/header/header';
import Main from './components/main/main';
import ZoneRoute from './components/zone-content/zone-content'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Navigate to="/home" />} />
          <Route exact path="/home" element={<Main />} />
          <Route exact path="/zone/:zoneName" element={<ZoneRoute />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
