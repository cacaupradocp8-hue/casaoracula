-- Step 1: Add new portal types to enum only
ALTER TYPE portal_type ADD VALUE IF NOT EXISTS 'mentorada' AFTER 'visitante';
ALTER TYPE portal_type ADD VALUE IF NOT EXISTS 'aluna_formacao' AFTER 'mentorada';
ALTER TYPE portal_type ADD VALUE IF NOT EXISTS 'assinante' AFTER 'aluna_formacao';
ALTER TYPE portal_type ADD VALUE IF NOT EXISTS 'oracula' AFTER 'assinante';