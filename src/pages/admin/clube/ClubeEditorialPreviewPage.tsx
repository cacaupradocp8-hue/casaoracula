/* FORCING REBUILD - v30 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function ClubeEditorialPreviewPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  console.log("[PREVIEW_CRITICAL] ClubeEditorialPreviewPage renderizando com itemId:", itemId);

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['admin-preview-item-minimal', itemId],
    queryFn: async () => {
      console.log("[PREVIEW_CRITICAL] Buscando item no Supabase...");
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select('*')
        .eq('id', itemId)
        .single();
      if (error) {
        console.error("[PREVIEW_CRITICAL] Erro Supabase:", error);
        throw error;
      }
      return data;
    },
    enabled: !!itemId
  });

  if (isLoading) return <div style={{padding: '50px', color: 'white', background: 'black'}}>Lendo dados do item {itemId}...</div>;
  if (error) return <div style={{padding: '50px', color: 'red', background: 'black'}}>Erro: {(error as Error).message}</div>;
  if (!item) return <div style={{padding: '50px', color: 'yellow', background: 'black'}}>Item não encontrado.</div>;

  return (
    <div style={{ padding: '50px', background: '#0a0a0a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <button 
        onClick={() => navigate('/admin')} 
        style={{ padding: '10px 20px', background: '#d4af37', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}
      >
        Voltar
      </button>
      <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{item.titulo}</h1>
      <p style={{ fontSize: '1.5rem', color: '#666', marginBottom: '30px' }}>{item.subtitulo}</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
          <h2>Dados Brutos</h2>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>{JSON.stringify(item, null, 2)}</pre>
        </div>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
          <h2>Status</h2>
          <p>ID: {item.id}</p>
          <p>Ordem: {item.ordem}</p>
          <p>Porta: {item.porta}</p>
        </div>
      </div>
    </div>
  );
}

