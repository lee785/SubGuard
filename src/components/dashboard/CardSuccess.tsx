'use client';

import { useState } from 'react';

import {
    Check,
    Copy,
    Eye,
    X,
    Shield,
    Zap,
    Globe,
    CheckCircle2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardSuccessProps {
    cardData: {
        merchant: { name: string, icon: string };
        limit: number;
        frequency: string;
        last3: string;
        fullNumber: string;
        expiry: string;
        cvv: string;
    };
    onClose: () => void;
    onViewDetails: () => void;
}

export default function CardSuccess({ cardData, onClose, onViewDetails }: CardSuccessProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(cardData.fullNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center animate-in fade-in duration-500">
            <div className="absolute inset-0 bg-[#030305]/95 backdrop-blur-3xl" onClick={onClose} />

            <div className="relative w-full max-w-4xl p-12 text-center space-y-12 animate-in zoom-in-95 duration-500">
                {/* Header Celebratory Section */}
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center animate-bounce">
                            <Check className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-5xl font-bold tracking-tight text-white">Card Created Successfully</h2>
                        <p className="text-foreground/40 max-w-lg mx-auto text-sm leading-relaxed">
                            Your SubGuard virtual card is now active, funded, and ready to secure your transaction.
                        </p>
                    </div>
                </div>

                {/* Card Visualization */}
                <div className="relative aspect-[1.58/1] w-full max-w-xl mx-auto group">
                    {/* Shadow/Glow */}
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] opacity-30 rounded-full" />

                    <div className="relative h-full w-full rounded-[32px] border border-white/10 p-10 flex flex-col justify-between overflow-hidden bg-[#0a0a0c] shadow-2xl">
                        {/* Mesh Gradient */}
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_0%,_#22c55e11_0%,_transparent_70%)]" />

                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center gap-3">
                                <Zap className="w-5 h-5 text-primary" />
                                <span className="text-xs font-black tracking-[0.2em] text-foreground/40 uppercase italic">Virtual</span>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                <span className="text-[10px] font-black tracking-widest text-white uppercase">{cardData.merchant.name}</span>
                            </div>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="w-14 h-11 bg-gradient-to-br from-yellow-500/40 to-yellow-600/40 border border-yellow-500/20 rounded-lg" />
                            <div className="flex justify-between items-end">
                                <div className="flex gap-6 text-3xl font-mono tracking-[0.2em] text-white">
                                    <span>••••</span>
                                    <span>••••</span>
                                    <span>••••</span>
                                    <span className="text-white">{(cardData.last3 || '').padStart(4, '•')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-end relative z-10">
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Card Holder</p>
                                <p className="text-lg font-bold text-white uppercase">SubGuard User</p>
                            </div>
                            <div className="flex gap-10 text-right">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Expires</p>
                                    <p className="text-lg font-bold text-white font-mono">{cardData.expiry}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">CVV</p>
                                    <p className="text-lg font-bold text-primary font-mono">{cardData.cvv}</p>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div className="flex -space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-red-500/90" />
                                        <div className="w-8 h-8 rounded-full bg-yellow-500/80 backdrop-blur-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
                    {[
                        { label: 'Guarding', value: 'Active', icon: Shield, status: true },
                        { label: 'Limit', value: `${cardData.limit} USDC/${cardData.frequency === 'monthly' ? 'mo' : cardData.frequency === 'yearly' ? 'yr' : 'day'}`, icon: Zap },
                        { label: 'Network', value: 'Arc L1 via Stripe', icon: Globe }
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 bg-white/[0.02] border-white/5 flex items-start gap-4 text-left">
                            <stat.icon className="w-5 h-5 text-foreground/30 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black tracking-widest text-foreground/20 uppercase">{stat.label}</p>
                                <div className="flex items-center gap-2">
                                    {stat.status && <div className="w-2 h-2 rounded-full bg-primary" />}
                                    <p className="text-sm font-bold text-white">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-6">
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3",
                            copied ? "bg-primary/20 text-primary border border-primary/20" : "bg-primary text-black shadow-[0_4px_30px_rgba(34,197,94,0.4)] hover:scale-105"
                        )}
                    >
                        {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Number Copied' : 'Copy Card Number'}
                    </button>
                    <button onClick={onViewDetails} className="px-10 py-5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center gap-3">
                        <Eye className="w-4 h-4" />
                        View Details
                    </button>
                </div>

                {/* Legal Note */}
                <p className="text-[9px] text-foreground/20 max-w-xl mx-auto uppercase tracking-[0.2em]">
                    SubGuard Virtual Cards are issued by Arc Financial. By using this card you agree to the <span className="underline cursor-pointer hover:text-foreground/40">Cardholder Agreement</span>.
                </p>
            </div>

            {/* Close Button X (Top Right of screen) */}
            <button onClick={onClose} className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                <X className="w-6 h-6 text-foreground/40" />
            </button>
        </div>
    );
}
