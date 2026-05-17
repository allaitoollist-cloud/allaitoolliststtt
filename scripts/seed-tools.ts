
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

        const slugify = (text: string) => {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')     // Replace spaces with -
                .replace(/[^\w-]+/g, '')  // Remove all non-word chars
                .replace(/--+/g, '-')     // Replace multiple - with single -
                .replace(/^-+/, '')       // Trim - from start of text
                .replace(/-+$/, '');      // Trim - from end of text
        };

        const mapCategory = (cat: string) => {
            const c = cat.toLowerCase();
            if (c.includes('image')) return 'Image';
            if (c.includes('video')) return 'Video';
            if (c.includes('audio') || c.includes('music')) return 'Audio';
            if (c.includes('code') || c.includes('developer') || c.includes('github')) return 'Code';
            if (c.includes('writing') || c.includes('text') || c.includes('seo')) return 'Writing';
            if (c.includes('productivity') || c.includes('automation')) return 'Productivity';
            if (c.includes('marketing')) return 'Marketing';
            if (c.includes('design')) return 'Design';
            if (c.includes('business')) return 'Business';
            if (c.includes('education') || c.includes('research')) return 'Education';
            return 'Other';
        };

        const formattedTools = chunk.map((tool: any) => {
            const name = tool.name ? tool.name.substring(0, 255) : 'Unnamed Tool';
            const cleanName = name.split(':')[0].trim(); // Remove "Review & Test" junk from AIxploria titles

            return {
                name: cleanName,
                slug: `${slugify(cleanName)}-${Math.floor(Math.random() * 1000)}`, // Ensure uniqueness
                short_description: tool.short_description || '',
                full_description: tool.full_description || tool.short_description || '',
                url: tool.url || '#',
                category: mapCategory(tool.category || ''),
                tags: tool.tags || [],
                pricing: tool.pricing || 'Unknown',
                views: Math.floor(Math.random() * 500),
                trending: Math.random() > 0.8,
                featured: Math.random() > 0.9,
                verified: Math.random() > 0.5,
                rating: 4 + Math.random(), // High quality directory
                review_count: Math.floor(Math.random() * 20),
                platform: ['Web'],
                is_draft: false,
                date_added: new Date().toISOString()
            };
        });

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
