import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, FileText, Settings, LogOut, PlusCircle, Mail, FolderOpen, Activity, MessageSquare, Bot } from 'lucide-react';

export function Sidebar() {
    return (
        <aside className="w-64 border-r border-white/10 bg-card/50 hidden md:flex flex-col">
            <div className="p-6 border-b border-white/10">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
                    <span className="bg-primary/10 p-1 rounded text-primary">AI</span>
                    <span>Admin</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <SidebarLink href="/admin" icon={LayoutDashboard}>Dashboard</SidebarLink>
                <SidebarLink href="/admin/submissions" icon={FileText}>Submissions</SidebarLink>
                <SidebarLink href="/admin/tools" icon={PlusCircle}>Manage Tools</SidebarLink>
                <SidebarLink href="/admin/categories" icon={FolderOpen}>Categories</SidebarLink>
                <SidebarLink href="/admin/automation" icon={Bot}>AI Automation</SidebarLink>
                <SidebarLink href="/admin/blogs" icon={FileText}>Blogs</SidebarLink>
                <SidebarLink href="/admin/newsletter" icon={Mail}>Newsletter</SidebarLink>
                <SidebarLink href="/admin/users" icon={Users}>Users</SidebarLink>
                <SidebarLink href="/admin/reviews" icon={MessageSquare}>Reviews</SidebarLink>
                <SidebarLink href="/admin/contact-messages" icon={Mail}>Contact Messages</SidebarLink>
                <SidebarLink href="/admin/activity" icon={Activity}>Activity Logs</SidebarLink>
                <SidebarLink href="/admin/settings" icon={Settings}>Settings</SidebarLink>
            </nav>

            <div className="p-4 border-t border-white/10">
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </aside>
    );
}

function SidebarLink({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
            <Icon className="h-4 w-4" />
            {children}
        </Link>
    );
}
