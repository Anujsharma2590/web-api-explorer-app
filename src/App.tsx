import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { APIDetailsPage, Home } from './pages';


const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/api/:provider" element={<APIDetailsPage />} />
      <Route path="/api/:provider/:apiName" element={<APIDetailsPage />} />
    </Routes>
  </Router>
);

export default App;
