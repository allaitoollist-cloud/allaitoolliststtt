'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories, pricingModels } from '@/types';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
    Loader2, CheckCircle2, Zap, Star, Shield, TrendingUp,
    Users, BarChart3, Globe, ChevronDown, ChevronUp, ArrowRight, Check, X
} from 'lucide-react';

const PLANS = [
    {
        id: 'featured',
        name: 'Featured Listing',
        price: '$49',
        badge: 'Most Popular',
        description: 'Stand out & get more users',
        cta: 'Get Featured',
        ctaStyle: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/30',
        features: [
            { text: 'Listed in AI directory', ok: true },
            { text: 'Full rich tool profile', ok: true },
            { text: 'Category & tag indexing', ok: true },
            { text: 'Priority review (24h)', ok: true },
            { text: '⚡ Featured badge on listing', ok: true },
            { text: 'Homepage top placement (30 days)', ok: true },
            { text: 'Social media shoutout', ok: true },
            { text: 'Newsletter mention', ok: false },
        ],
    },
    {
        id: 'sponsored',
        name: 'Sponsored Placement',
        price: '$149',
        badge: 'Max Exposure',
        description: 'Dominate the directory',
        cta: 'Get Max Exposure',
        ctaStyle: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/30',
        features: [
            { text: 'Listed in AI directory', ok: true },
            { text: 'Full rich tool profile', ok: true },
            { text: 'Category & tag indexing', ok: true },
            { text: 'Priority review (24h)', ok: true },
            { text: '⚡ Featured badge on listing', ok: true },
            { text: 'Homepage top placement (90 days)', ok: true },
            { text: 'Social media shoutout', ok: true },
            { text: '📧 Newsletter mention (5,000+ subs)', ok: true },
        ],
    },
];

const FAQS = [
    { q: 'How long does the review process take?', a: 'All paid listings get priority review within 24 hours.' },
    { q: 'Can I update my listing after submission?', a: 'Yes! Once your tool is published, you can email us with updates anytime.' },
    { q: 'What payment methods do you accept?', a: 'We accept Binance Pay (USDT/USDC), Payoneer, and Bank Transfer. We will send an invoice to your email after submission.' },
    { q: 'Will my tool be guaranteed to be listed?', a: 'We review every submission. Tools must be genuine AI-powered products. Paid listings have a near-100% acceptance rate.' },
    { q: 'How long does the Featured homepage placement last?', a: 'Featured plan gets 30 days on the homepage top section. Sponsored plan gets 90 days of premium placement.' },
    { q: 'Do you offer refunds?', a: 'If your tool is not approved, we offer a full refund. If approved but you are unsatisfied, contact us within 7 days.' },
    { q: 'Can I upgrade from Featured to Sponsored later?', a: 'Absolutely! Contact us anytime to upgrade your existing listing to Sponsored.' },
    { q: 'Is this a one-time payment?', a: 'Yes, it is a one-time payment. No recurring charges or hidden fees.' },
];

const STATS = [
    { value: '10,000+', label: 'AI Tools Listed', icon: Globe },
    { value: '500K+', label: 'Monthly Visitors', icon: Users },
    { value: '95%', label: 'Approval Rate', icon: Shield },
    { value: '200+', label: 'New Tools/Month', icon: TrendingUp },
];

