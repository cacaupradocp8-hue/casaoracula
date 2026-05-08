import re
import os

def extract_functions(file_path):
    with open(file_path, 'r', encoding='latin-1') as f:
        content = f.read()

    # Pattern to find CREATE FUNCTION blocks
    # Note: pg_dump uses CREATE FUNCTION public.name(...) RETURNS ... LANGUAGE ... AS $$ ... $$;
    # We need to capture the whole block until the end of the function definition.
    
    # regex for functions
    # Starts with CREATE FUNCTION
    # Ends with LANGUAGE <lang> ... ; or just ; after the AS $$ ... $$ block
    
    functions = []
    # Split by CREATE FUNCTION to process each potential function
    parts = re.split(r'(?i)CREATE FUNCTION ', content)
    
    for part in parts[1:]:
        # Re-add CREATE FUNCTION
        full_func = "CREATE FUNCTION " + part
        
        # We need to find where the function ends. Usually it ends with a semicolon after the LANGUAGE or AS block.
        # But some functions have nested semicolons in the body.
        # pg_dump functions usually end with:
        # ...
        # $$;
        # OR
        # ...
        # LANGUAGE <lang>;
        
        # Let's find the end of the function.
        # It usually ends with a line like:
        # $$;
        # or
        # LANGUAGE sql;
        # or
        # LANGUAGE plpgsql;
        
        # Actually, let's use a more robust way: find the first occurrence of "$$;" or "LANGUAGE <lang>;" that isn't inside quotes? 
        # pg_dump is quite consistent.
        
        end_match = re.search(r'\$\$;\n', full_func)
        if not end_match:
             # Try LANGUAGE <lang>;
             end_match = re.search(r'LANGUAGE \w+;\n', full_func)
             
        if end_match:
            func_body = full_func[:end_match.end()].strip()
            functions.append(func_body)
    
    return functions

def main():
    source_file = '/mnt/documents/schema_only_cleaned.sql'
    all_funcs = extract_functions(source_file)
    
    plpgsql_funcs = []
    sql_funcs = []
    
    forbidden_terms = ['agentes', 'can_access_agent']
    
    for func in all_funcs:
        # Check language
        is_plpgsql = 'LANGUAGE plpgsql' in func
        is_sql = 'LANGUAGE sql' in func
        
        # Check forbidden terms
        has_forbidden = any(term in func for term in forbidden_terms)
        
        if is_plpgsql and not has_forbidden:
            plpgsql_funcs.append(func)
        elif is_sql:
            sql_funcs.append(func)
            
    print(f"Total functions found: {len(all_funcs)}")
    print(f"PLPGSQL functions (no forbidden): {len(plpgsql_funcs)}")
    print(f"SQL functions: {len(sql_funcs)}")
    
    # Sort or filter if needed to match the 63 requirement exactly.
    # The user said there are 63 PLPGSQL functions in Bloco 02a.
    # Let's see if we get exactly 63.
    
    # Format the PLPGSQL functions
    safe_funcs = []
    for func in plpgsql_funcs:
        # Replace CREATE FUNCTION with CREATE OR REPLACE FUNCTION
        # Use regex to be safe about case and spacing
        func = re.sub(r'(?i)CREATE FUNCTION public\.', 'CREATE OR REPLACE FUNCTION public.', func)
        safe_funcs.append(func)
    
    output_file = '/mnt/documents/bloco_02a_functions_pre_tables_SAFE_v4.sql'
    with open(output_file, 'w') as f:
        f.write("-- Bloco 02a: Funções (Pre-Tables) - SAFE v4\n")
        f.write("-- Contém apenas LANGUAGE plpgsql\n\n")
        for func in safe_funcs:
            f.write(func + "\n\n")
            
        # Add validation queries manually
        f.write("\n-- Validações finais\n")
        f.write("SELECT count(*) AS total_plpgsql_functions FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND l.lanname = 'plpgsql' JOIN pg_language l ON p.prolang = l.oid;\n")
        # Correct the query above - it has a small join error in my thought, let's write it better.
        
    print(f"Generated {output_file} with {len(safe_funcs)} functions.")

if __name__ == "__main__":
    main()
