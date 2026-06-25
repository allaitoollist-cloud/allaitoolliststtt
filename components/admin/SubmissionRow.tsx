'use client';

import { useState, useEffect } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal, Check, X, Trash2, ExternalLink, Edit, Mail, Eye, Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Submission {
    id: string;
    tool_name: string;
    tool_url: string;
    description: string;
    full_description?: string;
    category: string;
    pricing: string;
    submitter_name: string;
    submitter_email: string;
    plan: string;
    status: string;
    created_at: string;
    reviewed_at?: string;
    payment_proof_url?: string;
}

const CATEGORIES = [
    'Text', 'Image', 'Video', 'Audio', 'Code', 'Writing',
    'Productivity', 'Automation', 'Marketing', 'Design', 'Business',
    'Education', 'Research', 'Data', 'SEO', 'Social Media',
    'Customer Support', 'Other',
];

const PRICING_OPTIONS = ['Free', 'Freemium', 'Paid', 'Contact for Pricing'];
const PLAN_OPTIONS = ['free', 'featured', 'sponsored'];
const STATUS_OPTIONS = ['pending', 'approved', 'rejected', 'flagged'];

function getStatusBadgeClass(status: string) {
    switch (status) {
        case 'pending':
            return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        case 'approved':
            return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'rejected':
            return 'bg-red-500/10 text-red-500 border-red-500/20';
        case 'flagged':
            return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        default:
            return 'bg-white/5 text-muted-foreground border-white/10';
    }
}

