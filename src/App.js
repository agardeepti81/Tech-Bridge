import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'

import Header from './components/header/header';
import Main from './components/main/main';
import ZoneContent from './components/zone-content/zone-content';

import { HashRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<ZoneContent />} />
          <Route exact path="/zone" element={<Main />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
