
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

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start
        .replace(/-+$/, '');      // Trim - from end
}

async function populateSlugs() {
    console.log('Fetching tools...');
    // Fetch required fields to satisfy NOT NULL constraints during upsert
    // We select * to get everything.
    const { data: tools, error } = await supabase
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
    const usedSlugs = new Set<string>();

    for (const tool of tools) {
        let baseSlug = slugify(tool.name);
        if (!baseSlug) baseSlug = 'tool-' + tool.id.substring(0, 8); // Fallback

        let slug = baseSlug;
        let counter = 1;

        // Ensure uniqueness within this batch
        while (usedSlugs.has(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        usedSlugs.add(slug);

        if (tool.slug !== slug) {
            updates.push({
                ...tool, // Include all original fields
                slug: slug,
                updated_at: new Date().toISOString()
            });
        }
    }

    console.log(`Found ${updates.length} tools needing slug updates.`);

    // Update in batches
    const BATCH_SIZE = 50;
    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
        const batch = updates.slice(i, i + BATCH_SIZE);
        const { error: optionsError } = await supabase.from('tools').upsert(batch);

        if (optionsError) {
            console.error(`Error updating batch ${i}:`, optionsError);
        } else {
            console.log(`Updated batch ${i / BATCH_SIZE + 1} (${batch.length} items)`);
        }
    }

    console.log('Slug population complete!');
}

populateSlugs();
