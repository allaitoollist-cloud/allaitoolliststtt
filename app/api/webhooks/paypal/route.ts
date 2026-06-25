import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logActivity } from '@/lib/log-activity';

const PAYPAL_IPN_URL = process.env.PAYPAL_SANDBOX === 'true'
    ? 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr'
    : 'https://ipnpb.paypal.com/cgi-bin/webscr';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    const rawBody = await req.text();

    // Verify with PayPal IPN
    const verifyRes = await fetch(PAYPAL_IPN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `cmd=_notify-validate&${rawBody}`,
    }).catch(() => null);

    const verifyText = await verifyRes?.text();

    if (verifyText !== 'VERIFIED') {
        console.error('[PayPal IPN] Not verified:', verifyText);
        return NextResponse.json({ error: 'Unverified IPN' }, { status: 400 });
    }

    const params = new URLSearchParams(rawBody);
    const paymentStatus = params.get('payment_status');
    const payerEmail    = (params.get('payer_email') || '').toLowerCase();
    const mcGross       = params.get('mc_gross') || '0';
    const itemName      = params.get('item_name') || '';
    const txnId         = params.get('txn_id') || '';

    // Only process completed payments
    if (paymentStatus !== 'Completed') {
        return NextResponse.json({ received: true, status: paymentStatus });
    }

    const amount = parseFloat(mcGross);
    const plan = amount >= 149 ? 'sponsored' : 'featured';

    // Find pending submission matching payer email
    const { data: submission } = await supabase
        .from('tool_submissions')
        .select('id, tool_name, plan, submitter_email')
        .ilike('submitter_email', payerEmail)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!submission) {
        await logActivity('paypal_payment_unmatched', {
            payer_email: payerEmail,
            amount: mcGross,
            item: itemName,
            txn_id: txnId,
        });
        return NextResponse.json({ received: true, matched: false });
    }

    // Update submission: mark paid + store txn reference
    await supabase
        .from('tool_submissions')
        .update({
            status: 'paid',
            payment_proof_url: `paypal-auto:${txnId}`,
        })
        .eq('id', submission.id);

    await logActivity('paypal_payment_received', {
        tool: submission.tool_name,
        email: payerEmail,
        amount: mcGross,
        plan,
        txn_id: txnId,
        auto: true,
    });

    return NextResponse.json({ received: true, matched: true, tool: submission.tool_name });
}
