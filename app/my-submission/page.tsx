'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Clock, XCircle, Search, Loader2, ExternalLink, Upload, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface SubmissionStatus {
    tool_name: string;
    plan: string;
    status: string;
    created_at: string;
    payment_proof_url?: string;
    tool_slug?: string;
}

function StatusIcon({ status }: { status: string }) {
    if (status === 'approved') return <CheckCircle2 className="h-12 w-12 text-green-500" />;
    if (status === 'rejected') return <XCircle className="h-12 w-12 text-red-500" />;
    return <Clock className="h-12 w-12 text-orange-400" />;
}

function StatusMessage({ sub }: { sub: SubmissionStatus }) {
    const planLabel = sub.plan === 'sponsored' ? 'Sponsored ($149)' : sub.plan === 'featured' ? 'Featured ($49)' : 'Free';

    if (sub.status === 'approved') {
        return (
            <div className="space-y-3 text-center">
                <h2 className="text-2xl font-bold text-green-400">Your tool is live! 🎉</h2>
                <p className="text-muted-foreground">
                    <strong className="text-foreground">{sub.tool_name}</strong> has been approved and is now listed on All AI Tool List.
                </p>
                {sub.tool_slug && (
                    <Link
                        href={`/tool/${sub.tool_slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                        View your listing <ExternalLink className="h-4 w-4" />
                    </Link>
                )}
            </div>
        );
    }

    if (sub.status === 'rejected') {
        return (
            <div className="space-y-3 text-center">
                <h2 className="text-2xl font-bold text-red-400">Submission Not Approved</h2>
                <p className="text-muted-foreground">
                    Unfortunately <strong className="text-foreground">{sub.tool_name}</strong> was not approved at this time.
                    Please reply to our email or contact us for details.
                </p>
            </div>
        );
    }

    // Pending
    return (
        <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-orange-400">Under Review</h2>
            <p className="text-muted-foreground">
                <strong className="text-foreground">{sub.tool_name}</strong> ({planLabel}) is being reviewed.
            </p>
            <div className="space-y-2 text-left max-w-sm mx-auto">
                {/* Step 1 - always done */}
                <Step done label="Submission received" />
                {/* Step 2 - PayPal link (can't know for sure, show as in-progress) */}
                <Step done={!!sub.payment_proof_url} inProgress={!sub.payment_proof_url} label="Payment link sent" />
                {/* Step 3 - payment proof */}
                <Step
                    done={!!sub.payment_proof_url}
                    inProgress={!sub.payment_proof_url}
                    label={sub.payment_proof_url ? 'Payment proof received ✓' : 'Waiting for payment proof'}
                />
                {/* Step 4 */}
                <Step done={false} label="Approved & live" />
            </div>

            {!sub.payment_proof_url && sub.plan !== 'free' && (
                <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-sm">
                    <p className="font-medium text-orange-400 mb-2">
                        <AlertCircle className="inline h-4 w-4 mr-1" />
                        Payment required to activate your listing
                    </p>
                    <p className="text-muted-foreground mb-3">
                        After paying via PayPal, upload your payment screenshot to speed up approval.
                    </p>
                    <Link href="/payment-proof">
                        <Button size="sm" variant="outline" className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10">
                            <Upload className="h-4 w-4 mr-2" /> Upload Payment Screenshot
                        </Button>
                    </Link>
                </div>
            )}

            {sub.payment_proof_url && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-400">
                    ✅ Payment screenshot received — we&apos;ll approve within 24 hours.
                </div>
            )}
        </div>
    );
}

function Step({ done, inProgress, label }: { done: boolean; inProgress?: boolean; label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold
                ${done ? 'bg-green-500 text-white' : inProgress ? 'bg-orange-500/30 border border-orange-500 text-orange-400' : 'bg-white/10 text-muted-foreground'}`}>
                {done ? '✓' : '·'}
            </div>
            <span className={`text-sm ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
        </div>
    );
}

export default function MySubmissionPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submission, setSubmission] = useState<SubmissionStatus | null>(null);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setError('');
        setSubmission(null);
        try {
            const res = await fetch(`/api/my-submission?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Not found');
            setSubmission(data);
            setSearched(true);
        } catch (err: any) {
            setError(err.message);
            setSearched(true);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-4">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">AI</span>
                        <span>All AI Tool List</span>
                    </Link>
                    <h1 className="text-2xl font-bold">Check Submission Status</h1>
                    <p className="text-muted-foreground text-sm">
                        Enter the email you used when submitting your tool.
                    </p>
                </div>

                {/* Search form */}
                <form onSubmit={handleCheck} className="bg-card border border-white/10 rounded-xl p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Your Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setSearched(false); }}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading
                            ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Checking...</>
                            : <><Search className="h-4 w-4 mr-2" /> Check Status</>
                        }
                    </Button>
                </form>

                {/* Result */}
                {searched && (
                    <div className="bg-card border border-white/10 rounded-xl p-6">
                        {error ? (
                            <div className="text-center space-y-2">
                                <XCircle className="h-10 w-10 text-muted-foreground mx-auto" />
                                <p className="text-muted-foreground text-sm">{error === 'Not found' ? 'No submission found for this email.' : error}</p>
                            </div>
                        ) : submission ? (
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <StatusIcon status={submission.status} />
                                </div>
                                <StatusMessage sub={submission} />
                                <p className="text-center text-xs text-muted-foreground">
                                    Submitted {new Date(submission.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        ) : null}
                    </div>
                )}

                <p className="text-center text-xs text-muted-foreground">
                    Questions?{' '}
                    <a href="mailto:hello@allaitoollist.com" className="text-primary hover:underline">
                        hello@allaitoollist.com
                    </a>
                </p>
            </div>
        </div>
    );
}
