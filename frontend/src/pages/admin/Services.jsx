import { useEffect, useState } from 'react';
import { supabaseAdmin } from '../../lib/supabase.js';

export default function Services() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchServices = async () => {
    const { data, error } = await supabaseAdmin.from('services').select('*').order('created_at', { ascending: true });
    if (error) {
      console.error(error);
      setError('Erro ao carregar serviços: ' + error.message);
    } else {
      setServices(data || []);
    }
  };

  const resetForm = () => {
    setNewService({ name: '', price: '', duration: '' });
  };

  const addService = async () => {
    const { name, price, duration } = newService;
    if (!name.trim()) {
      setError('Informe o nome do serviço.');
      return;
    }
    if (!price || isNaN(parseFloat(price))) {
      setError('Informe um preço válido.');
      return;
    }
    if (!duration || isNaN(parseInt(duration, 10))) {
      setError('Informe a duração em minutos.');
      return;
    }

    setSubmitting(true);
    setError('');

    const insertData = {
      name: name.trim(),
      price: parseFloat(price),
      duration_minutes: parseInt(duration, 10),
    };

    const { error: insertError } = await supabaseAdmin.from('services').insert(insertData);
    if (insertError) {
      console.error(insertError);
      setError('Erro ao adicionar serviço: ' + insertError.message);
    } else {
      resetForm();
      fetchServices();
    }
    setSubmitting(false);
  };

  const deleteService = async (service) => {
    setError('');
    const { error } = await supabaseAdmin.from('services').delete().eq('id', service.id);
    if (error) {
      console.error(error);
      setError('Erro ao excluir serviço: ' + error.message);
    } else {
      fetchServices();
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="admin-section">
      <h2>Serviços</h2>

      {error && (
        <div style={{
          background: '#ff4444',
          color: '#fff',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {services.length === 0 ? (
        <p style={{ color: '#888' }}>Nenhum serviço cadastrado.</p>
      ) : (
        <ul style={{ padding: 0 }}>
          {services.map((s) => (
            <li key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0' }}>
              <div>
                <strong>{s.name}</strong>
                <span style={{ color: '#aaa', marginLeft: '0.75rem' }}>
                  R$ {Number(s.price).toFixed(2)} – {s.duration_minutes} min
                </span>
              </div>
              <button onClick={() => deleteService(s)} style={{ marginLeft: 'auto' }}>Excluir</button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '500px' }}>
        <h3>Adicionar Serviço</h3>
        <input
          placeholder="Nome do serviço (ex: Corte Degradê)"
          value={newService.name}
          onChange={e => setNewService({ ...newService, name: e.target.value })}
          style={{ padding: '0.6rem', fontSize: '1rem' }}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            placeholder="Preço (ex: 45.00)"
            type="number"
            step="0.01"
            value={newService.price}
            onChange={e => setNewService({ ...newService, price: e.target.value })}
            style={{ padding: '0.6rem', fontSize: '1rem', flex: 1 }}
          />
          <input
            placeholder="Duração em min (ex: 30)"
            type="number"
            value={newService.duration}
            onChange={e => setNewService({ ...newService, duration: e.target.value })}
            style={{ padding: '0.6rem', fontSize: '1rem', flex: 1 }}
          />
        </div>
        <button
          onClick={addService}
          disabled={submitting}
          style={{
            padding: '0.6rem 1.2rem',
            background: submitting ? '#888' : '#27ae60',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          {submitting ? 'Salvando...' : 'Adicionar Serviço'}
        </button>
      </div>
    </div>
  );
}
