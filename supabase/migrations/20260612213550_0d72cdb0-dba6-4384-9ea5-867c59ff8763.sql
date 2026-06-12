ALTER TABLE public.clube_v3_station_audios
  ADD COLUMN IF NOT EXISTS destino text NOT NULL DEFAULT 'escuta_ritual';

CREATE INDEX IF NOT EXISTS idx_clube_v3_station_audios_station_destino
  ON public.clube_v3_station_audios (station_id, destino);