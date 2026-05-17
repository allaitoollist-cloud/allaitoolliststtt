import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Cookie, Settings, Shield, Info, CheckCircle, XCircle } from 'lucide-react';

export default function CookiesPage() {
    const sections = [
        {
            icon: Info,
            title: 'What Are Cookies?',
            content: 'Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.',
        },
        {
            icon: Settings,
            title: 'How We Use Cookies',
            content: 'We use cookies to understand how you interact with our website, personalize your experience, and improve our services. Some cookies are essential for the website to function, while others help us analyze traffic and user behavior.',
        },
        {
            icon: CheckCircle,
            title: 'Types of Cookies We Use',
            subsections: [
                {
                    subtitle: 'Essential Cookies',
                    text: 'These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas of the website.',
                },
                {
                    subtitle: 'Performance & Analytics Cookies',
                    text: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.',
                },
                {
                    subtitle: 'Functionality Cookies',
                    text: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.',
                },
                {
                    subtitle: 'Targeting & Advertising Cookies',
                    text: 'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.',
                },
            ],
        },
        {
            icon: XCircle,
            title: 'Managing Cookies',
            content: 'Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you.',
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
                                <Cookie className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                            Cookies Policy
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                            This policy explains how and why we use cookies on AI Tool List.
                        </p>
                        <p className="text-sm text-muted-foreground mt-4">
                            Last Updated: May 17, 2026
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-4xl">
                    <div className="space-y-12">
                        {sections.map((section, index) => (
                            <div key={index} className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <section.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold">{section.title}</h2>
                                </div>

                                <div className="pl-0 md:pl-14">
                                    {section.content && (
                                        <p className="text-muted-foreground leading-relaxed text-lg">
                                            {section.content}
                                        </p>
                                    )}

                                    {section.subsections && (
                                        <div className="space-y-6 mt-4">
                                            {section.subsections.map((sub, subIndex) => (
                                                <div key={subIndex} className="bg-card/50 p-6 rounded-xl border border-white/5">
                                                    <h3 className="text-lg font-bold mb-2 text-foreground">{sub.subtitle}</h3>
                                                    <p className="text-muted-foreground">{sub.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 rounded-lg bg-secondary/30 border border-white/10">
                        <h2 className="text-xl font-bold mb-3">Questions About Cookies?</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have any questions about our use of cookies, please contact us at <a href="mailto:privacy@aitoollist.com" className="text-primary hover:underline">privacy@aitoollist.com</a>.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
