import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SubmissionRow } from '@/components/admin/SubmissionRow';

export const dynamic = 'force-dynamic';

export default async function AdminSubmissionsPage() {
    const { data: submissions, error } = await supabase
        .from('tool_submissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching submissions:', error);
    }

    const pendingCount = submissions?.filter(s => s.status === 'pending').length || 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Tool Submissions</h1>
                    <p className="text-muted-foreground">Review and manage tool submissions from users.</p>
                    {pendingCount > 0 && (
                        <p className="text-sm text-yellow-500 mt-1">⚠️ {pendingCount} pending submission{pendingCount > 1 ? 's' : ''}</p>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search submissions..."
                        className="pl-9 bg-card/50"
                    />
                </div>
            </div>

            {/* Submissions Table */}
            <div className="rounded-md border border-white/10 bg-card/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead>Tool Name</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Submitted By</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions && submissions.length > 0 ? (
                            submissions.map((submission) => (
                                <SubmissionRow key={submission.id} submission={submission} />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                    {error ? 'Error loading submissions' : 'No submissions found'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
