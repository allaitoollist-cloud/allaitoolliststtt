'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Link as LinkIcon, Image, List, ListOrdered, Quote, Code } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
    const [activeTab, setActiveTab] = useState('edit');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertText = (before: string, after: string = '', placeholder: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end) || placeholder;
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newText);

        // Set cursor position
        setTimeout(() => {
            textarea.focus();
            if (selectedText === placeholder) {
                textarea.setSelectionRange(start + before.length, start + before.length + placeholder.length);
            } else {
                textarea.setSelectionRange(start + before.length + selectedText.length + after.length, start + before.length + selectedText.length + after.length);
            }
        }, 0);
    };

    const formatBold = () => insertText('**', '**', 'bold text');
    const formatItalic = () => insertText('*', '*', 'italic text');
    const formatH1 = () => insertText('# ', '', 'Heading 1');
    const formatH2 = () => insertText('## ', '', 'Heading 2');
    const formatH3 = () => insertText('### ', '', 'Heading 3');
    const formatH4 = () => insertText('#### ', '', 'Heading 4');
    const formatH5 = () => insertText('##### ', '', 'Heading 5');
    const formatH6 = () => insertText('###### ', '', 'Heading 6');
    const formatLink = () => insertText('[', '](url)', 'link text');
    const formatImage = () => insertText('![', '](image-url)', 'alt text');
    const formatList = () => insertText('- ', '', 'list item');
    const formatOrderedList = () => insertText('1. ', '', 'list item');
    const formatQuote = () => insertText('> ', '', 'quote');
    const formatCode = () => insertText('`', '`', 'code');
    const formatCodeBlock = () => insertText('```\n', '\n```', 'code here');

    // Simple markdown to HTML converter for preview
    const markdownToHtml = (markdown: string) => {
        let html = markdown
            // Headers (order matters - most specific first)
            .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
            .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            // Links
            .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" class="text-blue-500 underline">$1</a>')
            // Images
            .replace(/!\[([^\]]*)\]\(([^\)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto my-4" />')
            // Lists
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc ml-6">$1</ul>')
            // Code inline
            .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>')
            // Line breaks
            .replace(/\n/gim, '<br />');

        return html;
    };

    return (
        <Card className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-4">
                    <TabsList>
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="edit" className="space-y-4">
                    {/* Toolbar */}
                    <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
                        <Button type="button" variant="ghost" size="sm" onClick={formatBold} title="Bold">
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={formatItalic} title="Italic">
                            <Italic className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-border mx-1" />
                        <Button type="button" variant="ghost" size="sm" onClick={formatH1} title="Heading 1">
                            <Heading1 className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={formatH2} title="Heading 2">
                            <Heading2 className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={formatH3} title="Heading 3">
                            <Heading3 className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={formatH4} title="Heading 4">
                            <Heading4 className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={formatH5} title="Heading 5">
                            <Heading5 className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={formatH6} title="Heading 6">
                            <Heading6 className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-border mx-1" />
                        <Button type="button" variant="ghost" size="sm" onClick={formatLink} title="Insert Link">
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={formatImage} title="Insert Image">
                            <Image className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-border mx-1" />
                        <Button type="button" variant="ghost" size="sm" onClick={formatList} title="Bullet List">
                            <List className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={formatOrderedList} title="Numbered List">
                            <ListOrdered className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={formatQuote} title="Quote">
                            <Quote className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={formatCode} title="Inline Code">
                            <Code className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={formatCodeBlock} title="Code Block">
                            <div className="text-xs font-mono">{'</>'}</div>
                        </Button>
                    </div>

                    {/* Editor */}
                    <Textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Write your content here using Markdown...

Formatting Examples:
**bold text**
*italic text*
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
[link text](url)
![image alt](image-url)
- bullet list
1. numbered list
> quote
`inline code`"
                        className="min-h-[400px] font-mono text-sm"
                        required
                    />

                    <div className="text-xs text-muted-foreground">
                        <p className="mb-1">💡 Quick Tips:</p>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>Select text and click toolbar buttons for quick formatting</li>
                            <li>Use Markdown syntax for advanced formatting</li>
                            <li>Switch to Preview tab to see how it will look</li>
                        </ul>
                    </div>
                </TabsContent>

                <TabsContent value="preview">
                    <div
                        className="prose dark:prose-invert max-w-none p-6 border rounded-md min-h-[400px] bg-card"
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
                    />
                </TabsContent>
            </Tabs>
        </Card>
    );
}
