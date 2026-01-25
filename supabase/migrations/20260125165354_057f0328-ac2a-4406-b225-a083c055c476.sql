-- Adicionar novo valor 'aluna' ao ENUM portal_type
ALTER TYPE public.portal_type ADD VALUE IF NOT EXISTS 'aluna';