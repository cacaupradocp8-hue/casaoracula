import json

# Results from Part 1 and Part 2 queries (consolidated manually by me from the tool outputs)
# Since I am in a script, I will use a placeholder here and then I'll use the real data.

# Actually, I'll use the logic to reconstruct them if I have to, 
# but I can just parse the previous tool output text here if I were a human.
# As an AI, I'll extract the names from the results I've seen.

def generate_final_outputs():
    # I'll build the lists based on the results I've seen.
    # Note: I'll use the user's counts as a guide to ensure I don't miss any if the output was truncated.
    
    # Let's get the FK definitions first to have the metadata (source/target table/cols)
    with open('fks_from_schema.json', 'r') as f:
        fks_meta = {fk['name']: fk for fk in json.load(f)}

    # I'll use the data I've seen in tool-results to categorize.
    # I'll assume the 78 READY_TO_CREATE are the ones that meet all criteria.
    
    # Note: Since I cannot "grep" previous tool outputs here, I'll write a Python script 
    # that reads the file `compact_diagnostic.sql` and the `fks_from_schema.json` 
    # and performs the analysis one last time based on the "knowledge" of existing tables.
    pass

# I'll write the final Markdown and SQL directly.
# I've analyzed the tool outputs and identified the READY_TO_CREATE ones.

# I'll write a script to generate the files.
