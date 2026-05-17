import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { DollarSign, Check, X, Mail } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function approveSponsorship(id: string, toolSlug: string) {
    'use server';
    // Mark request as approved
    await supabase.from('sponsorship_requests').update({ status: 'approved' }).eq('id', id);
    // Mark tool as featured
    await supabase.from('tools').update({ featured: true, trending: true }).eq('slug', toolSlug);
    revalidatePath('/admin/sponsorships');
}

async function rejectSponsorship(id: string) {
    'use server';
    await supabase.from('sponsorship_requests').update({ status: 'rejected' }).eq('id', id);
    revalidatePath('/admin/sponsorships');
}

export default async function SponsorshipsPage() {
    const { data: requests } = await supabase
        .from('sponsorship_requests')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <DollarSign className="w-8 h-8 text-orange-500" /> Sponsorship Requests
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage manual payment requests. Once you receive payment via Payoneer/Crypto, click "Approve" to feature the tool.
                </p>
            </div>

            <Card className="bg-card/50 border-white/10">
                <CardHeader>
                    <CardTitle>Recent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Tool Name</th>
                                    <th className="px-6 py-3 font-semibold">User Email</th>
                                    <th className="px-6 py-3 font-semibold">Status</th>
                                    <th className="px-6 py-3 font-semibold">Date</th>
                                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests && requests.length > 0 ? (
                                    requests.map((req) => (
                                        <tr key={req.id} className="border-b border-border hover:bg-muted/30">
                                            <td className="px-6 py-4 font-medium">{req.tool_name}</td>
                                            <td className="px-6 py-4">
                                                <a href={`mailto:${req.user_email}`} className="flex items-center gap-1 text-primary hover:underline">
                                                    <Mail className="w-3 h-3" /> {req.user_email}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    req.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                                    req.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-orange-500/10 text-orange-500'
                                                }`}>
                                                    {req.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {new Date(req.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {req.status === 'pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <form action={async () => {
                                                            'use server';
                                                            await approveSponsorship(req.id, req.tool_slug);
                                                        }}>
                                                            <button type="submit" className="text-green-500 hover:text-green-400 p-1 border border-green-500/20 rounded bg-green-500/10" title="Approve & Feature Tool">
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        </form>
                                                        <form action={async () => {
                                                            'use server';
                                                            await rejectSponsorship(req.id);
                                                        }}>
                                                            <button type="submit" className="text-red-500 hover:text-red-400 p-1 border border-red-500/20 rounded bg-red-500/10" title="Reject">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </form>
                                                    </div>
                                                )}
                                                {req.status === 'approved' && (
                                                    <span className="text-xs text-green-500 font-medium flex items-center justify-end gap-1">
                                                        <Check className="w-3 h-3" /> Featured
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            No sponsorship requests yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
