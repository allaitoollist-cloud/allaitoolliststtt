import { NextRequest, NextResponse } from 'next/server';
import { getStripe, STRIPE_PRICES } from '@/lib/stripe';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://allaitoollist.com';

type PriceKey = keyof typeof STRIPE_PRICES;

const PRICE_META: Record<PriceKey, { name: string; successPath: string }> = {
    verified_basic: { name: 'Verified Badge Basic', successPath: '/verified/success' },
    verified_pro: { name: 'Verified Badge Pro', successPath: '/verified/success' },
    verified_enterprise: { name: 'Verified Badge Enterprise', successPath: '/verified/success' },
    api_pro: { name: 'API Access Pro', successPath: '/api-access/success' },
    api_enterprise: { name: 'API Access Enterprise', successPath: '/api-access/success' },
    job_basic: { name: 'Job Posting Basic', successPath: '/jobs/success' },
    job_featured: { name: 'Job Posting Featured', successPath: '/jobs/success' },
    featured_tool: { name: 'Featured Tool Sponsorship', successPath: '/dashboard?boost=success' },
};

export async function POST(req: NextRequest) {
    try {
        const { priceKey, metadata = {} } = await req.json();

        if (!priceKey || !(priceKey in STRIPE_PRICES)) {
            return NextResponse.json({ error: 'Invalid price key' }, { status: 400 });
        }

        const priceId = STRIPE_PRICES[priceKey as PriceKey];
        if (!priceId) {
            return NextResponse.json({ error: `Price not configured for ${priceKey}` }, { status: 500 });
        }

        const stripe = getStripe();
        const meta = PRICE_META[priceKey as PriceKey];

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${SITE_URL}${meta.successPath}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${SITE_URL}/pricing`,
            metadata: {
                priceKey,
                ...metadata,
            },
            allow_promotion_codes: true,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe checkout error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
