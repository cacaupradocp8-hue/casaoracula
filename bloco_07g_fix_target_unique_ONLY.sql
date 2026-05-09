-- bloco_07g_fix_target_unique_ONLY.sql
-- Apenas verificação de unicidade no destino
-- Check unique index on profiles.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'profiles' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on profiles.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'profiles' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on admin_automation_rules.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'admin_automation_rules' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on agentes.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'agentes' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on agente_conversas.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'agente_conversas' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on agentes.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'agentes' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on clientes.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'clientes' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on city_districts.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'city_districts' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on sessions.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'sessions' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on tools.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'tools' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on clientes.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'clientes' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on founding_archetypes.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'founding_archetypes' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on tools.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'tools' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on atelie_templates.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'atelie_templates' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on clientes.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'clientes' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on portais.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'portais' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on labirinto_portas.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'labirinto_portas' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on big5_funcional_dimensoes.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'big5_funcional_dimensoes' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on big5_oracular_fatores.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'big5_oracular_fatores' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on rituais_simbolicos.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'rituais_simbolicos' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on big5_oracular_registros.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'big5_oracular_registros' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on rituais_simbolicos.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'rituais_simbolicos' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on big5_symbolic_forces.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'big5_symbolic_forces' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on session_cases.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'session_cases' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on books.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'books' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

-- Check unique index on books.id
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = 'books' 
AND a.attname = 'id' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);

