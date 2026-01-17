const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load Environment Variables from .env.local
function loadEnv() {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (!fs.existsSync(envPath)) {
        console.error('❌ .env.local not found. Please ensure it exists in the root directory.');
        process.exit(1);
    }
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
        // Basic parser: handles KEY=VALUE, ignores comments
        line = line.trim();
        if (!line || line.startsWith('#')) return;

        // Split on first = only
        const idx = line.indexOf('=');
        if (idx !== -1) {
            const key = line.substring(0, idx).trim();
            let value = line.substring(idx + 1).trim();
            // Remove double quotes if wrapping the value
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            env[key] = value;
        }
    });
    return env;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Supabase credentials missing in .env.local');
    console.log('Found keys:', Object.keys(env));
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Quantitative Density Analysis
async function auditContent() {
    console.log('🔍 Starting Quantitative Density Audit (2025 Standard)...');
    console.log('   Target: 3+ Data Points (Numbers, Dates, Prices) in First 100 Words');

    const { data: tools, error } = await supabase
        .from('tools')
        .select('name, full_description, slug, technical_attributes')
        .not('full_description', 'is', null) // Only check tools with descriptions
        .limit(100); // Check top 100 for now

    if (error) {
        console.error('Error fetching tools:', error);
        return;
    }

    console.log(`Checking ${tools.length} tools...`);
    let passedCount = 0;
    let failedCount = 0;

    tools.forEach(tool => {
        // Extract first paragraph or first 100 words
        const text = tool.full_description || '';
        // simple heuristic: first 500 chars usually contains first paragraph
        const firstChunk = text.substring(0, 800);
        // Try to split by double newline
        const firstParagraph = firstChunk.split(/\n\s*\n/)[0].trim();

        // Get first 100 words
        const first100Words = firstParagraph.split(/\s+/).slice(0, 100).join(' ');

        // Metrics to count
        // Matches: 
        // - Digits/Decimals (10, 4.5)
        // - Currency ($10)
        // - Years (2025)
        // - Versions (v1, v2.0)
        // - Resolutions (4K, 1080p - covered by digit or alphanum patterns)
        // - Times (60fps - covered by digit)
        const quantitativeRegex = /(\d+(\.\d+)?)|(\$\d+)|(v\d+)|(202[0-9])/g;

        const matches = first100Words.match(quantitativeRegex) || [];
        const count = matches.length;

        const PASS_THRESHOLD = 3;

        if (count >= PASS_THRESHOLD) {
            passedCount++;
        } else {
            failedCount++;
            // console.log(`\n❌ [FAIL] ${tool.name} (Density: ${count})`);
            // console.log(`   Snippet: "${first100Words.substring(0, 60)}..."`);
        }
    });

    console.log('\n========================================');
    console.log(`✅ Audit Complete.`);
    console.log(`📊 Stats: ${passedCount} Passed | ${failedCount} Failed`);
    console.log(`🎯 Pass Rate: ${Math.round((passedCount / tools.length) * 100)}%`);
    console.log('========================================');

    if (failedCount > 0) {
        console.log('To fix FAILs: Add pricing ($), years (2024), versions (v2), or specs (4K) to the FIRST paragraph.');
    }
}

auditContent();
