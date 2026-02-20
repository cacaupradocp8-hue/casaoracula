UPDATE storage.buckets 
SET file_size_limit = 209715200,
    allowed_mime_types = ARRAY['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp3']
WHERE id = 'audios';