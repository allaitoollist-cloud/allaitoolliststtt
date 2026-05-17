import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature');
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

        if (!signature || !secret) {
            return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
        }

        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature, 'utf8');

        if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta.event_name;
        
        if (eventName === 'order_created') {
            const customData = payload.meta.custom_data || {};
            const { priceKey, toolSlug } = customData;

            // Handle featured tool sponsorship
            if (priceKey === 'featured_tool' && toolSlug) {
                const { error } = await supabase
                    .from('tools')
                    .update({ featured: true, trending: true })
                    .eq('slug', toolSlug);
                    
                if (error) {
                    console.error('Supabase update error:', error);
                    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Webhook error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
