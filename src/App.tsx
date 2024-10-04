import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import RegisterUser from './pages/RegisterUser';
import RegisterAttack from './pages/RegisterAttack';
import ReceivedAttacks from './pages/ReceivedAttacks';
import AttackGraph from './pages/AttackGraph';
import NotFound from './pages/NotFound';
import { TeamProvider } from './context/TeamContext';
import './App.css';

const App: React.FC = () => {
  return (
    <TeamProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register-user" element={<RegisterUser />} />
            <Route path="/register-attack" element={<RegisterAttack />} />
            <Route path="/received-attacks" element={<ReceivedAttacks />} />
            <Route path="/attack-graph" element={<AttackGraph />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </TeamProvider>
  );
};

export default App;
