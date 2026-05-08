import re

with open('/mnt/documents/schema_only_cleaned.sql', 'r') as f:
    content = f.read()

patterns = [
    r'heroina_\w+',
    r'jornada_heroina_\w+',
    r'mapa_heroina',
    r'agentes',
    r'agente_\w+',
    r'ai_\w+',
    r'syntheia_\w+',
    r'labirinto_\w+',
    r'labyrinth_records',
    r'client_labyrinths',
    r'sessoes_labirinto',
    r'posts_mentoria',
    r'mentora_\w+'
]

selected_tables = []
for p in patterns:
    matches = re.findall(r'CREATE TABLE public\.(' + p + r')\s*\(', content)
    selected_tables.extend(matches)

selected_tables = sorted(list(set(selected_tables)))

# Exclude tables already in B03, B04, B05
b03 = {'profiles', 'user_roles', 'app_settings', 'ai_global_settings', 'matriculas', 'matriculas_pendentes', 'access_expiration_logs', 'admin_action_history', 'admin_automation_audit', 'admin_automation_rules', 'automation_alerts', 'automation_execution_logs', 'automation_rules', 'automation_settings', 'notifications', 'notification_preferences', 'notification_logs', 'push_subscriptions', 'clientes', 'oracle_clients'}
# For B04 and B05, I should ideally get them from the files or a known list.
# Based on earlier script:
# created = b03 | b04 | b05
# Let's use the actual set from the previous run.

# To be safe, I will re-run the part that gathers created tables.
import os

def get_tables(file_path):
    if not os.path.exists(file_path): return set()
    with open(file_path, 'r') as f:
        content = f.read()
    return set(re.findall(r'CREATE TABLE IF NOT EXISTS public\.(\w+)', content))

created = get_tables('/mnt/documents/bloco_03_tables_core.sql') | \
          get_tables('/mnt/documents/bloco_04_tables_editorial_formacao_clube.sql') | \
          get_tables('bloco_05_tables_dominios_especificos.sql')

print(f"Created tables count: {len(created)}")
if 'ai_global_settings' in created:
    print("ai_global_settings is in created")
else:
    print("ai_global_settings NOT in created")

selected_tables = [t for t in selected_tables if t not in created]
selected_tables = sorted(list(set(selected_tables)))

output = [
    '-- bloco_06_tables_jardins_ia.sql',
    '-- Jardins (Heroína/Psique/Ofício), IA (agentes/syntheia), Labirinto',
    '-- Depende de: 01, 02a, 03, 04, 05',
    '-- Idempotente: CREATE TABLE IF NOT EXISTS + ADD CONSTRAINT PK/UK via DO block\n'
]

pk_uk_names = []

for table in selected_tables:
    pattern = r'CREATE TABLE public\.' + table + r'\s*\((?:[^;]|(?:\'[^\']*\'))*\);'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        table_def = match.group(0)
        table_def = table_def.replace(f'CREATE TABLE public.{table}', f'CREATE TABLE IF NOT EXISTS public.{table}')
        output.append(f'-- ========== {table} ==========')
        output.append(table_def)
        output.append('')
        
        constraint_pattern = r'ALTER TABLE ONLY public\.' + table + r'\s+ADD CONSTRAINT (\w+)\s+(PRIMARY KEY|UNIQUE)\s*\([^;]+\);'
        constraints = re.finditer(constraint_pattern, content)
        for c in constraints:
            con_name = c.group(1)
            con_def = c.group(0)
            pk_uk_names.append(con_name)
            
            do_block = f"DO $$ BEGIN\n  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '{con_name}') THEN\n    {con_def}\n  END IF;\nEND $$;"
            output.append(do_block)
            output.append('')

output.append('-- ========== Validação ==========')
tables_list = ', '.join([f"'{t}'" for t in selected_tables])
output.append(f"SELECT count(*) AS bloco_06_tables_present FROM pg_tables WHERE schemaname = 'public' AND tablename IN ({tables_list});")

cons_list = ', '.join([f"'{c}'" for c in pk_uk_names])
output.append(f"SELECT count(*) AS bloco_06_pk_uk_constraints FROM pg_constraint WHERE conname IN ({cons_list});")

with open('bloco_06_tables_jardins_ia.sql', 'w') as f:
    f.write('\n'.join(output))
