import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="text-center max-w-2xl">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-bright-green via-local-blue to-bright-green">
                        404
                    </h1>
                </div>

                {/* Error Message */}
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Page Not Found
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                    Sorry, we couldn't find the page you're looking for. The AI tool or category you're searching for might have been moved or doesn't exist.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <Button size="lg" className="bg-bright-green hover:bg-bright-green-hover text-white">
                            <Home className="mr-2 h-5 w-5" />
                            Back to Home
                        </Button>
                    </Link>

                    <Link href="/#search">
                        <Button size="lg" variant="outline" className="border-bright-green text-bright-green hover:bg-bright-green hover:text-white">
                            <Search className="mr-2 h-5 w-5" />
                            Search Tools
                        </Button>
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-4">Popular Categories:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {['Image', 'Video', 'Code', 'Writing', 'Chat', 'Design'].map((category) => (
                            <Link key={category} href={`/category/${category}`}>
                                <Button variant="ghost" size="sm" className="text-local-blue hover:text-local-blue-hover">
                                    {category}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
