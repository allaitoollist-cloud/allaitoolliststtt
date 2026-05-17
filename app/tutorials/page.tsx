import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Tutorials — Learn AI Tools Step by Step | All AI Tool List',
    description: 'Free video tutorials on the best AI tools. Learn Midjourney, ChatGPT, Runway, prompt engineering and more.',
};
import { Play, Clock, BookOpen, Star, User } from 'lucide-react';

export default function TutorialsPage() {
    const tutorials = [
        {
            id: 1,
            title: "Getting Started with Midjourney v6",
            description: "Learn how to craft perfect prompts and master the new features in Midjourney's latest version.",
            duration: "15 min",
            level: "Beginner",
            author: "Sarah Tech",
            views: "12k",
            thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
            category: "Image Generation"
        },
        {
            id: 2,
            title: "Build a Chatbot with OpenAI API",
            description: "A step-by-step guide to building your own custom chatbot using Python and the GPT-4 API.",
            duration: "45 min",
            level: "Intermediate",
            author: "Dev Mastery",
            views: "8.5k",
            thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
            category: "Development"
        },
        {
            id: 3,
            title: "Mastering Prompt Engineering",
            description: "Advanced techniques to get exactly what you want from LLMs like ChatGPT and Claude.",
            duration: "25 min",
            level: "Advanced",
            author: "AI Whisperer",
            views: "20k",
            thumbnail: "https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&q=80&w=800",
            category: "Productivity"
        },
        {
            id: 4,
            title: "Video Generation with Runway Gen-2",
            description: "Create stunning cinematic videos from text descriptions using Runway's latest model.",
            duration: "20 min",
            level: "Beginner",
            author: "Creative AI",
            views: "5k",
            thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800",
            category: "Video Creation"
        },
        {
            id: 5,
            title: "Automating Workflows with Zapier AI",
            description: "Connect your favorite apps and automate repetitive tasks using AI-powered workflows.",
            duration: "30 min",
            level: "Intermediate",
            author: "Productivity Pro",
            views: "7.2k",
            thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
            category: "Automation"
        },
        {
            id: 6,
            title: "Fine-tuning LLMs for Custom Data",
            description: "Learn how to train open-source models on your own dataset for specialized tasks.",
            duration: "60 min",
            level: "Expert",
            author: "Data Science Dojo",
            views: "3k",
            thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
            category: "Machine Learning"
        }
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
                                    <BookOpen className="h-10 w-10 text-primary" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-b from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-6">
                                AI Video Tutorials
                            </h1>
                            <p className="text-lg leading-8 text-muted-foreground">
                                Master the latest AI tools with our curated collection of video tutorials and guides.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tutorials Grid */}
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tutorials.map((tutorial) => (
                            <Card key={tutorial.id} className="group overflow-hidden bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col h-full">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={tutorial.thumbnail}
                                        alt={tutorial.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full group-hover:scale-110 transition-transform">
                                            <Play className="h-6 w-6 text-white fill-white" />
                                        </div>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-black/50 backdrop-blur-md border-0 text-white hover:bg-black/70">
                                            {tutorial.category}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-4 right-4">
                                        <Badge variant="secondary" className="bg-black/70 backdrop-blur-md text-white border-0">
                                            {tutorial.duration}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge variant="outline" className={`
                      ${tutorial.level === 'Beginner' ? 'text-green-400 border-green-400/30 bg-green-400/10' : ''}
                      ${tutorial.level === 'Intermediate' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' : ''}
                      ${tutorial.level === 'Advanced' || tutorial.level === 'Expert' ? 'text-red-400 border-red-400/30 bg-red-400/10' : ''}
                    `}>
                                            {tutorial.level}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                            4.8
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                        {tutorial.title}
                                    </h3>

                                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2 flex-grow">
                                        {tutorial.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            {tutorial.author}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {tutorial.views} views
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Button variant="outline" size="lg">
                            View All Tutorials
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
