import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (!url || !key) {
            return NextResponse.json({ error: 'Missing config' }, { status: 500 });
        }

        const supabase = createClient(url, key);

        // 1. Create Bucket
        const { data: bucket, error: bucketError } = await supabase.storage.createBucket('tool-screenshots', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
            fileSizeLimit: 5242880 // 5MB
        });

        // 2. Add Policy (Simulated via Public flag above, effectively)
        // Note: 'public: true' in createBucket usually sets up public read. 
        // Detailed RLS for upload still needs SQL, but let's see if this unblocks standard upload.

        if (bucketError) {
            // It might already exist
            if (bucketError.message.includes('already exists')) {
                return NextResponse.json({ success: true, message: 'Bucket already exists, refreshed.' });
            }
            return NextResponse.json({ error: 'Bucket creation failed', details: bucketError }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Storage bucket created successfully.' });

    } catch (e: any) {
        return NextResponse.json({ error: 'Internal Error', details: e.message }, { status: 500 });
    }
}
