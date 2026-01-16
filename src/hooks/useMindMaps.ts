import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MindMap, MindMapNode } from '@/types/mindmap';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useMindMaps() {
  const { user } = useAuth();
  const [maps, setMaps] = useState<MindMap[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMaps = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('mind_maps')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar mapas');
      console.error(error);
    } else {
      setMaps(data as MindMap[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchMaps();
  }, [fetchMaps]);

  const createMap = async (title: string = 'Novo Mapa') => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('mind_maps')
      .insert({ owner_id: user.id, title })
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar mapa');
      console.error(error);
      return null;
    }

    // Create root node
    await supabase
      .from('mind_map_nodes')
      .insert({
        map_id: data.id,
        title: 'Tema Central',
        position_x: 400,
        position_y: 300,
        order_index: 0
      });

    setMaps(prev => [data as MindMap, ...prev]);
    return data as MindMap;
  };

  const deleteMap = async (id: string) => {
    const { error } = await supabase
      .from('mind_maps')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir mapa');
      console.error(error);
      return false;
    }

    setMaps(prev => prev.filter(m => m.id !== id));
    toast.success('Mapa excluído');
    return true;
  };

  const updateMap = async (id: string, updates: Partial<MindMap>) => {
    const { error } = await supabase
      .from('mind_maps')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error(error);
      return false;
    }

    setMaps(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    return true;
  };

  return { maps, loading, createMap, deleteMap, updateMap, refetch: fetchMaps };
}

export function useMindMapEditor(mapId: string | undefined) {
  const [map, setMap] = useState<MindMap | null>(null);
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const fetchMapData = useCallback(async () => {
    if (!mapId) return;
    
    setLoading(true);
    
    const [mapRes, nodesRes] = await Promise.all([
      supabase.from('mind_maps').select('*').eq('id', mapId).single(),
      supabase.from('mind_map_nodes').select('*').eq('map_id', mapId).order('order_index')
    ]);

    if (mapRes.error) {
      toast.error('Mapa não encontrado');
      console.error(mapRes.error);
    } else {
      setMap(mapRes.data as MindMap);
    }

    if (!nodesRes.error) {
      setNodes(nodesRes.data as MindMapNode[]);
    }

    setLoading(false);
  }, [mapId]);

  useEffect(() => {
    fetchMapData();
  }, [fetchMapData]);

  const updateMapTitle = async (title: string) => {
    if (!mapId) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('mind_maps')
      .update({ title })
      .eq('id', mapId);

    if (!error) {
      setMap(prev => prev ? { ...prev, title } : null);
      setLastSaved(new Date());
    }
    setSaving(false);
  };

  const createNode = async (parentId: string | null, position: { x: number; y: number }) => {
    if (!mapId) return null;

    const maxOrder = Math.max(...nodes.map(n => n.order_index), -1);
    
    const { data, error } = await supabase
      .from('mind_map_nodes')
      .insert({
        map_id: mapId,
        parent_id: parentId,
        title: 'Novo Nó',
        position_x: position.x,
        position_y: position.y,
        order_index: maxOrder + 1
      })
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar nó');
      console.error(error);
      return null;
    }

    const newNode = data as MindMapNode;
    setNodes(prev => [...prev, newNode]);
    setLastSaved(new Date());
    
    // Update map's updated_at
    await supabase.from('mind_maps').update({ updated_at: new Date().toISOString() }).eq('id', mapId);
    
    return newNode;
  };

  const updateNode = async (nodeId: string, updates: Partial<MindMapNode>) => {
    setSaving(true);
    
    const { error } = await supabase
      .from('mind_map_nodes')
      .update(updates)
      .eq('id', nodeId);

    if (error) {
      console.error(error);
      setSaving(false);
      return false;
    }

    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...updates } : n));
    setLastSaved(new Date());
    
    // Update map's updated_at
    if (mapId) {
      await supabase.from('mind_maps').update({ updated_at: new Date().toISOString() }).eq('id', mapId);
    }
    
    setSaving(false);
    return true;
  };

  const deleteNode = async (nodeId: string) => {
    // Find all descendant nodes to delete
    const getDescendants = (id: string): string[] => {
      const children = nodes.filter(n => n.parent_id === id);
      return [id, ...children.flatMap(c => getDescendants(c.id))];
    };

    const idsToDelete = getDescendants(nodeId);
    
    const { error } = await supabase
      .from('mind_map_nodes')
      .delete()
      .in('id', idsToDelete);

    if (error) {
      toast.error('Erro ao excluir nó');
      console.error(error);
      return false;
    }

    setNodes(prev => prev.filter(n => !idsToDelete.includes(n.id)));
    setLastSaved(new Date());
    
    if (mapId) {
      await supabase.from('mind_maps').update({ updated_at: new Date().toISOString() }).eq('id', mapId);
    }
    
    return true;
  };

  return {
    map,
    nodes,
    loading,
    saving,
    lastSaved,
    updateMapTitle,
    createNode,
    updateNode,
    deleteNode,
    refetch: fetchMapData
  };
}
