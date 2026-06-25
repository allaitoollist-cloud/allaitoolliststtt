'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle2, Loader2, ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function PaymentProofPage() {
    const [email, setEmail] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [toolName, setToolName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (f: File) => {
        setFile(f);
        const url = URL.createObjectURL(f);
        setPreview(url);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !file) return;
        setLoading(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('email', email);
            fd.append('file', file);
            const res = await fetch('/api/payment-proof', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            setToolName(data.tool);
            setDone(true);
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    if (done) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-4">
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold">Payment Proof Received!</h1>
                    <p className="text-muted-foreground">
                        Your payment screenshot for <strong>&quot;{toolName}&quot;</strong> has been submitted.
                        We&apos;ll verify and activate your listing within 24 hours.
                    </p>
                    <Link href="/" className="inline-block mt-4 text-primary hover:underline">
                        Back to All AI Tool List →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-4">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">AI</span>
                        <span>All AI Tool List</span>
                    </Link>
                    <h1 className="text-2xl font-bold">Upload Payment Proof</h1>
                    <p className="text-muted-foreground text-sm">
                        Upload your PayPal payment screenshot so we can verify and activate your listing.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-white/10 rounded-xl p-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Your Submission Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">The email you used when submitting your tool</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Payment Screenshot</Label>
                        <div
                            onClick={() => inputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                                ${preview ? 'border-primary/40 bg-primary/5' : 'border-white/20 hover:border-white/40'}`}
                        >
                            {preview ? (
                                <div className="space-y-2">
                                    <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                                    <p className="text-xs text-muted-foreground">{file?.name} — click to change</p>
                                </div>
                            ) : (
                                <div className="space-y-2 text-muted-foreground">
                                    <ImageIcon className="h-10 w-10 mx-auto opacity-40" />
                                    <p className="text-sm">Click to upload screenshot</p>
                                    <p className="text-xs">JPG, PNG, WEBP · Max 5MB</p>
                                </div>
                            )}
                        </div>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={!email || !file || loading}>
                        {loading
                            ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Uploading...</>
                            : <><Upload className="h-4 w-4 mr-2" /> Submit Payment Proof</>
                        }
                    </Button>
                </form>

                <p className="text-center text-xs text-muted-foreground">
                    Questions? Email us at{' '}
                    <a href="mailto:hello@allaitoollist.com" className="text-primary hover:underline">
                        hello@allaitoollist.com
                    </a>
                </p>
            </div>
        </div>
    );
}
