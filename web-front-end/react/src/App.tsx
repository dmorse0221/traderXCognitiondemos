import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Datatable } from './Datatable/Datatable';
import { AccountPage } from './pages/AccountPage';
import { Header } from './components/Header';
import React from 'react';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Datatable />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
