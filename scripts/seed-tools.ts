
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Manually parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach((line) => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim(); // Handle values with =
            if (key && value) {
                process.env[key] = value;
            }
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedTools() {
    const toolsPath = path.resolve(process.cwd(), 'scraped_tools.json');

    if (!fs.existsSync(toolsPath)) {
        console.error('scraped_tools.json not found');
        process.exit(1);
    }

    const rawData = fs.readFileSync(toolsPath, 'utf-8');
    const tools = JSON.parse(rawData);

    console.log(`Found ${tools.length} tools to import/update...`);

    let successCount = 0;
    let errorCount = 0;

    // Process in chunks to avoid overwhelming the API
    const CHUNK_SIZE = 50;
    for (let i = 0; i < tools.length; i += CHUNK_SIZE) {
        const chunk = tools.slice(i, i + CHUNK_SIZE);

        const formattedTools = chunk.map((tool: any) => ({
            name: tool.name ? tool.name.substring(0, 255) : 'Unnamed Tool',
            short_description: tool.short_description || '',
            full_description: tool.full_description || tool.short_description || '',
            url: tool.url || '#',
            category: tool.category || 'Uncategorized',
            tags: tool.tags || [],
            pricing: tool.pricing || 'Unknown',
            views: 0,
            trending: false,
            featured: false,
            verified: false,
            rating: 0,
            review_count: 0
        }));

        // Using insert.
        const { error: insertError } = await supabase.from('tools').insert(formattedTools);

        if (insertError) {
            console.error(`Error inserting chunk ${Math.floor(i / CHUNK_SIZE) + 1}:`, insertError.message);
            errorCount += chunk.length;
        } else {
            console.log(`Inserted chunk ${Math.floor(i / CHUNK_SIZE) + 1} (${chunk.length} items)`);
            successCount += chunk.length;
        }
    }

    console.log(`Finished. Success: ${successCount}, Errors: ${errorCount}`);
}

seedTools();
