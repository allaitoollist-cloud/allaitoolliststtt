'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, XCircle, Loader2, FileText } from 'lucide-react';

interface IndexingPanelProps {
    apiKey: string;
}

interface IndexResult {
    url: string;
    status: 'success' | 'error' | 'pending';
    message: string;
}

export default function IndexingPanel({ apiKey }: IndexingPanelProps) {
    const [siteUrl, setSiteUrl] = useState('');
    const [urls, setUrls] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState<IndexResult[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const urlList = urls.split('\n').filter(url => url.trim());
        const tempResults: IndexResult[] = urlList.map(url => ({
            url: url.trim(),
            status: 'pending',
            message: 'Submitting...'
        }));

        setResults(tempResults);

        // Simulate API calls (replace with actual Bing Webmaster API calls)
        for (let i = 0; i < urlList.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            setResults(prev => prev.map((result, index) =>
                index === i
                    ? {
                        ...result,
                        status: Math.random() > 0.2 ? 'success' : 'error',
                        message: Math.random() > 0.2 ? 'Successfully submitted for indexing' : 'Failed to submit'
                    }
                    : result
            ));
        }

        setIsSubmitting(false);
    };

    const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                setUrls(content);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Submit URLs for Indexing</h2>
                <p className="text-gray-300">Submit individual URLs or bulk upload to get them indexed by Bing</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-200 mb-2">
                        Website URL
                    </label>
                    <input
                        type="url"
                        id="siteUrl"
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                        placeholder="https://yoursite.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="urls" className="block text-sm font-medium text-gray-200">
                            URLs to Index (one per line)
                        </label>
                        <label className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg cursor-pointer transition-colors">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">Upload File</span>
                            <input
                                type="file"
                                accept=".txt"
                                onChange={handleBulkUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <textarea
                        id="urls"
                        value={urls}
                        onChange={(e) => setUrls(e.target.value)}
                        placeholder="https://yoursite.com/page1&#10;https://yoursite.com/page2&#10;https://yoursite.com/page3"
                        rows={10}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                        required
                    />
                    <p className="text-sm text-gray-400 mt-2">
                        {urls.split('\n').filter(url => url.trim()).length} URLs ready to submit
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            <span>Submit for Indexing</span>
                        </>
                    )}
                </motion.button>
            </form>

            {results.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                    <h3 className="text-xl font-bold text-white mb-4">Indexing Results</h3>
                    <div className="space-y-3">
                        {results.map((result, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg"
                            >
                                {result.status === 'pending' && (
                                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0 mt-0.5" />
                                )}
                                {result.status === 'success' && (
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                )}
                                {result.status === 'error' && (
                                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-mono truncate">{result.url}</p>
                                    <p className={`text-xs mt-1 ${result.status === 'success' ? 'text-green-300' :
                                            result.status === 'error' ? 'text-red-300' :
                                                'text-blue-300'
                                        }`}>
                                        {result.message}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
