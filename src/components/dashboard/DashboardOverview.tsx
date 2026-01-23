'use client';

import { useState } from 'react';
import {
    FileText,
    Plus,
    BarChart3,
    MoreHorizontal,
    TrendingUp,
    Library,
    RotateCcw
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Subscription {
    id: number;
    name: string;
    usage: number;
    usageLabel: string;
    cost: string;
    status: string;
    icon: string;
    active: boolean;
}

const DASHBOARD_SUBS = [
    {
        id: 1,
        name: 'Netflix Premium',
        usage: 65,
        usageLabel: 'High activity',
        cost: '15.99',
        status: 'Safe',
        icon: '/icons/Netflix.png',
        active: true
    },
    {
        id: 2,
        name: 'Claude Code Pro',
        usage: 45,
        usageLabel: 'Avg activity',
        cost: '20.00',
        status: 'Guarding',
        icon: '/icons/Claude.png',
        active: true
    },
    {
        id: 3,
        name: 'AWS Cluster',
        usage: 15,
        usageLabel: 'Suspiciously low',
        cost: '120.50',
        status: 'Blocked',
        icon: '/icons/Shadow.png',
        active: false
    }
];

export default function DashboardOverview({
    onOpenWallet,
    balance = 0,
    onRefresh
}: {
    onOpenWallet?: () => void;
    balance?: number;
    onRefresh?: () => void;
}) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [mockSubs, setMockSubs] = useState(DASHBOARD_SUBS);

    const toggleMockSub = (id: number) => {
        setMockSubs(prev => prev.map(sub =>
            sub.id === id ? { ...sub, active: !sub.active, status: !sub.active ? 'Safe' : 'Blocked' } : sub
        ));
    };

    const displayedSubs = showAll ? mockSubs : mockSubs.slice(0, 3);
    return (
        <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700">
            {/* Treasury Balance Hub */}
            <div className="glass-card p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-white/[0.03] to-transparent border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 lg:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Library className="w-8 lg:w-12 h-8 lg:h-12 text-white" />
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <Library className="w-4 h-4 text-foreground/40" />
                                <h3 className="text-[10px] font-black tracking-[0.3em] text-foreground/40 uppercase">Treasury Balance</h3>
                            </div>
                            <button
                                onClick={async () => {
                                    if (onRefresh) {
                                        setIsRefreshing(true);
                                        await onRefresh();
                                        setTimeout(() => setIsRefreshing(false), 1000);
                                    }
                                }}
                                className={cn(
                                    "p-1.5 rounded-lg hover:bg-white/5 text-foreground/20 transition-all",
                                    isRefreshing && "animate-spin text-primary"
                                )}
                                title="Refresh Balance"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2 sm:gap-4">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                                <p className="text-sm sm:text-base lg:text-lg font-bold text-primary/60 tracking-tight">USDC</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-primary text-xs font-bold">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>2.4%</span>
                                </div>
                                <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">vs last 30 days</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                            onClick={onOpenWallet}
                            className="px-4 sm:px-6 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-3 h-3" />
                            View Wallet
                        </button>
                        <button
                            onClick={onOpenWallet}
                            className="px-5 sm:px-6 py-2.5 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_4px_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2"
                        >
                            <Plus className="w-3 h-3 stroke-[4px]" />
                            Top Up Assets
                        </button>
                    </div>
                </div>
            </div>

            {/* Active Subscriptions Section */}
            <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-bold tracking-tight text-foreground/80">Active Subscriptions</h3>
                    <div className="flex items-center gap-2 md:gap-3">
                        <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-foreground/40">
                            <BarChart3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-foreground/40">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block glass-card bg-[#0a0a0c]/50 border-white/5 overflow-hidden">
                    <div className="grid grid-cols-[1.5fr_1fr_0.8fr_1fr_0.5fr] px-6 py-3 border-b border-white/5 text-[10px] font-black text-foreground/20 uppercase tracking-widest">
                        <span>Service</span>
                        <span className="flex items-center gap-1.5">
                            Usage
                            <div className="group relative">
                                <div className="w-3 h-3 rounded-full border border-white/10 flex items-center justify-center text-[7px] text-foreground/30 cursor-help hover:border-primary/40 hover:text-primary transition-colors">?</div>
                                <div className="absolute left-0 top-full mt-2 w-52 p-3 rounded-xl bg-[#0a0a0c] border border-white/10 text-[9px] text-foreground/40 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl normal-case tracking-normal font-normal">
                                    Usage signals are simulated for this demo. In production, SubGuard integrates with service APIs (OAuth, etc.) to track real activity.
                                </div>
                            </div>
                        </span>
                        <span>Monthly Cost</span>
                        <span>Protection Status</span>
                        <span className="text-right">AI Guard</span>
                    </div>

                    <div className="divide-y divide-white/[0.02]">
                        {displayedSubs.map(sub => (
                            <div key={sub.id} className="grid grid-cols-[1.5fr_1fr_0.8fr_1fr_0.5fr] px-6 py-4 items-center hover:bg-white/[0.01] transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                                        <img src={sub.icon} alt={sub.name} className="w-6 h-6 object-contain" />
                                    </div>
                                    <span className="text-[13px] font-bold text-foreground/70">{sub.name}</span>
                                </div>

                                <div className="space-y-2 pr-12">
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full",
                                                sub.usage > 50 ? "bg-primary" : sub.usage > 20 ? "bg-primary/40" : "bg-red-500/50"
                                            )}
                                            style={{ width: `${sub.usage}%` }}
                                        />
                                    </div>
                                    <p className={cn(
                                        "text-[9px] font-bold uppercase tracking-tighter",
                                        sub.usage > 50 ? "text-primary/40" : sub.usage > 20 ? "text-foreground/20" : "text-red-500/40"
                                    )}>{sub.usageLabel}</p>
                                </div>

                                <span className="text-sm font-bold text-foreground/60">{sub.cost} USDC</span>

                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        sub.status === 'Active' || sub.status === 'Safe' ? "bg-primary" : sub.status === 'Guarded' ? "bg-primary/60" : "bg-red-500"
                                    )} />
                                    <span className={cn(
                                        "text-xs font-bold",
                                        sub.status === 'Active' || sub.status === 'Safe' ? "text-primary" : sub.status === 'Guarded' ? "text-primary/60" : "text-red-500"
                                    )}>{sub.status}</span>
                                </div>

                                <div className="flex justify-end pr-2">
                                    <div className="relative group/tooltip">
                                        <button
                                            onClick={() => toggleMockSub(sub.id)}
                                            className={cn(
                                                "w-10 h-5 rounded-full relative p-1 transition-all",
                                                sub.active ? "bg-primary" : "bg-white/10"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-3 h-3 bg-white rounded-full transition-transform",
                                                sub.active ? "translate-x-5" : "translate-x-0"
                                            )} />
                                        </button>
                                        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 rounded bg-black text-[8px] text-white opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none uppercase tracking-widest font-black">
                                            {sub.active ? 'AI Guard Active' : 'Shield Suspended'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {mockSubs.length > 3 && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-foreground/20 hover:text-foreground/40 transition-colors bg-white/[0.01]"
                        >
                            {showAll ? 'View Less' : `View all ${mockSubs.length} services →`}
                        </button>
                    )}
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {displayedSubs.map(sub => (
                        <div key={sub.id} className="glass-card bg-[#0a0a0c]/50 border-white/5 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                                        <img src={sub.icon} alt={sub.name} className="w-6 h-6 object-contain" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-foreground/70 block">{sub.name}</span>
                                        <span className="text-xs font-bold text-foreground/40">{sub.cost} USDC/mo</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleMockSub(sub.id)}
                                    className={cn(
                                        "w-10 h-5 rounded-full relative p-1 transition-all shrink-0",
                                        sub.active ? "bg-primary" : "bg-white/10"
                                    )}
                                >
                                    <div className={cn(
                                        "w-3 h-3 bg-white rounded-full transition-transform",
                                        sub.active ? "translate-x-5" : "translate-x-0"
                                    )} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        sub.status === 'Active' || sub.status === 'Safe' ? "bg-primary" : sub.status === 'Guarded' ? "bg-primary/60" : "bg-red-500"
                                    )} />
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest",
                                        sub.status === 'Active' || sub.status === 'Safe' ? "text-primary" : sub.status === 'Guarded' ? "text-primary/60" : "text-red-500"
                                    )}>{sub.status}</span>
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full",
                                                sub.usage > 50 ? "bg-primary" : sub.usage > 20 ? "bg-primary/40" : "bg-red-500/50"
                                            )}
                                            style={{ width: `${sub.usage}%` }}
                                        />
                                    </div>
                                </div>
                                <span className={cn(
                                    "text-[9px] font-bold uppercase",
                                    sub.usage > 50 ? "text-primary/40" : sub.usage > 20 ? "text-foreground/20" : "text-red-500/40"
                                )}>{sub.usage}%</span>
                            </div>
                        </div>
                    ))}

                    {mockSubs.length > 3 && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-foreground/20 hover:text-foreground/40 transition-colors"
                        >
                            {showAll ? 'View Less' : `View all ${mockSubs.length} →`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
