
import fs from 'fs';

async function main() {
    const fks = JSON.parse(fs.readFileSync('fks_from_schema.json', 'utf8'));
    const namesInDb = JSON.parse(fs.readFileSync('names_in_db.json', 'utf8')).map((r: any) => r.conname);
    const namesSet = new Set(namesInDb);

    const exists = fks.filter((f: any) => namesSet.has(f.name));
    console.log('Fks from JSON that exist in DB:', exists.length);
}
