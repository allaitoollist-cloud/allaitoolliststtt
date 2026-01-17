import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import { Briefcase, MapPin, Users, Heart, Zap, Coffee, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Careers at AI Tool List - Join Our Team',
    description: 'Help us build the world\'s best AI tools directory. View open positions and learn about our remote-first culture.',
};

export default function CareersPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                {/* Hero */}
                <div className="container mx-auto px-4 max-w-4xl text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Join the AI Revolution
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        We're on a mission to organize the world's artificial intelligence tools.
                        Come help us build the future of software discovery.
                    </p>
                </div>

                {/* Values Section */}
                <section className="container mx-auto px-4 max-w-6xl mb-24">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-secondary/5 border border-border rounded-2xl p-8 hover:border-primary/20 transition-colors">
                            <Zap className="h-10 w-10 text-primary mb-6" />
                            <h3 className="text-xl font-bold mb-3">Move Fast</h3>
                            <p className="text-muted-foreground">
                                The AI landscape changes daily. We ship fast, iterate often, and learn constantly.
                            </p>
                        </div>
                        <div className="bg-secondary/5 border border-border rounded-2xl p-8 hover:border-primary/20 transition-colors">
                            <Users className="h-10 w-10 text-primary mb-6" />
                            <h3 className="text-xl font-bold mb-3">User First</h3>
                            <p className="text-muted-foreground">
                                We obsess over finding the right tools for our users, not just what's trendy.
                            </p>
                        </div>
                        <div className="bg-secondary/5 border border-border rounded-2xl p-8 hover:border-primary/20 transition-colors">
                            <Heart className="h-10 w-10 text-primary mb-6" />
                            <h3 className="text-xl font-bold mb-3">Remote First</h3>
                            <p className="text-muted-foreground">
                                Work from anywhere. We care about your output, not your time zone.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Open Positions */}
                <section className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold mb-10">Open Positions</h2>

                    <div className="space-y-4">
                        {/* Mock Positions */}
                        <div className="group flex items-center justify-between p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer">
                            <div>
                                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">Senior Frontend Engineer</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> Engineering</span>
                                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Remote (Global)</span>
                                </div>
                            </div>
                            <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">Apply Now</Button>
                        </div>

                        <div className="group flex items-center justify-between p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer">
                            <div>
                                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">Content Marketing Manager</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Coffee className="h-3.5 w-3.5" /> Marketing</span>
                                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Remote (US/EU)</span>
                                </div>
                            </div>
                            <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">Apply Now</Button>
                        </div>

                        <div className="group flex items-center justify-between p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer">
                            <div>
                                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">AI Research Analyst</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> Research</span>
                                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Remote (Global)</span>
                                </div>
                            </div>
                            <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">Apply Now</Button>
                        </div>
                    </div>

                    <div className="mt-12 text-center bg-secondary/10 rounded-xl p-8 border border-border/50">
                        <h3 className="text-xl font-bold mb-2">Don't see your role?</h3>
                        <p className="text-muted-foreground mb-6">
                            We're always looking for talented individuals. Send us your resume.
                        </p>
                        <a href="mailto:careers@aitoollist.com" className="text-primary font-bold hover:underline inline-flex items-center gap-2">
                            Email Careers <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
