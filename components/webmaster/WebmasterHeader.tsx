'use client';

import { motion } from 'framer-motion';
import { Globe, LogOut } from 'lucide-react';

interface WebmasterHeaderProps {
    isAuthenticated: boolean;
    onLogout: () => void;
}

export default function WebmasterHeader({ isAuthenticated, onLogout }: WebmasterHeaderProps) {
    return (
        <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-lg">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Bing Webmaster API</h1>
                            <p className="text-sm text-gray-400">Index Management & Analytics</p>
                        </div>
                    </div>

                    {isAuthenticated && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onLogout}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors duration-200"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </motion.button>
                    )}
                </div>
            </div>
        </header>
    );
}
