import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PAYPAL_PRICES, buildPaypalUrl, isPriceKey } from '@/lib/paypal';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://allaitoollist.com';

export async function POST(req: NextRequest) {
    try {
        const { priceKey, email, metadata = {} } = await req.json();

        if (!priceKey || !isPriceKey(priceKey)) {
            return NextResponse.json({ error: 'Invalid price key' }, { status: 400 });
        }

        const plan = PAYPAL_PRICES[priceKey];

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: order, error } = await supabase
            .from('paypal_orders')
            .insert({
                price_key: priceKey,
                amount: plan.amount,
                label: plan.label,
                email: email || null,
                metadata,
                status: 'pending',
            })
            .select('id')
            .single();

        if (error) {
            console.error('Failed to create paypal order:', error);
            return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }

        const paypalUrl = buildPaypalUrl(plan.amount);
        const successUrl = `${SITE_URL}${plan.successPath}?order_id=${order.id}`;

        return NextResponse.json({
            paypalUrl,
            orderId: order.id,
            amount: plan.amount,
            label: plan.label,
            successUrl,
        });

    } catch (err: any) {
        console.error('PayPal checkout error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
