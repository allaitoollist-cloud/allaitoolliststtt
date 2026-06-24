import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

// Admin-only: mark a PayPal order as verified after checking PayPal dashboard
export async function POST(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    try {
        const { orderId, txnId, action } = await req.json();

        if (!orderId || !action) {
            return NextResponse.json({ error: 'orderId and action required' }, { status: 400 });
        }

        if (!['verify', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'action must be verify or reject' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const newStatus = action === 'verify' ? 'verified' : 'rejected';

        const { data: order, error: fetchError } = await supabase
            .from('paypal_orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const { error: updateError } = await supabase
            .from('paypal_orders')
            .update({
                status: newStatus,
                paypal_txn_id: txnId || null,
                verified_at: new Date().toISOString(),
            })
            .eq('id', orderId);

        if (updateError) {
            return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
        }

        // On verify: apply the benefit based on price_key
        if (action === 'verify') {
            const { price_key, metadata } = order;
            const toolSlug = metadata?.toolSlug;

            if (price_key?.startsWith('verified_') && toolSlug) {
                const plan = price_key.replace('verified_', '');
                await supabase
                    .from('tools')
                    .update({ verified: true, verified_plan: plan, verified_at: new Date().toISOString() })
                    .eq('slug', toolSlug);
            }

            if (price_key === 'featured_tool' && toolSlug) {
                await supabase
                    .from('tools')
                    .update({ featured: true, trending: true })
                    .eq('slug', toolSlug);
            }

            if (price_key?.startsWith('job_')) {
                await supabase.from('job_orders').insert({
                    paypal_order_id: orderId,
                    plan: price_key.replace('job_', ''),
                    email: order.email,
                    status: 'paid',
                    amount: order.amount,
                });
            }

            if (price_key?.startsWith('api_')) {
                await supabase.from('api_subscriptions').insert({
                    paypal_order_id: orderId,
                    plan: price_key.replace('api_', ''),
                    email: order.email,
                    status: 'active',
                    created_at: new Date().toISOString(),
                });
            }
        }

        return NextResponse.json({ success: true, status: newStatus });

    } catch (err: any) {
        console.error('PayPal verify error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
