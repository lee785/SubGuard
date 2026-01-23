'use client';

import {
    X,
    Shield,
    Cpu,
    Lock,
    Zap,
    Layers,
    CheckCircle2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function SecurityProtocolModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    const protocols = [
        {
            title: "AI Guardian",
            subtitle: "Gemini 3 Flash Powered",
            description: "Real-time analysis of subscription patterns and merchant behavior to detect anomalies before they become charges.",
            icon: <Cpu className="w-5 h-5 text-primary" />,
            features: ["Anomaly Detection", "Pattern Recognition", "Risk Scoring"]
        },
        {
            title: "Virtual Shielding",
            subtitle: "Stripe Issuing Integration",
            description: "Dynamic virtual cards with programmable limits, merchant locks, and autonomous auto-freeze capabilities.",
            icon: <Shield className="w-5 h-5 text-primary" />,
            features: ["Programmable Limits", "Merchant Locking", "Instant Issuance"]
        },
        {
            title: "Arc L1 Settlement",
            subtitle: "Decentralized Architecture",
            description: "Built on Arc L1 for atomic settlement and immutable logic execution, ensuring your assets are always under your control.",
            icon: <Layers className="w-5 h-5 text-primary" />,
            features: ["Atomic Swaps", "Immutable Logic", "Transparent Audits"]
        },
        {
            title: "Zero-Trust Architecture",
            subtitle: "Self-Sovereign Identity",
            description: "No central authority can access your treasury. Everything is governed by your own autonomous security agent.",
            icon: <Lock className="w-5 h-5 text-primary" />,
            features: ["Non-Custodial", "Encrypted Secrets", "Multi-Sig Support"]
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl glass-card bg-[#0a0a0c]/80 border-white/10 shadow-3xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] font-mono">Protocol active</span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-white italic">SECURITY PROTOCOLS</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all group">
                        <X className="w-6 h-6 text-foreground/20 group-hover:text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto custom-scrollbar p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {protocols.map((p, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        {p.icon}
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="font-bold text-white text-lg tracking-tight uppercase">{p.title}</h3>
                                            <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">{p.subtitle}</p>
                                        </div>
                                        <p className="text-xs text-foreground/40 leading-relaxed font-medium">
                                            {p.description}
                                        </p>
                                        <div className="grid grid-cols-1 gap-2 pt-2">
                                            {p.features.map((f, j) => (
                                                <div key={j} className="flex items-center gap-2 text-[9px] font-bold text-foreground/30 uppercase tracking-widest">
                                                    <CheckCircle2 className="w-3 h-3 text-primary/40" />
                                                    {f}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <Zap className="w-10 h-10 text-primary animate-pulse" />
                            <div>
                                <p className="text-xs font-bold text-white">Real-time Mitigation Active</p>
                                <p className="text-[10px] text-primary/60 font-medium font-mono uppercase tracking-widest">latency: 4ms | throughput: 10k tps</p>
                            </div>
                        </div>
                        <button className="btn-primary text-[10px] px-8 py-3 tracking-[0.2em]">INITIALIZE AUDIT</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
