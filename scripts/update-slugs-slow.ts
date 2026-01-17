
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
    if (!text) return '';
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

async function updateSlugsSlow() {
    console.log('Fetching tools...');
    const { data: tools, error } = await supabase
        .from('tools')
        .select('id, name, slug');

    if (error) {
        console.error('Error fetching tools:', error);
        return;
    }

    if (!tools || tools.length === 0) {
        console.log('No tools found.');
        return;
    }

    console.log(`Processing ${tools.length} tools...`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const tool of tools) {
        // If slug is already valid, skip
        if (tool.slug && tool.slug.length > 0) continue;

        let baseSlug = slugify(tool.name);
        if (!baseSlug) baseSlug = 'tool-' + tool.id.substring(0, 8);

        // Simple slug for now, collision handling is tricky without checking DB, 
        // but usually names are distinct enough or we can append random chars if collision (handled by constraint?)
        // We don't have a unique constraint on slug yet? The logs didn't show one.
        // Let's assume unique names mostly.

        // Attempt update
        const { error: updateError } = await supabase
            .from('tools')
            .update({ slug: baseSlug })
            .eq('id', tool.id);

        if (updateError) {
            console.error(`Error updating tool ${tool.name}:`, updateError);
            errorCount++;
        } else {
            updatedCount++;
            if (updatedCount % 20 === 0) process.stdout.write('.');
        }
    }

    console.log(`\nUpdate complete.`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Errors: ${errorCount}`);
}

updateSlugsSlow();
