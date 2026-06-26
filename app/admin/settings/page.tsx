'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Save, Loader2, Key, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';

const DEFAULT_SETTINGS = {
    site_title: '',
    site_description: '',
    meta_keywords: '',
    logo_url: '',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    instagram_url: '',
    openai_api_key: '',
};

export default function SiteSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [showOpenAI, setShowOpenAI] = useState(false);
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const { toast } = useToast();
    const supabase = getBrowserClient();

    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || '';
    };

    useEffect(() => {
        getToken().then(token => {
            fetch('/api/settings', { headers: { 'x-admin-token': token } })
                .then(r => r.json())
                .then(data => {
                    if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
                })
                .catch(() => {})
                .finally(() => setLoadingData(false));
        });
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setSaved(false);
        try {
            const token = await getToken();
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
                body: JSON.stringify({ settings }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            toast({ title: 'Saved!', description: 'Settings saved successfully.' });
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Failed to save settings', variant: 'destructive' });
        }
        setLoading(false);
    };

    const set = (key: keyof typeof DEFAULT_SETTINGS) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setSettings(prev => ({ ...prev, [key]: e.target.value }));

    if (loadingData) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold">Site Settings</h1>
                <p className="text-muted-foreground">Customize your site configuration</p>
            </div>

            <Card>
                <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Site Title</Label>
                        <Input value={settings.site_title} onChange={set('site_title')} placeholder="AI Tool List" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Site Description</Label>
                        <Textarea value={settings.site_description} onChange={set('site_description')}
                            placeholder="The most comprehensive directory of AI tools" rows={3} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Meta Keywords (comma separated)</Label>
                        <Input value={settings.meta_keywords} onChange={set('meta_keywords')}
                            placeholder="AI tools, artificial intelligence, AI directory" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Logo URL</Label>
                        <Input value={settings.logo_url} onChange={set('logo_url')} placeholder="/logo.png" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Social Media Links</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Facebook URL</Label>
                        <Input value={settings.facebook_url} onChange={set('facebook_url')} placeholder="https://facebook.com/yourpage" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Twitter/X URL</Label>
                        <Input value={settings.twitter_url} onChange={set('twitter_url')} placeholder="https://twitter.com/yourhandle" />
                    </div>
                    <div className="grid gap-2">
                        <Label>LinkedIn URL</Label>
                        <Input value={settings.linkedin_url} onChange={set('linkedin_url')} placeholder="https://linkedin.com/company/yourcompany" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Instagram URL</Label>
                        <Input value={settings.instagram_url} onChange={set('instagram_url')} placeholder="https://instagram.com/yourhandle" />
                    </div>
                </CardContent>
            </Card>

            {/* API Keys */}
            <Card className="border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-primary" />
                        API Keys
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Stored securely via server-side API (not exposed to browser).</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>OpenAI API Key</Label>
                        <div className="relative">
                            <Input
                                type={showOpenAI ? 'text' : 'password'}
                                value={settings.openai_api_key}
                                onChange={set('openai_api_key')}
                                placeholder="sk-proj-..."
                                className="pr-10 font-mono text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOpenAI(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showOpenAI ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Used for AI blog generation. Get your key from{' '}
                            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer"
                                className="text-primary hover:underline">platform.openai.com</a>
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto gap-2">
                {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
                ) : saved ? (
                    <><CheckCircle2 className="h-4 w-4 text-green-400" />Saved!</>
                ) : (
                    <><Save className="h-4 w-4" />Save Settings</>
                )}
            </Button>
        </div>
    );
}
