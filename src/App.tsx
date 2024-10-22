// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import APIDetailsPage from './pages/APIDetailsPage';


const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/api/:provider/:apiName" element={<APIDetailsPage />} />
    </Routes>
  </Router>
);

export default App;
