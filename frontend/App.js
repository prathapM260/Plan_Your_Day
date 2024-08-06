// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './MydiaryFrontend/HomePage';
import IncludeContentPage from './MydiaryFrontend/IncludeContentPage';
import DetailedPage from './MydiaryFrontend/DetailedPage';
import SchedulePage from './MydiaryFrontend/SchedulePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/include-content/:goalId" element={<IncludeContentPage />} />
        <Route path="/detailed-page" element={<DetailedPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
      </Routes>
    </Router>
  );
};

export default App;
