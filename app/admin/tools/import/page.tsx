'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getBrowserClient } from '@/lib/supabase-browser';
import { Upload, FileSpreadsheet, Check, AlertCircle, Download, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function BulkImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const supabase = getBrowserClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
                toast({
                    title: "Invalid file type",
                    description: "Please upload a CSV file.",
                    variant: "destructive"
                });
                return;
            }
            setFile(selectedFile);
            parseCSV(selectedFile);
        }
    };

    const parseCSV = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

            const data = lines.slice(1).filter(line => line.trim()).map(line => {
                // Handle CSV parsing with quotes
                const values: string[] = [];
                let inQuotes = false;
                let currentValue = '';

                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                        values.push(currentValue.trim().replace(/^"|"$/g, ''));
                        currentValue = '';
                    } else {
                        currentValue += char;
                    }
                }
                values.push(currentValue.trim().replace(/^"|"$/g, ''));

                const entry: any = {};
                headers.forEach((header, index) => {
                    // Map CSV headers to DB columns
                    const key = header.toLowerCase().replace(/\s+/g, '_');
                    // Simple mapping
                    const dbKey = key === 'tool_name' || key === 'name' ? 'name' :
                        key === 'short_description' ? 'short_description' :
                            key === 'description' ? 'description' :
                                key === 'website_url' || key === 'url' ? 'website_url' :
                                    key === 'category' ? 'category' :
                                        key === 'pricing' ? 'pricing' :
                                            key;

                    if (dbKey) entry[dbKey] = values[index];
                });
                return entry;
            });

            setPreviewData(data);
        };
        reader.readAsText(file);
    };

    const handleImport = async () => {
        if (previewData.length === 0) return;

        setImporting(true);
        try {
            // Validate required fields
            const validData = previewData.filter(item => item.name && item.website_url);

            if (validData.length === 0) {
                throw new Error("No valid data found. Ensure 'name' and 'website_url' columns exist.");
            }

            // Add default fields
            const toolsToInsert = validData.map(item => ({
                ...item,
                slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                is_active: true,
                is_featured: false,
                is_trending: false,
                views: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }));

            const { error } = await supabase
                .from('tools')
                .insert(toolsToInsert);

            if (error) throw error;

            toast({
                title: "Import Successful! 🎉",
                description: `Successfully imported ${toolsToInsert.length} tools.`,
            });

            setFile(null);
            setPreviewData([]);
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (error: any) {
            console.error('Import error:', error);
            toast({
                title: "Import Failed",
                description: error.message || "Something went wrong during import.",
                variant: "destructive"
            });
        } finally {
            setImporting(false);
        }
    };

    const downloadTemplate = () => {
        const headers = "Name,Short Description,Description,Website URL,Category,Pricing";
        const sample = "Example Tool,An amazing AI tool,This tool helps you do amazing things with AI.,https://example.com,Productivity,Freemium";
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + sample;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tools_import_template.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Bulk Import Tools</h1>
                <p className="text-muted-foreground">Upload a CSV file to add multiple tools at once.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Upload CSV</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}>
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground mt-1">CSV files only</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".csv"
                                onChange={handleFileChange}
                            />
                        </div>

                        {file && (
                            <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded border border-white/10">
                                <FileSpreadsheet className="h-4 w-4 text-green-500" />
                                <span className="text-sm truncate flex-1">{file.name}</span>
                                <Button variant="ghost" size="sm" onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                    setPreviewData([]);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}>
                                    Remove
                                </Button>
                            </div>
                        )}

                        <Button variant="outline" className="w-full" onClick={downloadTemplate}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Template
                        </Button>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Preview Data</CardTitle>
                        {previewData.length > 0 && (
                            <Button onClick={handleImport} disabled={importing}>
                                {importing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Import {previewData.length} Tools
                                    </>
                                )}
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {previewData.length > 0 ? (
                            <div className="rounded-md border border-white/10 overflow-hidden">
                                <div className="max-h-[400px] overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-secondary/20 hover:bg-secondary/20">
                                                <TableHead>Name</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Pricing</TableHead>
                                                <TableHead>URL</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {previewData.map((row, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="font-medium">{row.name || <span className="text-red-500">Missing</span>}</TableCell>
                                                    <TableCell>{row.category}</TableCell>
                                                    <TableCell>{row.pricing}</TableCell>
                                                    <TableCell className="max-w-[200px] truncate">{row.website_url || <span className="text-red-500">Missing</span>}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground border-2 border-dashed border-white/5 rounded-lg">
                                <FileSpreadsheet className="h-10 w-10 mb-4 opacity-20" />
                                <p>Upload a CSV file to preview data here</p>
                            </div>
                        )}

                        {previewData.length > 0 && (
                            <Alert className="mt-4 bg-blue-500/10 border-blue-500/20 text-blue-500">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Ready to Import</AlertTitle>
                                <AlertDescription>
                                    Please review the data above. Rows with missing Name or URL will be skipped.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
