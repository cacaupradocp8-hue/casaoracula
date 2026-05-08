import re

with open('/mnt/documents/bloco_02a_functions_pre_tables_SAFE_v4.sql', 'r') as f:
    content = f.read()

# Split by function
funcs = content.split('CREATE OR REPLACE FUNCTION')

issues = 0
for func in funcs[1:]:
    if 'SECURITY DEFINER' in func:
        if 'SET search_path' not in func:
            print(f"Missing search_path in function starting with: {func[:100].strip()}")
            issues += 1

print(f"Total SECURITY DEFINER without search_path: {issues}")
