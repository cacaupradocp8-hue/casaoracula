-- Add familia_id column to sala_ferramentas
ALTER TABLE sala_ferramentas 
ADD COLUMN IF NOT EXISTS familia_id uuid REFERENCES travessia_familias(id);

-- Add slug column to travessia_familias for URL routing
ALTER TABLE travessia_familias
ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Add campos extras para a Biblioteca
ALTER TABLE travessia_familias
ADD COLUMN IF NOT EXISTS quando_usar text,
ADD COLUMN IF NOT EXISTS o_que_sustenta text;