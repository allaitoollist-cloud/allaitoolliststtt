
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach((line) => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim();
            if (key && value) {
                process.env[key] = value;
            }
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanData() {
    console.log('Starting cleanup...');

    // 1. Fetch all tools
    // We'll process them in batches or just fetch ID, name, short_description, full_description, category
    // Since we have ~1000 tools, fetching all is fine for a one-off script.
    let { data: tools, error } = await supabase
        .from('tools')
        .select('*');

    if (error) {
        console.error('Error fetching tools:', error);
        return;
    }

    if (!tools || tools.length === 0) {
        console.log('No tools found.');
        return;
    }

    console.log(`Processing ${tools.length} tools...`);

    const updates: any[] = [];

    for (const tool of tools) {
        let needsUpdate = false;
        let newName = tool.name;
        let newShortDesc = tool.short_description;
        let newFullDesc = tool.full_description;
        let newCategory = tool.category;

        // Define unwanted terms
        const unwanted = [/aixploria/gi, /AIxploria/g];

        // Helper: Remove unwanted terms
        const cleanText = (text: string | null) => {
            if (!text) return text;
            let cleaned = text;
            unwanted.forEach(regex => {
                cleaned = cleaned.replace(regex, ''); // Remove it
            });
            // Fix double spaces
            return cleaned.replace(/\s+/g, ' ').trim();
        };

        // Clean Fields
        const cleanedName = cleanText(newName);
        if (cleanedName !== newName) { newName = cleanedName; needsUpdate = true; }

        const cleanedShort = cleanText(newShortDesc);
        if (cleanedShort !== newShortDesc) { newShortDesc = cleanedShort; needsUpdate = true; }

        const cleanedFull = cleanText(newFullDesc);
        if (cleanedFull !== newFullDesc) { newFullDesc = cleanedFull; needsUpdate = true; }

        // Special Category Replacement
        if (newCategory === 'AIxploria Selection' || newCategory === 'AIxploria') {
            newCategory = 'All AI Tool List Selection';
            needsUpdate = true;
        } else {
            // Just clean other categories if they contain the word
            const cleanedCat = cleanText(newCategory);
            if (cleanedCat !== newCategory) {
                newCategory = cleanedCat;
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            updates.push({
                ...tool, // KEEP ALL ORIGINAL FIELDS
                name: newName,
                short_description: newShortDesc,
                full_description: newFullDesc,
                category: newCategory,
                updated_at: new Date().toISOString() // Good practice to timestamp
            });
        }
    }

    console.log(`Found ${updates.length} tools needing updates.`);

    // Perform Updates in Batches
    const BATCH_SIZE = 50;
    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
        const batch = updates.slice(i, i + BATCH_SIZE);
        const { error: optionsError } = await supabase.from('tools').upsert(batch);

        if (optionsError) {
            console.error(`Error updating batch ${i}:`, optionsError);
        } else {
            console.log(`Updated batch ${i / BATCH_SIZE + 1}`);
        }
    }

    console.log('Cleanup complete!');
}

cleanData();
