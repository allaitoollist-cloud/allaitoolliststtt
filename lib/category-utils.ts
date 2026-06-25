// Replace any legacy competitor branding in category names
export function formatCategoryName(name: string): string {
    return name.replace(/AIxploria/gi, 'All AI Tool List');
}
