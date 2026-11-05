import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Agendamento from './pages/Agendamento.jsx';
import Servicos from './pages/Servicos.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AdminGuard from './components/AdminGuard.jsx';
import Inicio from './pages/Inicio.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route element={<AdminGuard />}>
          <Route path="/admin/*" element={<Dashboard />} />
        </Route>
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
