'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories, pricingModels } from '@/types';
import { useState } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function SubmitPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();

    const supabase = getBrowserClient();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            tool_name: formData.get('name') as string,
            tool_url: formData.get('url') as string,
            category: formData.get('category') as string,
            pricing: formData.get('pricing') as string,
            description: formData.get('shortDescription') as string,
            submitter_email: formData.get('email') as string,
            // Additional fields not in schema but useful to capture if we expand schema later
            // full_description: formData.get('fullDescription'), 
            // tags: formData.get('tags'),
            // plan: formData.get('plan'),
        };

        try {
            const { error } = await supabase
                .from('tool_submissions')
                .insert([data]);

            if (error) throw error;

            // Send submission confirmation email (silently, don't block submission)
            if (data.submitter_email) {
                // Send email in background, don't wait for it
                fetch('/api/submit-tool-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        toolName: data.tool_name,
                        submitterEmail: data.submitter_email,
                    }),
                }).then(async (response) => {
                    const result = await response.json();
                    if (!result.success) {
                        // Log error but don't show to user
                        console.warn('Email sending failed (non-blocking):', result.error?.message || 'Domain not verified');
                    } else {
                        console.log('✅ Submission email sent successfully');
                    }
                }).catch((err) => {
                    // Silently handle email errors
                    console.warn('Email service unavailable:', err);
                });
            }

            setSubmitted(true);
            toast({
                title: "Submission Received!",
                description: "We'll review your tool and get back to you shortly. You'll receive an email once your tool is reviewed.",
            });
        } catch (error) {
            console.error('Error submitting tool:', error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <main className="flex-grow flex items-center justify-center p-4">
                    <Card className="max-w-md w-full p-8 text-center space-y-6 bg-card/50 border-border/50">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold">Submission Received!</h2>
                        <p className="text-muted-foreground">
                            Thank you for submitting your tool. Our team will review it within 7 days. You'll receive an email update once it's processed.
                        </p>
                        <Button onClick={() => setSubmitted(false)} variant="outline">
                            Submit Another Tool
                        </Button>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative isolate overflow-hidden pt-24 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-b from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-6">
                                Submit Your AI Tool
                            </h1>
                            <p className="text-lg leading-8 text-muted-foreground">
                                Share your AI tool with our community and help others discover it.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="container mx-auto px-4 py-12 max-w-2xl">
                    <Card className="p-8 bg-card/50 border-border/50">
                        <form onSubmit={onSubmit} className="space-y-6">
                            {/* Plan Selection */}
                            <div className="space-y-3 mb-8">
                                <Label className="text-base">Select Listing Type</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative flex items-start space-x-3 rounded-lg border border-white/10 bg-secondary/20 p-4 shadow-sm hover:border-primary/50 cursor-pointer transition-all">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="plan-free" className="font-bold cursor-pointer">Basic Listing</Label>
                                                <span className="text-sm font-medium text-muted-foreground">Free</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">Standard listing, 7-day review queue</p>
                                        </div>
                                        <input type="radio" name="plan" id="plan-free" value="free" className="mt-1" defaultChecked />
                                    </div>
                                    <div className="relative flex items-start space-x-3 rounded-lg border border-primary/50 bg-primary/5 p-4 shadow-sm cursor-pointer transition-all">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="plan-featured" className="font-bold text-primary cursor-pointer">Featured Listing</Label>
                                                <span className="text-sm font-bold text-primary">$49</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">Skip queue, Featured badge, Top results</p>
                                        </div>
                                        <input type="radio" name="plan" id="plan-featured" value="featured" className="mt-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Tool Name *</Label>
                                <Input
                                    name="name"
                                    id="name"
                                    placeholder="e.g. ChatGPT"
                                    className="bg-secondary/50 border-white/5"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="url">Website URL *</Label>
                                <Input
                                    name="url"
                                    id="url"
                                    type="url"
                                    placeholder="https://example.com"
                                    className="bg-secondary/50 border-white/5"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select name="category" required>
                                    <SelectTrigger className="bg-secondary/50 border-white/5">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.filter(c => c !== 'All').map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pricing">Pricing Model *</Label>
                                <Select name="pricing" required>
                                    <SelectTrigger className="bg-secondary/50 border-white/5">
                                        <SelectValue placeholder="Select pricing model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pricingModels.filter(p => p !== 'All').map((pricing) => (
                                            <SelectItem key={pricing} value={pricing}>
                                                {pricing}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="shortDescription">Short Description *</Label>
                                <Textarea
                                    name="shortDescription"
                                    id="shortDescription"
                                    placeholder="Brief description (max 150 characters)"
                                    className="bg-secondary/50 border-white/5 min-h-[80px]"
                                    maxLength={150}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fullDescription">Full Description *</Label>
                                <Textarea
                                    name="fullDescription"
                                    id="fullDescription"
                                    placeholder="Detailed description of your tool"
                                    className="bg-secondary/50 border-white/5 min-h-[150px]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (comma-separated)</Label>
                                <Input
                                    name="tags"
                                    id="tags"
                                    placeholder="e.g. chatbot, nlp, automation"
                                    className="bg-secondary/50 border-white/5"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Your Email *</Label>
                                <Input
                                    name="email"
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    className="bg-secondary/50 border-white/5"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    We'll contact you if we need more information
                                </p>
                            </div>

                            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20 h-12 text-lg font-semibold">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Continue to Review'
                                )}
                            </Button>

                            <p className="text-sm text-muted-foreground text-center">
                                By submitting, you agree to our Terms of Service. Featured listings require payment on the next step.
                            </p>
                        </form>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
