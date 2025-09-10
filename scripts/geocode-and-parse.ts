// scripts/geocode-and-parse.ts
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

// Parse thoughts field to extract ratings and separate vibe/taste thoughts
function parseThoughts(thoughts: string): {
  vibeRating: number | null;
  tasteRating: number | null;
  vibeThoughts: string;
  tasteThoughts: string;
} {
  // Extract vibe rating and thoughts
  const vibeMatch = thoughts.match(/Vibe:\s*(\d+)\s*\/?\s*\d*\.?\s*(.*?)(?=Taste:|$)/is);
  const tasteMatch = thoughts.match(/Taste:\s*(\d+)\s*\/?\s*\d*\.?\s*(.*?)$/is);
  
  return {
    vibeRating: vibeMatch ? parseInt(vibeMatch[1]) : null,
    tasteRating: tasteMatch ? parseInt(tasteMatch[1]) : null,
    vibeThoughts: vibeMatch ? vibeMatch[2].trim().replace(/^[:.]\s?/g, '') : '',
    tasteThoughts: tasteMatch ? tasteMatch[2].trim().replace(/^[:.]\s?/g, '') : ''
  };
}

// Add delay between requests to be respectful to the API
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processRawCSV(inputPath: string, outputPath: string) {
  try {
    console.log('Reading raw CSV file...');
    const csvPath = path.join(__dirname, inputPath);
    const fileContent = readFileSync(csvPath, 'utf-8');
    
    // Parse CSV with proper multiline handling
    const rawRecords = parse(fileContent, {
      columns: (headers: string[]) => headers.map((h: string) => h.replace(/^\uFEFF/, '')), // Remove BOM from column names
      skip_empty_lines: true,
      relax_quotes: true,
      escape: '"',
      quote: '"'
    });

    console.log(`Found ${rawRecords.length} records to process`);
    
    const processedRecords = [];
    
    for (let i = 0; i < rawRecords.length; i++) {
      const record = rawRecords[i];
      

      
      console.log(`Processing ${i + 1}/${rawRecords.length}: ${record.Name || 'MISSING NAME'}`);
      
      // Skip records with missing name (but allow empty strings)
      if (!record.Name || record.Name.trim() === '') {
        console.warn(`Skipping record ${i + 1} - missing or empty name`);
        continue;
      }
      
      // Parse thoughts to extract ratings and separate thoughts
      const parsedThoughts = parseThoughts(record.Thoughts || '');
      
      // Geocode the location
      const coordinates = await geocodeAddress(record.Location);
      
      // Transform to match expected format
      const processedRecord = {
        name: record.Name,
        thoughts: record.Thoughts,
        city: record.City,
        visit_again: record['Visit again?'],
        location: record.Location,
        coordinates: coordinates ? `{'lat': ${coordinates.lat}, 'lon': ${coordinates.lon}}` : null,
        vibe_rating: parsedThoughts.vibeRating,
        taste_rating: parsedThoughts.tasteRating,
        vibe_thoughts: parsedThoughts.vibeThoughts,
        taste_thoughts: parsedThoughts.tasteThoughts
      };
      
      processedRecords.push(processedRecord);
      
      // Add delay to be respectful to the API (1 second between requests)
      if (i < rawRecords.length - 1) {
        await delay(1000);
      }
    }
    
    // Write processed CSV
    const outputCsvPath = path.join(__dirname, outputPath);
    
    // Create CSV manually
    const headers = Object.keys(processedRecords[0]);
    const csvLines = [headers.join(',')];
    
    processedRecords.forEach(record => {
      const values = headers.map(header => {
        const value = (record as any)[header];
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
    
    console.log(`Processing complete! Output saved to: ${outputPath}`);
    
    // Show summary
    const successful = processedRecords.filter(r => r.coordinates !== null).length;
    const failed = processedRecords.length - successful;
    console.log(`Successfully geocoded: ${successful}/${processedRecords.length}`);
    if (failed > 0) {
      console.log(`Failed to geocode: ${failed} records`);
    }
    
    // Show parsing summary
    const vibeRatings = processedRecords.filter(r => r.vibe_rating !== null).length;
    const tasteRatings = processedRecords.filter(r => r.taste_rating !== null).length;
    console.log(`Successfully parsed vibe ratings: ${vibeRatings}/${processedRecords.length}`);
    console.log(`Successfully parsed taste ratings: ${tasteRatings}/${processedRecords.length}`);
    
  } catch (error) {
    console.error('Error processing CSV:', error);
    process.exit(1);
  }
}

// Run the complete processing pipeline
processRawCSV('../data/raw/cafes-sep10.csv', '../data/cafes_fully_processed_20250910.csv'); 