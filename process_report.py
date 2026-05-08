import json
import re

# Load all FKs from the original source
with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

# The user provided the consolidated summary from their dry-run execution:
# EXISTS: 144
# MISSING_SOURCE_TABLE: 217
# MISSING_TARGET_TABLE: 23 (Some might overlap)
# TOTAL analyzed: 384

# Since I don't have the actual tabular output (it was executed by the user), 
# I will use the status definitions from the dry-run script logic to identify which is which.
# Logic from dry-run script:
# EXISTS: Table exists AND constraint name exists
# MISSING_SOURCE_TABLE: Source table does not exist
# MISSING_TARGET_TABLE: Target table does not exist
# READY_TO_CREATE: Source exists, Target exists, Constraint name does not exist, and types match.

# Wait, the user said they ran the scripts and got that summary.
# I need to identify which tables are missing based on what's NOT in the current database.
# But wait, I don't have direct access to the database tables to "check" them myself here.
# HOWEVER, the user said: "Total analisado: 384 FKs", "MISSING_SOURCE_TABLE: 217", "MISSING_TARGET_TABLE: 23".
# They want me to generate a report and a script for MISSING tables.
# To know WHICH tables are missing, I can't just guess. 
# But I can parse schema_only_cleaned.sql to see ALL tables and compare with what's in fks_from_schema.json.
# Actually, if I am to "compare missing tables with schema_only_cleaned.sql", it implies that some tables in fks_from_schema.json are NOT in the current DB, but are defined in schema_only_cleaned.sql.

# Let's read schema_only_cleaned.sql to get all table definitions.
with open('schema_only_cleaned.sql', 'r') as f:
    schema_sql = f.read()

# Extract CREATE TABLE blocks including PK/UK
# This is a bit complex with regex, but we need the full definition of missing tables.
table_definitions = {}
# Simple regex to find CREATE TABLE and its body until the next top-level command or semicolon-newline
# We want to catch the whole block including PK/UK.
# Tables usually end with );
matches = re.finditer(r'CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(?:public\.)?(\w+)\s*\((.*?)\);', schema_sql, re.DOTALL | re.IGNORECASE)
for match in matches:
    table_name = match.group(1).lower()
    full_body = match.group(0)
    # Filter out Foreign Keys from the body if they are inside (though typically they are separate ALTER TABLE)
    # The user asked for ONLY CREATE TABLE and PK/UK.
    table_definitions[table_name] = full_body

# Now we need to know WHICH tables are missing.
# Since I can't run SQL to check the DB, I have to rely on the fks_from_schema.json.
# If I had the output of the dry-runs, I'd know exactly which ones.
# Since I don't, I will write a script to re-run the logic of the dry-run but using a "current_tables" list.
# How do I get current_tables?
# The user said 213 tables exist in Supabase (from previous message #5597).
# I'll try to find a way to get the list of existing tables. 
# I'll run a quick SQL query to get them if possible.
