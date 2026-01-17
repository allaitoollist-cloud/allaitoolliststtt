import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import { Handshake, CheckCircle2, TrendingUp, Users, ArrowRight, Building2, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Partnership Program - AI Tool List',
    description: 'Partner with the leading AI tools directory. API access, data integration, and affiliate opportunities.',
};

export default function PartnersPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                {/* Hero */}
                <div className="container mx-auto px-4 max-w-4xl text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold mb-6 border border-primary/20">
                        <Handshake className="h-3.5 w-3.5" /> PARTNER PROGRAM
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Grow with AI Tool List
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Join our ecosystem of AI developers, data aggregators, and tech influencers.
                        Let's build the future of AI discovery together.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button size="lg" className="rounded-full px-8">Become a Partner</Button>
                        <Button variant="outline" size="lg" className="rounded-full px-8">View API</Button>
                    </div>
                </div>

                {/* Integration Types */}
                <section className="container mx-auto px-4 max-w-6xl mb-24">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 border border-border rounded-xl bg-card hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Tool Developers</h3>
                            <p className="text-muted-foreground mb-6 h-20">
                                Get your tool verified, featured, and promoted to thousands of active users looking for solutions like yours.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Verified Badge</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Priority Indexing</li>
                            </ul>
                            <Button variant="outline" className="w-full">Submit Tool</Button>
                        </div>

                        <div className="p-8 border border-border rounded-xl bg-card hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                                <Globe className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">API Integrators</h3>
                            <p className="text-muted-foreground mb-6 h-20">
                                Enrich your platform with our comprehensive database of AI tools, categorization tags, and pricing data.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Real-time Updates</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Structured JSON Data</li>
                            </ul>
                            <Button variant="outline" className="w-full">Request Access</Button>
                        </div>

                        <div className="p-8 border border-border rounded-xl bg-card hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-600 mb-6">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Affiliates & Media</h3>
                            <p className="text-muted-foreground mb-6 h-20">
                                Monetize your audience by recommending the best AI tools found on our platform.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> High Conversion</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Custom Landing Pages</li>
                            </ul>
                            <Button variant="outline" className="w-full">Join Program</Button>
                        </div>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="bg-secondary/5 py-20 border-y border-border">
                    <div className="container mx-auto px-4 text-center max-w-4xl">
                        <h2 className="text-3xl font-bold mb-12">Trusted by Industry Leaders</h2>
                        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Mock Logos */}
                            <div className="text-2xl font-bold">TechCrunch</div>
                            <div className="text-2xl font-bold">ProductHunt</div>
                            <div className="text-2xl font-bold">IndieHackers</div>
                            <div className="text-2xl font-bold">HackerNews</div>
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="container mx-auto px-4 max-w-3xl text-center py-20">
                    <h2 className="text-3xl font-bold mb-6">Ready to work together?</h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Tell us about your company and how you'd like to partner. We review applications weekly.
                    </p>
                    <a href="mailto:partners@aitoollist.com">
                        <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/20">
                            Contact Partnerships
                        </Button>
                    </a>
                </section>

            </main>
            <Footer />
        </div>
    );
}
