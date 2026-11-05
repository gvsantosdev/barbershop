import { useEffect, useState, useRef } from 'react';
import { supabaseAdmin, uploadImage, deleteImage } from '../../lib/supabase.js';

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [newItem, setNewItem] = useState({ serviceId: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const fetchPortfolio = async () => {
    const { data, error } = await supabaseAdmin.from('portfolio').select('*');
    if (error) {
      console.error(error);
      setError('Erro ao carregar portfólio: ' + error.message);
    } else {
      setItems(data);
    }
  };

  const fetchServices = async () => {
    const { data } = await supabaseAdmin.from('services').select('id, name');
    if (data) setServices(data);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setNewItem({ serviceId: '', description: '' });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addItem = async () => {
    if (!imageFile) {
      setError('Selecione uma imagem para o portfólio.');
      return;
    }
    setUploading(true);
    setError('');

    const { url, error: uploadError } = await uploadImage('images', imageFile, 'portfolio');
    if (uploadError) {
      setError('Erro ao enviar a imagem: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const insertData = {
      image_url: url,
    };
    if (newItem.serviceId) insertData.service_id = newItem.serviceId;
    if (newItem.description.trim()) insertData.description = newItem.description.trim();

    const { error: insertError } = await supabaseAdmin.from('portfolio').insert(insertData);
    if (insertError) {
      console.error(insertError);
      setError('Erro ao adicionar ao portfólio: ' + insertError.message);
      await deleteImage('images', url);
    } else {
      resetForm();
      fetchPortfolio();
    }
    setUploading(false);
  };

  const deleteItem = async (item) => {
    setError('');
    if (item.image_url) {
      await deleteImage('images', item.image_url);
    }
    const { error } = await supabaseAdmin.from('portfolio').delete().eq('id', item.id);
    if (error) {
      console.error(error);
      setError('Erro ao excluir item: ' + error.message);
    } else {
      fetchPortfolio();
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchServices();
  }, []);

  return (
    <div className="admin-section">
      <h2>Portfólio</h2>

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

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {items.map((item) => (
          <div key={item.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '0.75rem',
            width: '180px',
            textAlign: 'center',
          }}>
            <img
              src={item.image_url}
              alt={item.description || 'Portfolio'}
              style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }}
            />
            {item.description && <p style={{ fontSize: '0.85rem', margin: '0.5rem 0' }}>{item.description}</p>}
            <button onClick={() => deleteItem(item)} style={{ fontSize: '0.8rem' }}>Excluir</button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '500px' }}>
        <h3 style={{ margin: 0 }}>Adicionar ao Portfólio</h3>

        {services.length > 0 && (
          <select
            value={newItem.serviceId}
            onChange={e => setNewItem({ ...newItem, serviceId: e.target.value })}
            style={{ padding: '0.5rem' }}
          >
            <option value="">Serviço (opcional)</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}

        <input
          placeholder="Descrição (opcional)"
          value={newItem.description}
          onChange={e => setNewItem({ ...newItem, description: e.target.value })}
          style={{ padding: '0.5rem' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label
            style={{
              padding: '0.5rem 1rem',
              background: '#3498db',
              color: '#fff',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
            }}
          >
            🖼️ Escolher Imagem
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
              style={{ width: 64, height: 64, borderRadius: '8px', objectFit: 'cover' }}
            />
          )}
          {imageFile && <span style={{ fontSize: '0.85rem', color: '#888' }}>{imageFile.name}</span>}
        </div>

        <button
          onClick={addItem}
          disabled={uploading}
          style={{
            padding: '0.6rem 1.2rem',
            background: uploading ? '#888' : '#27ae60',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
          }}
        >
          {uploading ? 'Enviando...' : 'Adicionar ao Portfólio'}
        </button>
      </div>
    </div>
  );
}
