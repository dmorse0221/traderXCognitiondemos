import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Trade } from './pages/Trade';
import { Account } from './pages/Account';
import { NotFound } from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/trade" element={<Trade />} />
          <Route path="/account" element={<Account />} />
          <Route path="/" element={<Navigate to="/trade" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
