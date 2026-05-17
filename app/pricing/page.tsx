import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Check, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const pricingPlans = [
    {
        name: 'Featured Listing',
        price: '$49',
        period: '/one-time',
        description: 'Stand out & get more users',
        icon: Zap,
        features: [
            'Listed in AI directory',
            'Full rich tool profile',
            '⚡ Featured badge on listing',
            '⭐ Priority review (24h)',
            '🏠 Homepage placement (30 days)',
            '📣 Social media shoutout',
            'Category & tag indexing',
        ],
        cta: 'Get Featured — $49',
        href: '/submit',
        popular: true,
    },
    {
        name: 'Sponsored Placement',
        price: '$149',
        period: '/one-time',
        description: 'Maximum exposure for serious growth',
        icon: Crown,
        features: [
            'Everything in Featured',
            '🏆 Homepage top placement (90 days)',
            '💌 Newsletter mention (5,000+ subs)',
            '📣 Social media shoutout',
            '⚡ Featured badge on listing',
            'Priority review (24h)',
            'Priority support',
        ],
        cta: 'Get Sponsored — $149',
        href: '/submit',
        popular: false,
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative isolate overflow-hidden pt-24 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-b from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-6">
                                Promote Your AI Tool
                            </h1>
                            <p className="text-lg leading-8 text-muted-foreground">
                                Join 1000+ AI tools and reach thousands of daily users. Choose the plan that fits your growth goals.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="container mx-auto px-4 py-12 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        {pricingPlans.map((plan) => (
                            <Card
                                key={plan.name}
                                className={`p-8 relative overflow-hidden transition-all duration-300 ${plan.popular
                                    ? 'border-primary/50 bg-card/80 shadow-2xl shadow-primary/20 scale-105 z-10'
                                    : 'bg-card/50 border-border/50 hover:border-primary/30'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-gradient-to-l from-primary to-purple-600 text-white text-xs font-bold px-8 py-1 rotate-45 translate-x-8 translate-y-4 shadow-sm">
                                            BEST VALUE
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${plan.popular ? 'bg-primary/20' : 'bg-secondary'}`}>
                                        <plan.icon className={`h-6 w-6 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                                    </div>
                                    <h3 className="text-xl font-bold">{plan.name}</h3>
                                </div>

                                <div className="mb-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                                </div>
                                <p className="text-muted-foreground text-sm mb-8 min-h-[40px]">{plan.description}</p>

                                <Link href={plan.href} className="block mb-8">
                                    <Button
                                        className={`w-full h-11 text-base ${plan.popular
                                            ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25'
                                            : 'bg-secondary hover:bg-secondary/80'
                                            }`}
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>

                                <div className="space-y-4">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-3">
                                            <div className={`mt-1 rounded-full p-0.5 ${plan.popular ? 'bg-primary/20' : 'bg-secondary'}`}>
                                                <Check className={`h-3 w-3 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                                            </div>
                                            <span className="text-sm text-foreground/90">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-24 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                        <div className="grid gap-8">
                            <div className="bg-card/30 p-6 rounded-xl border border-white/5">
                                <h3 className="font-semibold text-lg mb-2">How long does the review take?</h3>
                                <p className="text-muted-foreground">
                                    All paid listings get priority review within 24 hours of payment confirmation.
                                </p>
                            </div>
                            <div className="bg-card/30 p-6 rounded-xl border border-white/5">
                                <h3 className="font-semibold text-lg mb-2">What does "Featured" mean?</h3>
                                <p className="text-muted-foreground">
                                    Featured tools get a "Featured" badge, appear at the top of their category, and are highlighted on the homepage for higher visibility.
                                </p>
                            </div>
                            <div className="bg-card/30 p-6 rounded-xl border border-white/5">
                                <h3 className="font-semibold text-lg mb-2">Can I update my listing later?</h3>
                                <p className="text-muted-foreground">
                                    Yes! You can request updates to your listing at any time by contacting our support team.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
