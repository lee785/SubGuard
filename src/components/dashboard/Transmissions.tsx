'use client';

import {
    XCircle,
    Shield,
    Settings,
    Activity,
    ChevronRight,
    Circle,
    Bell
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Transmission {
    id: number;
    type: 'BLOCKED' | 'GUARDING' | 'SYSTEM' | 'POLICY';
    title: string;
    description: string;
    time: string;
}

const MOCK_TRANSMISSIONS: Transmission[] = [
    {
        id: 1,
        type: 'BLOCKED',
        title: 'Netflix Premium',
        description: 'Zero-usage pattern detected. Payment authorization revoked by Arc L1.',
        time: '14:02:22'
    },
    {
        id: 2,
        type: 'GUARDING',
        title: 'Claude Code Pro',
        description: 'Usage verified. Cryptographic proof submitted to ledger.',
        time: '13:45:10'
    },
    {
        id: 3,
        type: 'SYSTEM',
        title: 'Daily Reconciliation',
        description: 'Treasury balance synced. No discrepancies found.',
        time: '12:00:00'
    },
    {
        id: 4,
        type: 'POLICY',
        title: 'Threshold Update',
        description: 'Admin updated auto-block threshold to 7 days inactivity.',
        time: '10:30:05'
    }
];

export default function Transmissions() {
    return (
        <aside className="w-[320px] border-l border-white/5 bg-[#030305] flex flex-col h-full sticky top-0">
            <div className="p-6 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-widest text-white uppercase italic">Transmissions</h3>
                    <div className="group relative">
                        <div className="w-3.5 h-3.5 rounded-full border border-white/10 flex items-center justify-center text-[8px] text-foreground/40 cursor-help hover:border-primary/40 hover:text-primary transition-colors">?</div>
                        <div className="absolute left-0 top-full mt-2 w-48 p-3 rounded-xl bg-[#0a0a0c] border border-white/10 text-[10px] text-foreground/40 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl uppercase tracking-widest font-black">
                            Live protocol activity feed. Monitoring real-time cryptographic proofs and AI guarding signals.
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Circle className="w-1.5 h-1.5 fill-primary text-primary animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest text-primary uppercase">Live</span>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto px-6 space-y-8 py-6">
                {MOCK_TRANSMISSIONS.map((item, idx) => (
                    <div key={item.id} className="relative pl-6">
                        {/* Timeline line */}
                        {idx !== MOCK_TRANSMISSIONS.length - 1 && (
                            <div className="absolute left-[3px] top-4 bottom-[-32px] w-px bg-white/5" />
                        )}
                        <div className={cn(
                            "absolute left-0 top-1 w-2 h-2 rounded-full border-2 bg-[#030305]",
                            item.type === 'BLOCKED' ? "border-red-500" :
                                item.type === 'GUARDING' ? "border-primary" :
                                    "border-foreground/20"
                        )} />

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className={cn(
                                    "text-[9px] font-black tracking-widest uppercase",
                                    item.type === 'BLOCKED' ? "text-red-500" :
                                        item.type === 'GUARDING' ? "text-primary" :
                                            "text-foreground/40"
                                )}>{item.type}</span>
                                <span className="text-[9px] font-medium text-foreground/20 font-mono tracking-tighter">{item.time}</span>
                            </div>
                            <h4 className="text-[13px] font-bold text-foreground/80">{item.title}</h4>
                            <p className="text-[11px] text-foreground/30 leading-relaxed font-medium">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 pt-0">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-primary" />
                        <h4 className="text-[10px] font-black tracking-widest text-primary uppercase">Network Status</h4>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-foreground/40">Latency</span>
                            <span className="text-white">12ms</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[98%] shadow-[0_0_10px_#22c55e]" />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
