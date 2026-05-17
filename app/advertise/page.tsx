import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Megaphone, Target, Users, BarChart, CheckCircle, Mail } from 'lucide-react';

export default function AdvertisePage() {
    const benefits = [
        {
            icon: Users,
            title: 'Reach Targeted Audience',
            description: 'Connect with thousands of AI enthusiasts, developers, and early adopters actively looking for new tools.',
        },
        {
            icon: Target,
            title: 'High Intent Traffic',
            description: 'Our visitors are here to discover and try new AI software, making them high-quality leads for your product.',
        },
        {
            icon: BarChart,
            title: 'Measurable Results',
            description: 'Track clicks and engagement. We provide detailed reports on how your sponsored placement is performing.',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative isolate overflow-hidden pt-24 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <div className="flex justify-center mb-6">
                                <div className="bg-primary/10 p-3 rounded-2xl">
                                    <Megaphone className="h-10 w-10 text-primary" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-b from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-6">
                                Advertise Your AI Tool & Drive Growth
                            </h1>
                            <p className="text-lg leading-8 text-muted-foreground">
                                Showcase your product to 50,000+ monthly AI enthusiasts. From featured listings to dedicated reviews, get the visibility your tool deserves.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="border-y border-white/5 bg-white/5">
                    <div className="container mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">50k+</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Monthly Visitors</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">10k+</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Newsletter Subscribers</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">5%</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Avg. Click-Through Rate</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="container mx-auto px-4 py-20 max-w-7xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Advertise on AI Tool List?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit) => (
                            <Card key={benefit.title} className="p-8 bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-6">
                                    <benefit.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                                <p className="text-muted-foreground">{benefit.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="container mx-auto px-4 py-12 max-w-3xl">
                    <Card className="p-8 md:p-12 bg-gradient-to-b from-secondary/50 to-background border-border/50">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                            <p className="text-muted-foreground">
                                Interested in banner ads, newsletter sponsorships, or custom packages? Fill out the form below and our team will get back to you.
                            </p>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="John Doe" className="bg-background/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Work Email</Label>
                                    <Input id="email" type="email" placeholder="john@company.com" className="bg-background/50" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="company">Company / Tool Name</Label>
                                <Input id="company" placeholder="Your AI Tool" className="bg-background/50" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="interest">Interested In</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    <option>Newsletter Sponsorship</option>
                                    <option>Homepage Banner Ad</option>
                                    <option>Dedicated Blog Review</option>
                                    <option>Custom Partnership</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Tell us about your goals and budget..."
                                    className="bg-background/50 min-h-[120px]"
                                />
                            </div>

                            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg">
                                <Mail className="mr-2 h-5 w-5" />
                                Request Media Kit
                            </Button>
                        </form>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
