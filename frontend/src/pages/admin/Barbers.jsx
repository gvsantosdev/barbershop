import { useEffect, useState, useRef } from 'react';
import { supabaseAdmin, uploadImage, deleteImage } from '../../lib/supabase.js';

export default function Barbers() {
  const [barbers, setBarbers] = useState([]);
  const [newName, setNewName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const fetchBarbers = async () => {
    const { data, error } = await supabaseAdmin.from('barbers').select('*').order('created_at', { ascending: true });
    if (error) {
      console.error(error);
      setError('Erro ao carregar barbeiros: ' + error.message);
    } else {
      setBarbers(data || []);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setNewName('');
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addBarber = async () => {
    if (!newName.trim()) return;
    setUploading(true);
    setError('');

    let photo_url = null;

    // Upload da foto para o Supabase Storage se um arquivo foi selecionado
    if (imageFile) {
      const { url, error: uploadError } = await uploadImage('images', imageFile, 'barbers');
      if (uploadError) {
        setError('Erro ao enviar a foto: ' + uploadError.message);
        setUploading(false);
        return;
      }
      photo_url = url;
    }

    const insertData = { name: newName.trim() };
    if (photo_url) insertData.photo_url = photo_url;

    const { error: insertError } = await supabaseAdmin.from('barbers').insert(insertData);
    if (insertError) {
      console.error(insertError);
      setError('Erro ao adicionar barbeiro: ' + insertError.message);
      if (photo_url) await deleteImage('images', photo_url);
    } else {
      resetForm();
      fetchBarbers();
    }
    setUploading(false);
  };

  const deleteBarber = async (barber) => {
    setError('');
    if (barber.photo_url) {
      await deleteImage('images', barber.photo_url);
    }
    const { error } = await supabaseAdmin.from('barbers').delete().eq('id', barber.id);
    if (error) {
      console.error(error);
      setError('Erro ao excluir barbeiro: ' + error.message);
    } else {
      fetchBarbers();
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  return (
    <div className="admin-section">
      <h2>Barbeiros</h2>

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

      {barbers.length === 0 ? (
        <p style={{ color: '#888' }}>Nenhum barbeiro cadastrado.</p>
      ) : (
        <ul style={{ padding: 0 }}>
          {barbers.map((b) => (
            <li key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0' }}>
              {b.photo_url ? (
                <img
                  src={b.photo_url}
                  alt={b.name}
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#555',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  {b.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <strong>{b.name}</strong>
              </div>
              <button onClick={() => deleteBarber(b)} style={{ marginLeft: 'auto' }}>Excluir</button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '500px' }}>
        <h3>Adicionar Barbeiro</h3>
        <input
          placeholder="Nome do barbeiro"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ padding: '0.6rem', fontSize: '1rem' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label
            style={{
              padding: '0.5rem 1rem',
              background: '#3498db',
              color: '#fff',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'inline-block'
            }}
          >
            📷 Escolher Foto
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          {imageFile && <span style={{ fontSize: '0.85rem', color: '#888' }}>{imageFile.name}</span>}
        </div>
        <button
          onClick={addBarber}
          disabled={uploading || !newName.trim()}
          style={{
            padding: '0.6rem 1.2rem',
            background: uploading || !newName.trim() ? '#888' : '#27ae60',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: uploading || !newName.trim() ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          {uploading ? 'Enviando...' : 'Adicionar Barbeiro'}
        </button>
      </div>
    </div>
  );
}
