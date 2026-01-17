'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, CheckCircle2 } from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const supabase = getBrowserClient();

    useEffect(() => {
        // Verify we have a session (link clicked)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // If no session, maybe render a message or redirect
                // But normally the reset link logs them in automatically
            }
        });
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccess(true);
            toast({
                title: 'Password Updated',
                description: 'Your password has been changed successfully.',
            });

            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md p-8 space-y-6">
                    {!success ? (
                        <>
                            <div className="text-center space-y-2">
                                <div className="flex justify-center mb-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Lock className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <h1 className="text-2xl font-bold">Set New Password</h1>
                                <p className="text-muted-foreground">
                                    Enter your new password below.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex justify-center">
                                <CheckCircle2 className="h-16 w-16 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold">All Set!</h2>
                            <p className="text-muted-foreground">
                                Your password has been updated. Redirecting to login...
                            </p>
                        </div>
                    )}
                </Card>
            </main>
            <Footer />
        </div>
    );
}
