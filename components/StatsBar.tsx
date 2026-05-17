'use client';

import { useEffect, useRef, useState } from 'react';

interface Stat {
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
}

function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const duration = 1800;
                const steps = 60;
                const increment = value / steps;
                let current = 0;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= value) { setCount(value); clearInterval(timer); }
                    else setCount(Math.floor(current));
                }, duration / steps);
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [value]);

    return (
        <span ref={ref}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
}

export function StatsBar({ toolCount = 5375 }: { toolCount?: number }) {
    const stats: Stat[] = [
        { value: toolCount, label: 'AI Tools Listed', suffix: '+' },
        { value: 71, label: 'Categories' },
        { value: 100, label: 'Manually Verified', suffix: '%' },
        { value: 50, label: 'New Tools / Week', suffix: '+' },
        { value: 2, label: 'Million+ Users', suffix: 'M+' },
    ];

    return (
        <div className="bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-2 text-center">
                            <div>
                                <div className="text-xl font-black leading-none">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                                </div>
                                <div className="text-blue-200 text-[11px] font-medium mt-0.5">{stat.label}</div>
                            </div>
                            {i < stats.length - 1 && (
                                <div className="w-px h-8 bg-blue-400/50 hidden sm:block ml-10" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
