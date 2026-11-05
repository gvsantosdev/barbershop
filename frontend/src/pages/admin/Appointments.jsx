import { useEffect, useState } from 'react';
import { supabaseAdmin } from '../../lib/supabase.js';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    const { data, error } = await supabaseAdmin.from('appointments').select('*');
    if (error) {
      console.error(error);
      setError('Erro ao carregar agendamentos: ' + error.message);
    } else {
      setAppointments(data);
    }
  };

  const cancelAppointment = async (id) => {
    setError('');
    const { error } = await supabaseAdmin
      .from('appointments')
      .update({ status: 'canceled' })
      .eq('id', id);
    if (error) {
      console.error(error);
      setError('Erro ao cancelar agendamento: ' + error.message);
    } else {
      fetchAppointments();
    }
  };

  const deleteAppointment = async (id) => {
    setError('');
    const { error } = await supabaseAdmin.from('appointments').delete().eq('id', id);
    if (error) {
      console.error(error);
      setError('Erro ao excluir agendamento: ' + error.message);
    } else {
      fetchAppointments();
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="admin-section">
      <h2>Agendamentos</h2>

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

      {appointments.length === 0 ? (
        <p style={{ color: '#888' }}>Nenhum agendamento encontrado.</p>
      ) : (
        <ul>
          {appointments.map((a) => (
            <li key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>
                <strong>Cliente:</strong> {a.client_name || '—'} |{' '}
                <strong>Serviço:</strong> {a.service_id || '—'} |{' '}
                <strong>Barbeiro:</strong> {a.barber_id || '—'} |{' '}
                <strong>Horário:</strong> {a.start_at ? new Date(a.start_at).toLocaleString('pt-BR') : '—'} |{' '}
                <strong>Status:</strong> {a.status || '—'}
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                {a.status !== 'canceled' && (
                  <button onClick={() => cancelAppointment(a.id)}>Cancelar</button>
                )}
                <button onClick={() => deleteAppointment(a.id)}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
