'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, CheckCircle2, XCircle, Bot } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AIAutomationPage() {
    const { toast } = useToast();
    const [urls, setUrls] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const handleGenerate = async () => {
        if (!urls.trim()) {
            toast({ title: 'Error', description: 'Please enter at least one URL', variant: 'destructive' });
            return;
        }
        if (!apiKey.trim()) {
            toast({ title: 'Error', description: 'Please enter your OpenAI API Key', variant: 'destructive' });
            return;
        }

        setLoading(true);
        setResults([]);

        const urlList = urls.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);

        try {
            const response = await fetch('/api/ai-automation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls: urlList, openaiKey: apiKey }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Automation failed');
            }

            setResults(data.results);
            toast({ title: 'Automation Complete', description: 'Check the results below.' });

        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Bot className="h-8 w-8 text-purple-500" />
                        AI Auto-Generator
                    </h1>
                    <p className="text-muted-foreground">Automatically scrape tools, generate details, and write blogs using ChatGPT.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Configuration</CardTitle>
                            <CardDescription>Enter your OpenAI API Key (not saved for security)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Input
                                type="password"
                                placeholder="sk-..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Uses GPT-3.5-Turbo. 10 tools ≈ $0.05 cost.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>2. Tool Sources</CardTitle>
                            <CardDescription>Paste URLs of new AI tools (one per line)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                className="min-h-[200px] font-mono text-sm"
                                placeholder={"https://tool1.ai\nhttps://tool2.ai\nhttps://tool3.ai"}
                                value={urls}
                                onChange={(e) => setUrls(e.target.value)}
                            />
                            <div className="flex items-center justify-between">
                                <Badge variant="outline">
                                    {urls.split(/[\n,]+/).filter(u => u.trim()).length} URLs detected
                                </Badge>
                                <Button onClick={handleGenerate} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Start Automation
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Live Results</h2>

                    {results.length === 0 && !loading && (
                        <Alert className="bg-muted/50 border-dashed">
                            <Bot className="h-4 w-4" />
                            <AlertTitle>Ready to Automate</AlertTitle>
                            <AlertDescription>
                                Input URLs and click Start. The AI will scrape the site, extract details, and save them as <strong>Drafts</strong> in your Tools list.
                            </AlertDescription>
                        </Alert>
                    )}

                    {loading && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Loader2 className="h-12 w-12 animate-spin mb-4 text-purple-500" />
                            <p>Analyzing websites and writing content...</p>
                            <p className="text-sm">This may take 30-60 seconds.</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {results.map((res, idx) => (
                            <Card key={idx} className={res.status === 'success' ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}>
                                <CardContent className="p-4 flex items-start gap-4">
                                    {res.status === 'success' ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                                    )}
                                    <div className="space-y-1 overflow-hidden">
                                        <p className="font-medium truncate">{res.url}</p>
                                        {res.status === 'success' ? (
                                            <>
                                                <p className="text-sm text-green-600">
                                                    Created: <strong>{res.tool}</strong>
                                                </p>
                                                <Badge variant="outline" className="text-xs bg-background/50">
                                                    Status: Draft
                                                </Badge>
                                            </>
                                        ) : (
                                            <p className="text-sm text-red-600">{res.message}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
