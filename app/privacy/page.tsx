import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Shield, Lock, Eye, Database, UserCheck, Mail, Cookie, Globe } from 'lucide-react';

export default function PrivacyPolicyPage() {
    const sections = [
        {
            icon: Database,
            title: '1. Information We Collect',
            content: [
                {
                    subtitle: 'Personal Information',
                    text: 'When you use AI Tool List, we may collect personal information that you voluntarily provide, including but not limited to: name, email address, company name, and any other information you choose to provide when submitting tools, creating an account, or subscribing to our newsletter.',
                },
                {
                    subtitle: 'Usage Data',
                    text: 'We automatically collect certain information about your device and how you interact with our website, including: IP address, browser type, operating system, pages visited, time spent on pages, links clicked, and referring website addresses.',
                },
                {
                    subtitle: 'Cookies and Tracking',
                    text: 'We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.',
                },
            ],
        },
        {
            icon: Eye,
            title: '2. How We Use Your Information',
            content: [
                {
                    subtitle: 'Service Provision',
                    text: 'We use your information to provide, maintain, and improve our services, including displaying AI tool listings, processing submissions, and personalizing your experience.',
                },
                {
                    subtitle: 'Communication',
                    text: 'We may use your email address to send you newsletters, marketing materials, and updates about our services. You can opt-out of these communications at any time.',
                },
                {
                    subtitle: 'Analytics and Improvement',
                    text: 'We analyze usage data to understand how users interact with our website, identify trends, and improve our services and user experience.',
                },
                {
                    subtitle: 'Legal Compliance',
                    text: 'We may use your information to comply with legal obligations, resolve disputes, and enforce our agreements.',
                },
            ],
        },
        {
            icon: Lock,
            title: '3. Data Security',
            content: [
                {
                    subtitle: 'Security Measures',
                    text: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.',
                },
                {
                    subtitle: 'Data Retention',
                    text: 'We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.',
                },
            ],
        },
        {
            icon: Globe,
            title: '4. Information Sharing',
            content: [
                {
                    subtitle: 'Third-Party Service Providers',
                    text: 'We may share your information with third-party service providers who perform services on our behalf, such as hosting, analytics, email delivery, and customer support. These providers are contractually obligated to protect your information.',
                },
                {
                    subtitle: 'Business Transfers',
                    text: 'In the event of a merger, acquisition, or sale of assets, your personal information may be transferred. We will notify you before your information becomes subject to a different privacy policy.',
                },
                {
                    subtitle: 'Legal Requirements',
                    text: 'We may disclose your information if required by law, court order, or governmental authority, or when we believe disclosure is necessary to protect our rights or comply with legal processes.',
                },
            ],
        },
        {
            icon: UserCheck,
            title: '5. Your Rights',
            content: [
                {
                    subtitle: 'Access and Correction',
                    text: 'You have the right to access, update, or correct your personal information at any time by contacting us or accessing your account settings.',
                },
                {
                    subtitle: 'Data Deletion',
                    text: 'You may request deletion of your personal information, subject to certain legal obligations that may require us to retain certain data.',
                },
                {
                    subtitle: 'Opt-Out',
                    text: 'You can opt-out of receiving marketing communications from us by following the unsubscribe link in our emails or contacting us directly.',
                },
                {
                    subtitle: 'Do Not Track',
                    text: 'We currently do not respond to Do Not Track (DNT) signals. However, you can disable cookies in your browser settings.',
                },
            ],
        },
        {
            icon: Cookie,
            title: '6. Cookies Policy',
            content: [
                {
                    subtitle: 'Essential Cookies',
                    text: 'These cookies are necessary for the website to function properly and cannot be disabled. They include session cookies and security cookies.',
                },
                {
                    subtitle: 'Analytics Cookies',
                    text: 'We use analytics cookies to understand how visitors interact with our website, helping us improve our services.',
                },
                {
                    subtitle: 'Marketing Cookies',
                    text: 'These cookies track your browsing habits to deliver personalized advertisements and measure the effectiveness of our marketing campaigns.',
                },
            ],
        },
        {
            icon: Shield,
            title: '7. Children\'s Privacy',
            content: [
                {
                    subtitle: 'Age Restriction',
                    text: 'Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.',
                },
            ],
        },
        {
            icon: Mail,
            title: '8. International Data Transfers',
            content: [
                {
                    subtitle: 'Cross-Border Transfers',
                    text: 'Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We ensure appropriate safeguards are in place for such transfers.',
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative isolate overflow-hidden pt-16 md:pt-24 pb-12 md:pb-16 border-b border-white/10">
                    <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8 text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="bg-primary/10 p-4 rounded-2xl">
                                <Shield className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                        </p>
                        <p className="text-sm text-muted-foreground mt-4">
                            Last Updated: May 17, 2026
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-4xl">
                    {/* Introduction */}
                    <div className="prose prose-invert max-w-none mb-12">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            At AI Tool List, we are committed to protecting your privacy and ensuring the security of your personal information.
                            This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website
                            and use our services.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            By accessing or using AI Tool List, you agree to this Privacy Policy. If you do not agree with our policies and practices,
                            please do not use our services.
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-12">
                        {sections.map((section, index) => (
                            <div key={index} className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <section.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold">{section.title}</h2>
                                </div>

                                <div className="space-y-6 pl-0 md:pl-14">
                                    {section.content.map((item, itemIndex) => (
                                        <div key={itemIndex} className="space-y-2">
                                            <h3 className="text-lg font-semibold text-foreground">
                                                {item.subtitle}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Changes to Policy */}
                    <div className="mt-12 p-6 rounded-lg bg-primary/5 border border-primary/20">
                        <h2 className="text-xl font-bold mb-3">Changes to This Privacy Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational,
                            legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page
                            and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
                        </p>
                    </div>

                    {/* Contact Information */}
                    <div className="mt-12 p-6 rounded-lg bg-secondary/30 border border-white/10">
                        <h2 className="text-xl font-bold mb-3">Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                        </p>
                        <div className="space-y-2 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <a href="mailto:privacy@aitoollist.com" className="hover:text-primary transition-colors">
                                    privacy@aitoollist.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-primary" />
                                <span>AI Tool List, San Francisco, CA 94102, USA</span>
                            </div>
                        </div>
                    </div>

                    {/* GDPR Notice */}
                    <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">For EU Users:</strong> If you are located in the European Economic Area (EEA),
                            you have certain rights under the General Data Protection Regulation (GDPR), including the right to access, rectify,
                            erase, restrict processing, and data portability. To exercise these rights, please contact us at the email above.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
