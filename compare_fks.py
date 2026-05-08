import json

with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

# Group by status check
# We will generate a python script that calls read_query (via an internal representation) 
# or just compares with the full list of constraints.

# Let's get the full list of constraints first.
print("GET_ALL_CONSTRAINTS")
