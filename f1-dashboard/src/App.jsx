// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home.jsx';
import Drivers from './pages/Drivers.jsx';
import Teams from './pages/Teams.jsx';
import Standings from './pages/Standings.jsx'; 
import Races from './pages/Races.jsx';
import RaceDetails from './pages/RaceDetails.jsx';
import ReplayRace from './pages/ReplayRace.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-f1-dark text-gray-100 font-sans selection:bg-f1-red selection:text-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/races" element={<Races />} />
            <Route path="/races/:round" element={<RaceDetails />} />
            <Route path="/replay" element={<ReplayRace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;