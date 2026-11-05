import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cliente público para o navegador (utiliza a chave public/anon)
export const supabase = createClient(supabaseUrl, supabaseKey);

// No navegador, nunca deve ser usada a secret key (o Supabase bloqueia requisições de browser com ela).
// Usamos a mesma instância pública, cujas permissões são controladas pelas políticas RLS do Supabase.
export const supabaseAdmin = supabase;

/**
 * Faz upload de um arquivo para o Supabase Storage.
 * @param {string} bucket - Nome do bucket (ex: 'images')
 * @param {File} file - Arquivo a ser enviado
 * @param {string} folder - Pasta dentro do bucket (ex: 'barbers', 'services', 'portfolio')
 * @returns {Promise<{url: string|null, error: any}>}
 */
export async function uploadImage(bucket, file, folder) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Erro no upload:', error);
    return { url: null, error };
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { url: urlData.publicUrl, error: null };
}

/**
 * Remove um arquivo do Supabase Storage pela URL pública.
 * @param {string} bucket - Nome do bucket
 * @param {string} publicUrl - URL pública do arquivo
 */
export async function deleteImage(bucket, publicUrl) {
  if (!publicUrl) return;
  try {
    // Extrai o path do arquivo a partir da URL pública
    const url = new URL(publicUrl);
    const pathParts = url.pathname.split(`/storage/v1/object/public/${bucket}/`);
    if (pathParts.length > 1) {
      const filePath = decodeURIComponent(pathParts[1]);
      await supabaseAdmin.storage.from(bucket).remove([filePath]);
    }
  } catch (err) {
    console.error('Erro ao deletar imagem:', err);
  }
}
