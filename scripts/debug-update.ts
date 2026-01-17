
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach((line) => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim();
            process.env[key] = value;
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

async function debugUpdate() {
    const { data: tools } = await supabase.from('tools').select('*').limit(1);
    if (!tools || tools.length === 0) return;
    const tool = tools[0];

    console.log('Attempting to update tool:', tool.name, tool.id);

    const { error } = await supabase
        .from('tools')
        .update({ slug: 'test-slug-debug' })
        .eq('id', tool.id);

    if (error) {
        console.error('Update failed:', JSON.stringify(error, null, 2));
        fs.writeFileSync('debug_error.log', JSON.stringify(error, null, 2));
    } else {
        console.log('Update successful!');
    }
}

debugUpdate();
