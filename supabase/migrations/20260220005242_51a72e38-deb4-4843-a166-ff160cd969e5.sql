UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp3', 'video/mp4', 'audio/aac']
WHERE id = 'audios';