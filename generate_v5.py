import re
import os

def extract_plpgsql_functions(source_path):
    with open(source_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Split by the comment blocks that usually precede functions in pg_dump
    # or just look for CREATE FUNCTION public.
    
    # regex to match from CREATE FUNCTION public.<name>(<args>) to the ending $$;
    # We need to handle nested $$, which is rare in simple pg_dump but possible.
    # pg_dump is usually:
    # CREATE FUNCTION ...
    # ...
    # AS $$
    # ...
    # $$;
    
    # Let's use a more stateful approach to find the blocks.
    functions = []
    
    # Look for all matches of CREATE FUNCTION public.
    pattern = r'CREATE FUNCTION public\.[a-zA-Z0-9_]+\('
    for match in re.finditer(pattern, content):
        start_idx = match.start()
        # Find the end of the function. 
        # pg_dump functions consistently end with $$; or LANGUAGE sql; or LANGUAGE plpgsql; followed by a semicolon and newline.
        # The most reliable end for plpgsql in this file seems to be $$; followed by whitespace or newline.
        
        # Let's search for the first $$; after start_idx
        end_pos = content.find('$$;', start_idx)
        if end_pos != -1:
            end_idx = end_pos + 4
            func_block = content[start_idx:end_idx].strip()
            functions.append(func_block)
            
    return functions

def main():
    source_file = '/mnt/documents/schema_only_cleaned.sql'
    output_file = '/mnt/documents/bloco_02a_functions_pre_tables_SAFE_v5.sql'
    
    all_extracted = extract_plpgsql_functions(source_file)
    
    plpgsql_clean = []
    forbidden = ['agentes', 'can_access_agent']
    
    for func in all_extracted:
        # Only PLPGSQL
        if 'LANGUAGE plpgsql' not in func:
            continue
            
        # No agentes
        if any(term in func for term in forbidden):
            continue
            
        # Replace CREATE FUNCTION with CREATE OR REPLACE FUNCTION
        # and ensure it's not corrupting signatures
        updated_func = re.sub(r'^CREATE FUNCTION public\.', 'CREATE OR REPLACE FUNCTION public.', func)
        
        # Security Definer check
        if 'SECURITY DEFINER' in updated_func and 'SET search_path' not in updated_func:
            # Inject SET search_path TO 'public' before AS $$
            updated_func = updated_func.replace('AS $$', "SET search_path TO 'public'\n    AS $$")
            
        plpgsql_clean.append(updated_func)
    
    # Sort them or just keep order. Usually order doesn't matter much for 02a if they don't depend on each other much,
    # but keeping discovery order is safest.
    
    # Remove duplicates (sometimes pg_dump has weirdness)
    seen = set()
    final_list = []
    for f in plpgsql_clean:
        # Identify by signature
        sig_match = re.search(r'CREATE OR REPLACE FUNCTION (public\.[a-zA-Z0-9_]+\([^)]*\))', f)
        if sig_match:
            sig = sig_match.group(1)
            if sig not in seen:
                seen.add(sig)
                final_list.append(f)
        else:
            final_list.append(f)

    # We expect 63
    print(f"Functions found: {len(final_list)}")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Bloco 02a: Funções (Pre-Tables) - SAFE v5\n")
        f.write("-- Contém apenas LANGUAGE plpgsql\n\n")
        for func in final_list:
            f.write(func + "\n\n")
            
        # Add final validations manually
        f.write("\n-- Validações finais de integridade\n")
        f.write("SELECT \n")
        f.write("    (SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid JOIN pg_language l ON p.prolang = l.oid WHERE n.nspname = 'public' AND l.lanname = 'plpgsql') AS total_plpgsql_functions,\n")
        f.write("    (SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid JOIN pg_language l ON p.prolang = l.oid WHERE n.nspname = 'public' AND l.lanname = 'sql') AS total_sql_functions;\n")

if __name__ == "__main__":
    main()
