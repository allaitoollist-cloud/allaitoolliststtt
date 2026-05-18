'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Save, Loader2, Key, Eye, EyeOff } from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';

export default function SiteSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [showOpenAI, setShowOpenAI] = useState(false);
    const [settings, setSettings] = useState({
        site_title: '',
        site_description: '',
        meta_keywords: '',
        logo_url: '',
        facebook_url: '',
        twitter_url: '',
        linkedin_url: '',
        instagram_url: '',
        openai_api_key: '',
    });
    const { toast } = useToast();
    const supabase = getBrowserClient();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const { data } = await supabase.from('site_settings').select('*');
        if (data) {
            const settingsObj: any = {};
            data.forEach(item => {
                settingsObj[item.key] = item.value || '';
            });
            setSettings(settingsObj);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            for (const [key, value] of Object.entries(settings)) {
                await supabase
                    .from('site_settings')
                    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
            }
            toast({ title: 'Success', description: 'Settings saved successfully' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold">Site Settings</h1>
                <p className="text-muted-foreground">Customize your site configuration</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Site Title</Label>
                        <Input
                            value={settings.site_title}
                            onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                            placeholder="AI Tool List"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Site Description</Label>
                        <Textarea
                            value={settings.site_description}
                            onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                            placeholder="The most comprehensive directory of AI tools"
                            rows={3}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Meta Keywords (comma separated)</Label>
                        <Input
                            value={settings.meta_keywords}
                            onChange={(e) => setSettings({ ...settings, meta_keywords: e.target.value })}
                            placeholder="AI tools, artificial intelligence, AI directory"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Logo URL</Label>
                        <Input
                            value={settings.logo_url}
                            onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                            placeholder="/logo.png"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Social Media Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Facebook URL</Label>
                        <Input
                            value={settings.facebook_url}
                            onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                            placeholder="https://facebook.com/yourpage"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Twitter/X URL</Label>
                        <Input
                            value={settings.twitter_url}
                            onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                            placeholder="https://twitter.com/yourhandle"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>LinkedIn URL</Label>
                        <Input
                            value={settings.linkedin_url}
                            onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                            placeholder="https://linkedin.com/company/yourcompany"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Instagram URL</Label>
                        <Input
                            value={settings.instagram_url}
                            onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                            placeholder="https://instagram.com/yourhandle"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-primary" />
                        API Keys
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Keys are stored securely in the database.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>OpenAI API Key</Label>
                        <div className="relative">
                            <Input
                                type={showOpenAI ? 'text' : 'password'}
                                value={settings.openai_api_key}
                                onChange={(e) => setSettings({ ...settings, openai_api_key: e.target.value })}
                                placeholder="sk-proj-..."
                                className="pr-10 font-mono text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOpenAI(!showOpenAI)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showOpenAI ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">Used for AI blog generation. Get your key from platform.openai.com</p>
                    </div>
                </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                    </>
                )}
            </Button>
        </div>
    );
}
