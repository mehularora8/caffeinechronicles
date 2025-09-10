// scripts/process-csv.ts
import { parse } from 'csv-parse/sync';
import { readFileSync, writeFileSync } from 'fs';
import { CoffeeShop } from '../src/types/coffee-shop';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and process CSV during build
function processCSV(csv_path: string) {
  try {
    // Read CSV file
    const csvPath = path.join(__dirname, csv_path);
    const fileContent = readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const rawRecords = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Transform data
    const processedData = rawRecords.map((record: any): CoffeeShop => ({
        id: randomBytes(16).toString('hex'),
        ratings: {
            vibe: parseInt(record.vibe_rating),
            taste: parseInt(record.taste_rating),
        },
        thoughts: {
            vibe: record.vibe_thoughts.replace(/^[:.]\s?/g, ''),
            taste: record.taste_thoughts.replace(/^[:.]\s?/g, ''),
        },
        name: record.name,
        city: record.city,
        visitAgain: record.visit_again,
        coordinates: record.coordinates ? JSON.parse(record.coordinates.replace(/'/g, '"')) : null,
        address: record.location,
    }));

    // Write to JSON file that will be bundled with the app
    const outputPath = path.join(__dirname, '../src/data/processed-data.json');
    writeFileSync(outputPath, JSON.stringify(processedData));
    
    console.log('CSV processing complete');
  } catch (error) {
    console.error('Error processing CSV:', error);
    process.exit(1);
  }
}

processCSV('../data/cafes_fully_processed_20250910.csv');