'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

const MAX_MESSAGE = 3000;
const MAX_SUBJECT = 200;

const formSchema = z.object({
    name:    z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    email:   z.string().email('Invalid email address').max(200),
    subject: z.string().min(5, 'Subject must be at least 5 characters').max(MAX_SUBJECT, `Max ${MAX_SUBJECT} characters`),
    message: z.string().min(10, 'Message must be at least 10 characters').max(MAX_MESSAGE, `Max ${MAX_MESSAGE} characters`),
});

export function ContactForm() {
    const [loading, setLoading]   = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const startTimeRef = useRef<number>(Date.now());
    const { toast } = useToast();

    useEffect(() => {
        startTimeRef.current = Date.now();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', email: '', subject: '', message: '' },
    });

    const messageValue = form.watch('message');
    const subjectValue = form.watch('subject');

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...values,
                    website_honey: '',              // honeypot — bots fill this
                    submission_start_time: String(startTimeRef.current),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast({
                    title: 'Error',
                    description: data.error || 'Failed to send message. Please try again.',
                    variant: 'destructive',
                });
                return;
            }

            setSubmitted(true);
            form.reset();
        } catch {
            toast({
                title: 'Error',
                description: 'Network error. Please check your connection and try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold">Message Sent!</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                    We've received your message and sent a confirmation to your email. We'll reply within 24–48 hours.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Send Another Message
                </Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                {/* Honeypot — hidden from real users, bots fill it */}
                <div style={{ display: 'none' }} aria-hidden="true">
                    <input
                        type="text"
                        name="website_honey"
                        tabIndex={-1}
                        autoComplete="off"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Subject</FormLabel>
                                <span className={`text-xs ${subjectValue.length > MAX_SUBJECT * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                    {subjectValue.length}/{MAX_SUBJECT}
                                </span>
                            </div>
                            <FormControl>
                                <Input placeholder="What is this regarding?" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Message</FormLabel>
                                <span className={`text-xs ${messageValue.length > MAX_MESSAGE * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                    {messageValue.length}/{MAX_MESSAGE}
                                </span>
                            </div>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe your question or feedback in detail..."
                                    className="min-h-[140px] resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
                    ) : (
                        <><Send className="mr-2 h-4 w-4" />Send Message</>
                    )}
                </Button>
            </form>
        </Form>
    );
}
