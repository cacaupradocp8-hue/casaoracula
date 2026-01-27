import { supabase } from '@/integrations/supabase/client';

/**
 * Validates if a URL is a valid audio URL
 */
export function isValidAudioUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  
  // Must start with http:// or https://
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return false;
  }
  
  return true;
}

/**
 * Gets the public URL for an audio file
 * If the input is already a full URL, returns it as-is
 * If it's a relative path, constructs the Supabase storage URL
 */
export function getPublicAudioUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null;
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return null;
  
  // Already a full URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // Build URL from Supabase storage
  const { data } = supabase.storage.from('audios').getPublicUrl(trimmed);
  return data?.publicUrl || null;
}

/**
 * Formats seconds into mm:ss format
 */
export function formatAudioTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