export function SubmissionRow({ submission, onRefresh, paypalSentAt }: { submission: Submission; onRefresh?: () => void; paypalSentAt?: string }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [followupDialogOpen, setFollowupDialogOpen] = useState(false);
    const PAYPAL_BASE = 'https://paypal.me/malikmazhar';
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [paypalLink, setPaypalLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [toolInfo, setToolInfo] = useState<{ exists: boolean; slug?: string } | null>(null);
    const [followupMessage, setFollowupMessage] = useState('');

    // Editable fields state — initialized from submission
    const [editData, setEditData] = useState({
        tool_name: submission.tool_name,
        tool_url: submission.tool_url,
        description: submission.description,
        full_description: submission.full_description ?? '',
        category: submission.category,
        pricing: submission.pricing,
        submitter_name: submission.submitter_name,
        submitter_email: submission.submitter_email,
        plan: submission.plan,
        status: submission.status,
    });

    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (submission.status === 'approved') {
            checkToolExists();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submission.status, submission.tool_name]);

    const checkToolExists = async () => {
        if (!submission.tool_name?.trim()) {
            setToolInfo({ exists: false });
            return;
        }
        try {
            const response = await fetch(`/api/check-tool?name=${encodeURIComponent(submission.tool_name)}`);
            if (!response.ok) { setToolInfo({ exists: false }); return; }
            const data = await response.json();
            if (data.found && data.tools?.length > 0) {
                setToolInfo({ exists: true, slug: data.tools[0].slug });
            } else {
                setToolInfo({ exists: false });
            }
        } catch {
            setToolInfo({ exists: false });
        }
    };

    // ── API helpers ────────────────────────────────────────────────────────────

    const handleApprove = async (dataOverride?: typeof editData) => {
        setLoading(true);
        const payload = dataOverride ?? editData;
        try {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'approve',
                    submissionId: submission.id,
                    submissionData: {
                        tool_name: payload.tool_name,
                        tool_url: payload.tool_url,
                        description: payload.description,
                        full_description: payload.full_description,
                        category: payload.category,
                        pricing: payload.pricing,
                        plan: payload.plan,
                        submitter_email: payload.submitter_email,
                    },
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                toast({ title: 'Error', description: data.error || 'Failed to approve submission', variant: 'destructive' });
            } else {
                toast({ title: 'Approved', description: `Tool created with slug: ${data.toolSlug ?? 'unknown'}` });
                setEditDialogOpen(false);
                router.refresh(); onRefresh?.();
            }
        } catch {
            toast({ title: 'Error', description: 'Network error occurred', variant: 'destructive' });
        }
        setLoading(false);
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reject', submissionId: submission.id }),
            });
            const data = await response.json();
            if (!response.ok) {
                toast({ title: 'Error', description: data.error || 'Failed to reject submission', variant: 'destructive' });
            } else {
                toast({ title: 'Rejected', description: 'Submission rejected' });
                router.refresh(); onRefresh?.();
            }
        } catch {
            toast({ title: 'Error', description: 'Network error occurred', variant: 'destructive' });
        }
        setLoading(false);
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update',
                    submissionId: submission.id,
                    submissionData: editData,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                toast({ title: 'Error', description: data.error || 'Failed to update submission', variant: 'destructive' });
            } else {
                toast({ title: 'Saved', description: 'Submission updated successfully' });
                setEditDialogOpen(false);
                router.refresh(); onRefresh?.();
            }
        } catch {
            toast({ title: 'Error', description: 'Network error occurred', variant: 'destructive' });
        }
        setLoading(false);
    };

    const handleSaveAndApprove = async () => {
        // Save edits to submission record first, then approve
        setLoading(true);
        try {
            await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update', submissionId: submission.id, submissionData: editData }),
            });
        } catch { /* ignore — approve will still proceed */ }
        await handleApprove(editData);
    };

    const handleSendFollowup = async () => {
        if (!followupMessage.trim()) {
            toast({ title: 'Error', description: 'Message cannot be empty', variant: 'destructive' });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'followup',
                    submissionId: submission.id,
                    message: followupMessage,
                    submitterEmail: submission.submitter_email,
                    toolName: submission.tool_name,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                toast({ title: 'Error', description: data.error || 'Failed to send email', variant: 'destructive' });
            } else {
                toast({ title: 'Sent', description: 'Follow-up email sent successfully' });
                setFollowupMessage('');
                setFollowupDialogOpen(false);
            }
        } catch {
            toast({ title: 'Error', description: 'Network error occurred', variant: 'destructive' });
        }
        setLoading(false);
    };

    const handleSendPaymentLink = async () => {
        if (!paypalLink.trim()) {
            toast({ title: 'Error', description: 'Enter your PayPal payment link', variant: 'destructive' });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/admin/send-payment-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submitterEmail: submission.submitter_email,
                    toolName: submission.tool_name,
                    plan: submission.plan,
                    paypalLink: paypalLink.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');
            toast({ title: '✅ Payment link sent!', description: `Sent to ${submission.submitter_email}` });
            setPaypalLink('');
            setPaymentDialogOpen(false);
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', submissionId: submission.id }),
            });
            const data = await response.json();
            if (!response.ok) {
                toast({ title: 'Error', description: data.error || 'Failed to delete submission', variant: 'destructive' });
            } else {
                toast({ title: 'Deleted', description: 'Submission deleted' });
                router.refresh(); onRefresh?.();
            }
        } catch {
            toast({ title: 'Error', description: 'Network error occurred', variant: 'destructive' });
        }
        setLoading(false);
        setDeleteDialogOpen(false);
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <>
            <TableRow
                className="border-white/10 hover:bg-white/5 cursor-pointer"
                onClick={() => setViewDialogOpen(true)}
            >
                {/* Tool Name + URL */}
                <TableCell onClick={(e) => e.stopPropagation()} className="max-w-[200px]">
                    <div className="font-medium truncate">{submission.tool_name}</div>
                    <a
                        href={submission.tool_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-xs truncate block max-w-[180px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {submission.tool_url}
                    </a>
                </TableCell>
                {/* Category */}
                <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{submission.category}</Badge>
                </TableCell>
                {/* Plan */}
                <TableCell>
                    <Badge
                        variant="outline"
                        className={
                            submission.plan === 'sponsored'
                                ? 'bg-violet-500/15 text-violet-400 border-violet-500/30'
                                : submission.plan === 'featured'
                                ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                                : 'bg-white/5 text-muted-foreground border-white/10'
                        }
                    >
                        {submission.plan === 'sponsored' ? '$149' : submission.plan === 'featured' ? '$49' : 'Free'}
                    </Badge>
                </TableCell>
                {/* Submitted By */}
                <TableCell className="hidden lg:table-cell">
                    <div className="text-xs text-muted-foreground">{submission.submitter_email}</div>
                </TableCell>
                {/* Date */}
                <TableCell className="hidden sm:table-cell text-muted-foreground text-sm whitespace-nowrap">
                    {new Date(submission.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                    <div className="flex flex-col gap-1">
                        <Badge variant="outline" className={getStatusBadgeClass(submission.status)}>
                            {submission.status}
                        </Badge>
                        {paypalSentAt && (
                            <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[10px]">
                                💳 PayPal Sent
                            </Badge>
                        )}
                        {submission.payment_proof_url && (
                            <a
                                href={submission.payment_proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px] hover:bg-green-500/20 cursor-pointer">
                                    💰 Payment SS
                                </Badge>
                            </a>
                        )}
                        {submission.status === 'approved' && toolInfo?.exists && toolInfo.slug && (
                            <Link
                                href={`/tool/${toolInfo.slug}`}
                                target="_blank"
                                className="text-blue-500 hover:underline text-xs flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink className="h-3 w-3" /> View tool
                            </Link>
                        )}
                    </div>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                        {submission.status === 'pending' && (
                            <>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleApprove()}
                                    disabled={loading}
                                    className="hover:bg-green-500/20 hover:text-green-500"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                                    Approve
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleReject}
                                    disabled={loading}
                                    className="hover:bg-red-500/20 hover:text-red-500"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                </Button>
                            </>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setViewDialogOpen(true)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                    const amount = submission.plan === 'sponsored' ? '149' : '49';
                                    setPaypalLink(`${PAYPAL_BASE}/${amount}`);
                                    setPaymentDialogOpen(true);
                                }}>
                                    <CreditCard className="mr-2 h-4 w-4 text-orange-500" />
                                    Send PayPal Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFollowupDialogOpen(true)}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Follow-up
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-500 focus:text-red-500">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </TableCell>
            </TableRow>

            {/* ── View Details Dialog ── */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Submission Details</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <DetailItem label="Tool Name" value={submission.tool_name} />
                            <DetailItem label="Status">
                                <Badge variant="outline" className={getStatusBadgeClass(submission.status)}>
                                    {submission.status}
                                </Badge>
                            </DetailItem>
                            <DetailItem label="URL">
                                <a href={submission.tool_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                                    {submission.tool_url} <ExternalLink className="h-3 w-3" />
                                </a>
                            </DetailItem>
                            <DetailItem label="Category" value={submission.category} />
                            <DetailItem label="Pricing" value={submission.pricing} />
                            <DetailItem label="Plan" value={submission.plan} />
                            <DetailItem label="Submitter Name" value={submission.submitter_name} />
                            <DetailItem label="Submitter Email" value={submission.submitter_email} />
                            <DetailItem label="Submitted At" value={new Date(submission.created_at).toLocaleString()} />
                            {submission.reviewed_at && (
                                <DetailItem label="Reviewed At" value={new Date(submission.reviewed_at).toLocaleString()} />
                            )}
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Description</p>
                            <p className="text-sm whitespace-pre-wrap rounded bg-white/5 p-3">{submission.description}</p>
                        </div>
                        {submission.full_description && (
                            <div>
                                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Full Description</p>
                                <p className="text-sm whitespace-pre-wrap rounded bg-white/5 p-3">{submission.full_description}</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="gap-2 flex-wrap">
                        <Button variant="outline" onClick={() => { setViewDialogOpen(false); setEditDialogOpen(true); }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        {submission.status === 'pending' && (
                            <>
                                <Button
                                    onClick={() => { setViewDialogOpen(false); handleApprove(); }}
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                                    Approve
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => { setViewDialogOpen(false); handleReject(); }}
                                    disabled={loading}
                                >
                                    <X className="h-4 w-4 mr-2" /> Reject
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" onClick={() => setViewDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Edit Dialog ── */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Submission</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="edit-tool-name">Tool Name</Label>
                                <Input
                                    id="edit-tool-name"
                                    value={editData.tool_name}
                                    onChange={(e) => setEditData((p) => ({ ...p, tool_name: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="edit-tool-url">URL</Label>
                                <Input
                                    id="edit-tool-url"
                                    value={editData.tool_url}
                                    onChange={(e) => setEditData((p) => ({ ...p, tool_url: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Category</Label>
                                <Select
                                    value={editData.category}
                                    onValueChange={(v) => setEditData((p) => ({ ...p, category: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((c) => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Pricing</Label>
                                <Select
                                    value={editData.pricing}
                                    onValueChange={(v) => setEditData((p) => ({ ...p, pricing: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select pricing" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRICING_OPTIONS.map((o) => (
                                            <SelectItem key={o} value={o}>{o}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Plan</Label>
                                <Select
                                    value={editData.plan}
                                    onValueChange={(v) => setEditData((p) => ({ ...p, plan: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PLAN_OPTIONS.map((o) => (
                                            <SelectItem key={o} value={o}>{o}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Status</Label>
                                <Select
                                    value={editData.status}
                                    onValueChange={(v) => setEditData((p) => ({ ...p, status: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map((o) => (
                                            <SelectItem key={o} value={o}>{o}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="edit-submitter-name">Submitter Name</Label>
                                <Input
                                    id="edit-submitter-name"
                                    value={editData.submitter_name}
                                    onChange={(e) => setEditData((p) => ({ ...p, submitter_name: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="edit-submitter-email">Submitter Email</Label>
                                <Input
                                    id="edit-submitter-email"
                                    type="email"
                                    value={editData.submitter_email}
                                    onChange={(e) => setEditData((p) => ({ ...p, submitter_email: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                rows={3}
                                value={editData.description}
                                onChange={(e) => setEditData((p) => ({ ...p, description: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="edit-full-description">Full Description</Label>
                            <Textarea
                                id="edit-full-description"
                                rows={5}
                                value={editData.full_description}
                                onChange={(e) => setEditData((p) => ({ ...p, full_description: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 flex-wrap">
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant="secondary" onClick={handleSaveChanges} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Save Changes
                        </Button>
                        <Button onClick={handleSaveAndApprove} disabled={loading} className="bg-green-600 hover:bg-green-700">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                            Save &amp; Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Follow-up Email Dialog ── */}
            <Dialog open={followupDialogOpen} onOpenChange={setFollowupDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Send Follow-up Email</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <p className="text-sm text-muted-foreground">
                            Sending to: <span className="font-medium text-foreground">{submission.submitter_email}</span>
                        </p>
                        <div className="space-y-1">
                            <Label htmlFor="followup-message">Message</Label>
                            <Textarea
                                id="followup-message"
                                rows={6}
                                placeholder="Type your message to the submitter..."
                                value={followupMessage}
                                onChange={(e) => setFollowupMessage(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFollowupDialogOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendFollowup} disabled={loading || !followupMessage.trim()}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
                            Send Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Send PayPal Payment Link Dialog ── */}
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Send PayPal Payment Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        {paypalSentAt && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm flex items-center gap-2">
                                <span className="text-yellow-400 font-medium">⚠️ Already sent on {new Date(paypalSentAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                            Sending to: <span className="font-medium text-foreground">{submission.submitter_email}</span>
                        </p>
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-sm">
                            <p className="font-medium text-orange-400">Plan: {submission.plan === 'sponsored' ? 'Sponsored — $149' : 'Featured — $49'}</p>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="paypal-link">Your PayPal Payment Link</Label>
                            <Input
                                id="paypal-link"
                                placeholder="https://paypal.me/malikmazhar/49"
                                value={paypalLink}
                                onChange={(e) => setPaypalLink(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Auto-filled based on plan — edit if needed</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPaymentDialogOpen(false)} disabled={loading}>Cancel</Button>
                        <Button onClick={handleSendPaymentLink} disabled={loading || !paypalLink.trim()}
                            className="bg-orange-500 hover:bg-orange-600 text-white">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                            Send Payment Link
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Delete Confirmation Dialog ── */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Submission?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the submission for &quot;{submission.tool_name}&quot;. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

// ── Small helper component ─────────────────────────────────────────────────────
function DetailItem({
    label,
    value,
    children,
}: {
    label: string;
    value?: string;
    children?: React.ReactNode;
}) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-0.5">{label}</p>
            {children ?? <p className="text-sm">{value ?? '—'}</p>}
        </div>
    );
}
