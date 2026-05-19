import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getServerUser() {
    const cookieStore = cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Server component cannot set cookies
                    }
                },
                remove(name: string, options: any) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // Server component cannot remove cookies
                    }
                },
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return null;
    }

    return session.user;
}

export async function isAdmin() {
    const user = await getServerUser();

    if (!user) {
        return false;
    }

    const cookieStore = cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Server component cannot set cookies
                    }
                },
                remove(name: string, options: any) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // Server component cannot remove cookies
                    }
                },
            },
        }
    );

    // HARDCODED ACCESS for your specific emails
    const allowedEmails = ['muhammadismailkpt@gmail.com', 'allaitoolist@gmail.com'];
    if (user.email && allowedEmails.includes(user.email)) {
        return true;
    }

    const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    return profile?.is_admin || false;
}

export async function requireAdmin() {
    const admin = await isAdmin();

    if (!admin) {
        return false;
    }

    return true;
}
