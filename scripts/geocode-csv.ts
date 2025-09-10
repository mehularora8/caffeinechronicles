// scripts/geocode-csv.ts
import { parse } from 'csv-parse/sync';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Free geocoding using Nominatim (OpenStreetMap)
async function geocodeAddress(address: string): Promise<{lat: number, lon: number} | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CaffeineChronicles/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error geocoding address "${address}":`, error);
    return null;
  }
}

// Add delay between requests to be respectful to the API
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function geocodeCSV(inputPath: string, outputPath: string) {
  try {
    console.log('Reading CSV file...');
    const csvPath = path.join(__dirname, inputPath);
    const fileContent = readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const rawRecords = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    console.log(`Found ${rawRecords.length} records to geocode`);
    
    const geocodedRecords = [];
    
    for (let i = 0; i < rawRecords.length; i++) {
      const record = rawRecords[i];
      console.log(`Geocoding ${i + 1}/${rawRecords.length}: ${record.Name}`);
      
      // Geocode the location
      const coordinates = await geocodeAddress(record.Location);
      
      // Add coordinates to record
      const geocodedRecord = {
        ...record,
        coordinates: coordinates ? `{'lat': ${coordinates.lat}, 'lon': ${coordinates.lon}}` : null
      };
      
      geocodedRecords.push(geocodedRecord);
      
      // Add delay to be respectful to the API (1 second between requests)
      if (i < rawRecords.length - 1) {
        await delay(1000);
      }
    }
    
    // Write geocoded CSV
    const outputCsvPath = path.join(__dirname, outputPath);
    
    // Create CSV manually
    const headers = Object.keys(geocodedRecords[0]);
    const csvLines = [headers.join(',')];
    
    geocodedRecords.forEach(record => {
      const values = headers.map(header => {
        const value = record[header];
        // Escape commas and quotes in CSV values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csvLines.push(values.join(','));
    });
    
    const csvOutput = csvLines.join('\n');
    writeFileSync(outputCsvPath, csvOutput);
    
    console.log(`Geocoding complete! Output saved to: ${outputPath}`);
    
    // Show summary
    const successful = geocodedRecords.filter(r => r.coordinates !== null).length;
    const failed = geocodedRecords.length - successful;
    console.log(`Successfully geocoded: ${successful}/${geocodedRecords.length}`);
    if (failed > 0) {
      console.log(`Failed to geocode: ${failed} records`);
    }
    
  } catch (error) {
    console.error('Error processing CSV:', error);
    process.exit(1);
  }
}

// Run the geocoding
geocodeCSV('../data/raw/cafes-sep10.csv', '../data/cafes_geocoded_new.csv'); 