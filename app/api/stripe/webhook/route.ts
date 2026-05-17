import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
        return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
    }

    let event;
    try {
        const body = await req.text();
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error('Webhook signature error:', err.message);
        return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const { priceKey, toolSlug, email } = session.metadata || {};

        // Handle verified badge purchase
        if (priceKey?.startsWith('verified_') && toolSlug) {
            const plan = priceKey.replace('verified_', '');
            await supabase
                .from('tools')
                .update({ verified: true, verified_plan: plan, verified_at: new Date().toISOString() })
                .eq('slug', toolSlug);
        }

        // Handle featured tool sponsorship
        if (priceKey === 'featured_tool' && toolSlug) {
            await supabase
                .from('tools')
                .update({ featured: true, trending: true })
                .eq('slug', toolSlug);
        }

        // Handle job posting purchase
        if (priceKey?.startsWith('job_')) {
            await supabase.from('job_orders').insert({
                stripe_session_id: session.id,
                plan: priceKey.replace('job_', ''),
                email: session.customer_details?.email || email,
                status: 'paid',
                amount: session.amount_total,
            });
        }

        // Handle API access purchase
        if (priceKey?.startsWith('api_')) {
            const plan = priceKey.replace('api_', '');
            await supabase.from('api_subscriptions').insert({
                stripe_session_id: session.id,
                plan,
                email: session.customer_details?.email || email,
                status: 'active',
                created_at: new Date().toISOString(),
            });
        }
    }

    return NextResponse.json({ received: true });
}