export default function SubmitPage() {
    const [selectedPlan, setSelectedPlan] = useState('featured');
    const [formVisible, setFormVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { toast } = useToast();

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);
        setFormVisible(true);
        setTimeout(() => {
            document.getElementById('submit-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

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
            plan: selectedPlan,
        };
        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool_name: data.tool_name,
                    tool_url: data.tool_url,
                    category: data.category,
                    pricing: data.pricing,
                    description: data.description,
                    submitter_email: data.submitter_email,
                    plan: data.plan,
                    submission_start_time: Date.now() - 5000,
                }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Submission failed');
            setSubmitted(true);
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Something went wrong. Please try again.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        const plan = PLANS.find(p => p.id === selectedPlan);
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="max-w-md w-full text-center space-y-6 py-20">
                        <div className="w-20 h-20 bg-orange-500/15 rounded-full flex items-center justify-center mx-auto ring-4 ring-orange-500/20">
                            <CheckCircle2 className="w-10 h-10 text-orange-500" />
                        </div>
                        <h2 className="text-3xl font-bold">You're Submitted! 🎉</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Great choice! We will send a payment invoice for {plan?.price} to your email within 24 hours. Once paid, your tool goes live with priority placement!
                        </p>
                        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-sm text-orange-300">
                            💳 Watch your inbox for the invoice. We accept Binance, Payoneer & Bank Transfer.
                        </div>
                        <Button onClick={() => { setSubmitted(false); setFormVisible(false); setSelectedPlan('featured'); }} variant="outline" className="mt-4">
                            Submit Another Tool
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-grow">

                {/* ── HERO ── */}
                <section className="relative pt-28 pb-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative mx-auto max-w-4xl px-6 text-center">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            10,000+ AI Tools & Growing
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                            Reach Thousands of<br />
                            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">AI Enthusiasts</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            List your AI tool in our directory and get discovered by professionals, developers, and businesses actively looking for tools like yours.
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                            {STATS.map((stat) => (
                                <div key={stat.label} className="bg-card/50 border border-white/10 rounded-xl p-4 text-center">
                                    <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── PRICING CARDS ── */}
                <section className="py-12 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-3">Choose Your Listing Plan</h2>
                            <p className="text-muted-foreground">Choose your plan and get listed today</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {PLANS.map((plan) => {
                                const isPopular = plan.badge === 'Most Popular';
                                const isMax = plan.badge === 'Max Exposure';
                                return (
                                    <div
                                        key={plan.id}
                                        className={`relative rounded-2xl border p-7 flex flex-col transition-all duration-300 ${
                                            isPopular
                                                ? 'border-orange-500/50 bg-gradient-to-b from-orange-500/10 to-card/50 shadow-xl shadow-orange-500/10 scale-[1.02]'
                                                : isMax
                                                ? 'border-violet-500/40 bg-gradient-to-b from-violet-500/10 to-card/50'
                                                : 'border-white/10 bg-card/50'
                                        }`}
                                    >
                                        {plan.badge && (
                                            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full ${
                                                isPopular ? 'bg-orange-500 text-white' : 'bg-violet-600 text-white'
                                            }`}>
                                                {plan.badge}
                                            </div>
                                        )}

                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                                            <div className="text-4xl font-bold mb-1">
                                                {plan.price}
                                                <span className="text-base font-normal text-muted-foreground ml-1">one-time</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                                        </div>

                                        <ul className="space-y-2.5 mb-8 flex-1">
                                            {plan.features.map((f, i) => (
                                                <li key={i} className={`flex items-start gap-2.5 text-sm ${f.ok ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                                                    {f.ok
                                                        ? <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                        : <X className="w-4 h-4 shrink-0 mt-0.5" />
                                                    }
                                                    {f.text}
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={() => handleSelectPlan(plan.id)}
                                            className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${plan.ctaStyle}`}
                                        >
                                            {plan.cta}
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="text-center text-xs text-muted-foreground mt-6">
                            💳 Accepts Binance (USDT), Payoneer & Bank Transfer · No hidden fees · Invoice sent via email
                        </p>
                    </div>
                </section>

                {/* ── WHY CHOOSE US ── */}
                <section className="py-16 px-4 bg-card/20 border-y border-white/5">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-2xl font-bold mb-10">Why List on All AI Tool List?</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { icon: Globe, color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'SEO Optimized', desc: 'Every listing is indexed by Google for maximum organic visibility.' },
                                { icon: BarChart3, color: 'text-green-400', bg: 'bg-green-400/10', title: 'High Traffic', desc: '500,000+ monthly visitors actively searching for AI tools.' },
                                { icon: Users, color: 'text-orange-400', bg: 'bg-orange-400/10', title: 'Targeted Audience', desc: 'Developers, founders, and AI professionals visiting daily.' },
                                { icon: Shield, color: 'text-violet-400', bg: 'bg-violet-400/10', title: 'Trusted Directory', desc: 'Curated, human-reviewed listings for quality assurance.' },
                            ].map((item) => (
                                <div key={item.title} className="text-center space-y-3">
                                    <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto`}>
                                        <item.icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    <div className="font-semibold text-sm">{item.title}</div>
                                    <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── SUBMISSION FORM ── */}
                {formVisible && (
                    <section id="submit-form" className="py-16 px-4">
                        <div className="max-w-2xl mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold mb-2">
                                    {selectedPlan === 'featured' ? '⚡ Get Featured for $49' : '🚀 Get Sponsored Placement for $149'}
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    Fill in your details. We&apos;ll send a payment invoice to your email within a few hours.
                                </p>
                            </div>

                            <div className={`rounded-2xl border p-8 ${
                                selectedPlan === 'sponsored' ? 'border-violet-500/30 bg-violet-500/5' :
                                'border-orange-500/30 bg-orange-500/5'
                            }`}>
                                <form onSubmit={onSubmit} className="space-y-5">
                                    <input type="hidden" name="plan" value={selectedPlan} />

                                    {/* Plan switcher */}
                                    <div className="flex gap-2 flex-wrap mb-6">
                                        {PLANS.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setSelectedPlan(p.id)}
                                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                                                    selectedPlan === p.id
                                                        ? p.id === 'featured' ? 'bg-orange-500 text-white'
                                                          : p.id === 'sponsored' ? 'bg-violet-600 text-white'
                                                          : 'bg-primary text-primary-foreground'
                                                        : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                {p.name} — {p.price}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Tool Name *</Label>
                                            <Input name="name" id="name" placeholder="e.g. ChatGPT" className="bg-background/50 border-white/10" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="url">Website URL *</Label>
                                            <Input name="url" id="url" type="url" placeholder="https://yourtool.com" className="bg-background/50 border-white/10" required />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category *</Label>
                                            <Select name="category" required>
                                                <SelectTrigger className="bg-background/50 border-white/10">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.filter(c => c !== 'All').map(c => (
                                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pricing">Pricing Model *</Label>
                                            <Select name="pricing" required>
                                                <SelectTrigger className="bg-background/50 border-white/10">
                                                    <SelectValue placeholder="Select pricing" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {pricingModels.filter(p => p !== 'All').map(p => (
                                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="shortDescription">Short Description * <span className="text-muted-foreground text-xs">(max 150 chars)</span></Label>
                                        <Textarea name="shortDescription" id="shortDescription" placeholder="Briefly describe what your tool does..." className="bg-background/50 border-white/10 min-h-[80px]" maxLength={150} required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Your Email *</Label>
                                        <Input name="email" id="email" type="email" placeholder="your@email.com" className="bg-background/50 border-white/10" required />
                                        <p className="text-xs text-muted-foreground">
                                            📧 We&apos;ll send your payment invoice here.
                                        </p>
                                    </div>

                                    <Button type="submit" disabled={loading} className={`w-full h-12 text-base font-semibold ${
                                        selectedPlan === 'sponsored' ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/20' :
                                        'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20'
                                    }`}>
                                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> :
                                         selectedPlan === 'featured' ? '⚡ Submit & Get Invoice ($49) →' :
                                         '🚀 Submit & Get Invoice ($149) →'}
                                    </Button>

                                    <p className="text-xs text-muted-foreground text-center">
                                        By submitting you agree to our listing guidelines. Paid plans are invoiced manually via Binance/Payoneer.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </section>
                )}

                {/* ── FAQ ── */}
                <section className="py-16 px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground text-sm">Everything you need to know before submitting</p>
                        </div>
                        <div className="space-y-3">
                            {FAQS.map((faq, i) => (
                                <div key={i} className="border border-white/10 rounded-xl bg-card/40 overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
                                    >
                                        <span className="font-medium text-sm pr-4">{faq.q}</span>
                                        {openFaq === i
                                            ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                                            : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                                    </button>
                                    {openFaq === i && (
                                        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-3">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── BOTTOM CTA ── */}
                <section className="py-16 px-4 bg-gradient-to-b from-transparent to-primary/5">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Get More Users?</h2>
                        <p className="text-muted-foreground mb-8">Join 10,000+ AI tools already listed on our platform.</p>
                        <button
                            onClick={() => handleSelectPlan('featured')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all"
                        >
                            <Zap className="w-5 h-5 fill-current" />
                            Get Featured for $49
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-muted-foreground mt-4">Or <button onClick={() => handleSelectPlan('sponsored')} className="underline hover:text-foreground">get max exposure for $149</button> — one-time payment, no hidden fees.</p>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
