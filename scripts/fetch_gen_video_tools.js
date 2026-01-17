const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load Env
function loadEnv() {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (!fs.existsSync(envPath)) return {};
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        const idx = line.indexOf('=');
        if (idx !== -1) {
            env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/"/g, '');
        }
    });
    return env;
}

const env = loadEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fetchVideoTools() {
    // Fetch tools in 'Generative Video' or related tags
    // Note: Searching strictly might miss some if categories are loose.
    // We'll search for 'Video' in name or description or category.
    const { data, error } = await supabase
        .from('tools')
        .select('id, name, full_description, category')
        .or('category.ilike.%Video%,tags.cs.{Video}')
        .limit(10);

    if (error) {
        console.error(error);
        return;
    }

    console.log("--- TOP GENERATIVE VIDEO TOOLS (Current State) ---");
    data.forEach((tool, i) => {
        const desc = tool.full_description ? tool.full_description.substring(0, 100).replace(/\n/g, ' ') + '...' : 'No description';
        console.log(`${i + 1}. ${tool.name}`);
        console.log(`   Current: "${desc}"`);
    });
}

fetchVideoTools();
