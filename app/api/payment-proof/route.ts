import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logActivity } from '@/lib/log-activity';
import { sendPaymentProofNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const email = formData.get('email') as string;
        const file = formData.get('file') as File;

        if (!email || !file) {
            return NextResponse.json({ error: 'Email and file required' }, { status: 400 });
        }

        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.type)) {
            return NextResponse.json({ error: 'Only image files allowed (JPG, PNG, WEBP)' }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        // Find the latest pending submission for this email
        const { data: submission, error: subError } = await supabase
            .from('tool_submissions')
            .select('id, tool_name, status')
            .eq('submitter_email', email.toLowerCase().trim())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (subError || !submission) {
            return NextResponse.json({ error: 'No submission found for this email' }, { status: 404 });
        }

        // Upload file to Supabase Storage
        const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
        const fileName = `${submission.id}_${Date.now()}.${ext}`;
        const bytes = await file.arrayBuffer();

        const { error: uploadError } = await supabase.storage
            .from('payment-proofs')
            .upload(fileName, bytes, { contentType: file.type, upsert: true });

        if (uploadError) {
            return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase.storage
            .from('payment-proofs')
            .getPublicUrl(fileName);

        // Save URL to submission
        await supabase
            .from('tool_submissions')
            .update({ payment_proof_url: publicUrl })
            .eq('id', submission.id);

        await logActivity('payment_proof_uploaded', {
            tool: submission.tool_name,
            email,
            proof_url: publicUrl,
        });

        // Notify admin via email
        const adminEmail = process.env.ADMIN_EMAIL || 'allaitoollist@gmail.com';
        await sendPaymentProofNotification(
            submission.tool_name,
            email,
            publicUrl,
            adminEmail,
        ).catch((err) => console.error('[PaymentProof] Admin notification failed:', err));

        return NextResponse.json({ success: true, tool: submission.tool_name });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
