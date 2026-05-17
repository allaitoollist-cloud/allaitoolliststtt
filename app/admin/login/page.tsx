'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getBrowserClient } from '@/lib/supabase-browser';

const ALLOWED_ADMIN_EMAILS = [
    'muhammadismailkpt@gmail.com',
    'allaitoolist@gmail.com',
];

export default function AdminLoginPage() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = getBrowserClient();

            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error || !data.user) {
                toast({
                    title: 'Access Denied',
                    description: error?.message || 'Invalid email or password',
                    variant: 'destructive',
                });
                return;
            }

            // Check if this email is allowed as admin
            if (!ALLOWED_ADMIN_EMAILS.includes(data.user.email || '')) {
                await supabase.auth.signOut();
                toast({
                    title: 'Access Denied',
                    description: 'You do not have admin access.',
                    variant: 'destructive',
                });
                return;
            }

            toast({ title: 'Welcome Admin!', description: 'Login successful' });
            router.push('/admin');
            router.refresh();

        } catch {
            toast({ title: 'Error', description: 'Something went wrong. Try again.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Admin Portal</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Sign in with your Supabase account
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Login to Dashboard'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
