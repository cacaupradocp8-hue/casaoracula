import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Book {
  id: string;
  title: string;
  author: string | null;
  category: 'TRAVESSIA' | 'PORTA' | 'PONTE' | 'FUNDACAO' | 'MATRIZ';
  is_multipolar: boolean;
  cover_url: string | null;
  description_short: string | null;
  manifesto_short: string | null;
  why_here: string | null;
  how_to_read: string | null;
  created_at: string;
  updated_at: string;
}

export interface Cycle {
  id: string;
  label: string;
  year: number | null;
  status: string;
}

export interface CycleBook {
  id: string;
  cycle_id: string;
  book_id: string;
  layer_order: number;
  quadrant: string | null;
  is_core: boolean;
  book?: Book;
}

export interface BookLink {
  id: string;
  from_book_id: string;
  to_book_id: string;
  link_type: 'SUPORTA' | 'ABRE' | 'INTEGRA' | 'FUNDA';
  note: string | null;
}

export interface LessonAlbum {
  id: string;
  book_id: string;
  week_number: number;
  phase: string;
  title: string;
  description: string | null;
  guided_reading: string | null;
  closing_text: string | null;
  clinical_alert: string | null;
  clinical_notes: string | null;
  misuse_list: string | null;
  questions: string[] | null;
  audio_script: string | null;
  audio_url: string | null;
  podcast_url: string | null;
}

export function useActiveCycle() {
  return useQuery({
    queryKey: ['active-cycle'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cycles')
        .select('*')
        .in('status', ['active', 'draft'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (error) throw error;
      return data as Cycle;
    },
  });
}

export function useCycleBooks(cycleId: string | undefined) {
  return useQuery({
    queryKey: ['cycle-books', cycleId],
    enabled: !!cycleId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cycle_books')
        .select('*, book:books(*)')
        .eq('cycle_id', cycleId!)
        .order('layer_order');
      if (error) throw error;
      return (data as any[]).map((cb) => ({
        ...cb,
        book: cb.book as Book,
      })) as CycleBook[];
    },
  });
}

export function useBookLinks(cycleId: string | undefined) {
  return useQuery({
    queryKey: ['book-links', cycleId],
    enabled: !!cycleId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('book_links')
        .select('*');
      if (error) throw error;
      return data as BookLink[];
    },
  });
}

export function useBook(bookId: string | undefined) {
  return useQuery({
    queryKey: ['book', bookId],
    enabled: !!bookId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId!)
        .single();
      if (error) throw error;
      return data as Book;
    },
  });
}

export function useBookLessons(bookId: string | undefined) {
  return useQuery({
    queryKey: ['book-lessons', bookId],
    enabled: !!bookId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons_album')
        .select('*')
        .eq('book_id', bookId!)
        .order('week_number');
      if (error) throw error;
      return data as LessonAlbum[];
    },
  });
}

export function useAllBooks() {
  return useQuery({
    queryKey: ['all-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('category, title');
      if (error) throw error;
      return data as Book[];
    },
  });
}

export function useAllCycles() {
  return useQuery({
    queryKey: ['all-cycles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cycles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Cycle[];
    },
  });
}
