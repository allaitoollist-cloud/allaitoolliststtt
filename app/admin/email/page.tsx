import { supabase } from '@/lib/supabase';
import EmailDashboard from '@/components/admin/EmailDashboard';

export const dynamic = 'force-dynamic';

export default async function EmailPage() {
    // 1. Fetch Tools with sent emails
    const { data: tools } = await supabase
        .from('tools')
        .select('id, name, submitter_email, updated_at, approval_email_sent')
        .eq('approval_email_sent', true)
        .order('updated_at', { ascending: false })
        .limit(20);

    // 2. Fetch Submissions with sent emails
    const { data: submissions } = await supabase
        .from('tool_submissions')
        .select('id, tool_name, submitter_email, created_at, confirmation_email_sent')
        .eq('confirmation_email_sent', true)
        .order('created_at', { ascending: false })
        .limit(20);

    // 3. Merge & Format Logs
    const logs: any[] = [];

    (tools || []).forEach(t => {
        logs.push({
            id: `tool-${t.id}`,
            recipient: t.submitter_email || 'Unknown',
            subject: `Tool Approved: ${t.name}`,
            type: 'approval',
            sent_at: t.updated_at, // Approximate timestamp
            status: 'delivered'
        });
    });

    (submissions || []).forEach(s => {
        logs.push({
            id: `sub-${s.id}`,
            recipient: s.submitter_email || 'Unknown',
            subject: `Submission Received: ${s.tool_name}`,
            type: 'confirmation',
            sent_at: s.created_at, // Exact timestamp
            status: 'delivered'
        });
    });

    // Sort combined logs
    logs.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Email Automation</h1>
                <p className="text-muted-foreground mt-2">
                    Monitor system emails and configure notification triggers.
                </p>
            </div>

            <EmailDashboard logs={logs} />
        </div>
    );
}
