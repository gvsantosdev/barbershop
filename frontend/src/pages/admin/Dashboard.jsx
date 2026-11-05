import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Barbers from './Barbers.jsx';
import Services from './Services.jsx';
import Portfolio from './Portfolio.jsx';
import Appointments from './Appointments.jsx';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <nav className="sidebar">
        <h3>Admin Panel</h3>
        <ul>
          <li><NavLink to="barbers" className={({ isActive }) => isActive ? 'active' : ''}>Barbeiros</NavLink></li>
          <li><NavLink to="services" className={({ isActive }) => isActive ? 'active' : ''}>Serviços</NavLink></li>
          <li><NavLink to="portfolio" className={({ isActive }) => isActive ? 'active' : ''}>Portfólio</NavLink></li>
          <li><NavLink to="appointments" className={({ isActive }) => isActive ? 'active' : ''}>Agendamentos</NavLink></li>
        </ul>
        <div className="sidebar-footer">
          <Link to="/">← Ir para o site</Link>
          <button type="button" onClick={handleLogout}>Sair</button>
        </div>
      </nav>
      <main className="content">
        <Routes>
          <Route index element={<Barbers />} />
          <Route path="barbers" element={<Barbers />} />
          <Route path="services" element={<Services />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="appointments" element={<Appointments />} />
        </Routes>
      </main>
    </div>
  );
}
