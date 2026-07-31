import React from 'react';
import Dashboard from './components/Dashboard';
import QRScanner from './components/QRScanner';
import './App.css';

function App() {
    // Check if we're on the scanner page
    const isScanner = window.location.pathname === '/scan';

    return (
        <div className="App">
            {isScanner ? <QRScanner /> : <Dashboard />}
        </div>
    );
}

export default App;