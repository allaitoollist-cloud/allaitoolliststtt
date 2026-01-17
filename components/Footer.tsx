'use client';

import Link from 'next/link';
import { Bot, Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Youtube, Instagram, Github, ArrowRight, Sparkles } from 'lucide-react';
import { NewsletterForm } from '@/components/NewsletterForm';

export function Footer() {
    const footerLinks = {
        platform: [
            { label: 'Browse Tools', href: '/categories' },
            { label: 'Top 10 Rankings', href: '/top-10' },
            { label: 'New Tools', href: '/new' },
            { label: 'Trending', href: '/trending' },
            { label: 'Submit Tool', href: '/submit' },
        ],
        resources: [
            { label: 'AI News', href: '/news' },
            { label: 'Tutorials', href: '/tutorials' },
            { label: 'Blog', href: '/blog' },
            { label: 'API Documentation', href: '/api' },
            { label: 'Advertise', href: '/advertise' },
        ],
        company: [
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Careers', href: '/careers' },
            { label: 'Press Kit', href: '/press' },
            { label: 'Partners', href: '/partners' },
        ],
        legal: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
            { label: 'DMCA', href: '/dmca' },
            { label: 'Disclaimer', href: '/disclaimer' },
        ],
    };

    const socialLinks = [
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-blue-400 hover:bg-blue-400/10' },
        { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:text-blue-600 hover:bg-blue-600/10' },
        { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-500 hover:bg-blue-500/10' },
        { icon: Youtube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:text-red-500 hover:bg-red-500/10' },
        { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-pink-500 hover:bg-pink-500/10' },
        { icon: Github, href: 'https://github.com', label: 'GitHub', color: 'hover:text-gray-400 hover:bg-gray-400/10' },
    ];

    const categories = [
        'Text & Writing', 'Image Generation', 'Video & Audio', 'Code & Development',
        'Productivity', 'Marketing', 'Design', 'Data & Analytics'
    ];

    return (
        <footer className="relative border-t border-white/10 bg-gradient-to-b from-background via-background to-background/95 overflow-hidden">
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 blur-3xl opacity-30" />
                <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 blur-3xl opacity-20" />
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 md:gap-12">
                    {/* Brand Section - Spans 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center space-x-3 group w-fit">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition-all" />
                                <div className="relative bg-gradient-to-br from-primary/20 to-purple-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform border border-white/10">
                                    <Bot className="h-7 w-7 text-primary" />
                                </div>
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-white via-white/90 to-gray-400 bg-clip-text text-transparent">
                                AI Tool List
                            </span>
                        </Link>

                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                            Your ultimate directory of AI-powered tools. Discover, compare, and choose the best AI solutions for your needs.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 text-sm">
                            <a href="mailto:hello@aitoollist.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <span>hello@aitoollist.com</span>
                            </a>
                            <a href="https://wa.me/13073464572" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-bright-green transition-colors group">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-bright-green/10 transition-colors">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <span>+1 (307) 346-4572</span>
                            </a>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <span>San Francisco, CA</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-2 pt-2">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-2.5 rounded-lg bg-white/5 border border-white/10 transition-all hover:scale-110 hover:border-white/20 ${social.color}`}
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div className="space-y-5">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-foreground flex items-center gap-2">
                            <span className="h-px w-4 bg-gradient-to-r from-primary to-transparent" />
                            Platform
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.platform.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                                    >
                                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div className="space-y-5">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-foreground flex items-center gap-2">
                            <span className="h-px w-4 bg-gradient-to-r from-purple-500 to-transparent" />
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                                    >
                                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="space-y-5">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-foreground flex items-center gap-2">
                            <span className="h-px w-4 bg-gradient-to-r from-pink-500 to-transparent" />
                            Company
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                                    >
                                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="space-y-5">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-foreground flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-yellow-400" />
                            Newsletter
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Get weekly updates on new AI tools and trends.
                        </p>
                        <div className="pt-1">
                            <NewsletterForm />
                        </div>
                        <p className="text-xs text-muted-foreground/70">
                            By subscribing, you agree to our Privacy Policy.
                        </p>
                    </div>
                </div>

                {/* Popular Categories */}
                <div className="mt-16 pt-10 border-t border-white/10">
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                        <span className="h-px w-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
                        Popular Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Link
                                key={category}
                                href={`/category/${encodeURIComponent(category)}`}
                                className="group relative px-4 py-2 text-xs font-medium rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 transition-all hover:scale-105"
                            >
                                <span className="relative z-10">{category}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 bg-background/90 backdrop-blur-sm">
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-sm text-muted-foreground text-center md:text-left">
                            © {new Date().getFullYear()} <span className="font-semibold text-foreground">AI Tool List</span>. All rights reserved.
                        </p>

                        {/* Legal Links */}
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            {footerLinks.legal.map((link, index) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Built with badge */}
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">Built by</span>
                            <span className="font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                One to Five Click
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
