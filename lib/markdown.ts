// Shared date formatter - consistent across server and client
// Uses UTC to avoid timezone differences
export function formatBlogDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const month = monthNames[date.getUTCMonth()];
        const day = date.getUTCDate();
        return `${month} ${day}, ${year}`;
    } catch {
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch {
            return dateString;
        }
    }
}

// Shared markdown to HTML converter function
export function markdownToHtml(markdown: string): string {
    let html = markdown
        // Headers (order matters - most specific first)
        .replace(/^###### (.*$)/gim, '<h6 class="text-lg font-bold mt-6 mb-3">$1</h6>')
        .replace(/^##### (.*$)/gim, '<h5 class="text-xl font-bold mt-6 mb-3">$1</h5>')
        .replace(/^#### (.*$)/gim, '<h4 class="text-xl font-bold mt-7 mb-4">$1</h4>')
        .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-10 mb-6">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-12 mb-8">$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" class="text-primary hover:underline">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^\)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto my-8 rounded-lg" />')
        .replace(/^\- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
        .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-6 mb-2">$2</li>')
        .replace(/`([^`]+)`/gim, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono">$1</code>')
        .replace(/```([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-lg my-6 overflow-x-auto"><code class="font-mono text-sm">$1</code></pre>')
        .replace(/> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">$1</blockquote>')
        .replace(/\n\n/gim, '</p><p class="mb-4">')
        .replace(/\n/gim, '<br />');

    return `<p class="mb-4">${html}</p>`;
}

