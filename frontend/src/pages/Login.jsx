import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;

    if (password === adminPass || password.trim() === adminPass?.trim()) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/barbers');
    } else {
      setError('Senha inválida!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4rem' }}>
      <h2>Área Administrativa</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <input
          type="password"
          placeholder="Digite a senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.5rem', marginBottom: '1rem' }}
        />
        {error && <p style={{ color: '#ff4444', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{error}</p>}
        <button type="submit" style={{ padding: '0.5rem' }}>Entrar</button>
      </form>
    </div>
  );
}
