'use client';

import {
    Shield,
    X,
    ArrowRight,
    Loader2,
    CheckCircle2,
    ExternalLink,
    Zap
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface ArcChainConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    type: 'transfer' | 'upgrade' | 'generation';
    details: {
        amount?: string;
        from?: string;
        to?: string;
        tier?: string;
        fee?: string;
    };
}

export default function ArcChainConfirm({ isOpen, onClose, onConfirm, type, details }: ArcChainConfirmProps) {
    const [state, setState] = useState<'idle' | 'processing' | 'success'>('idle');
    const [progress, setProgress] = useState(0);
    const [hash, setHash] = useState<string>('');

    // Auto-collapse after 5s on success
    useEffect(() => {
        if (state === 'success') {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [state, onClose]);

    if (!isOpen) return null;

    const handleAction = async () => {
        setState('processing');
        // Simulate progress
        const interval = setInterval(() => {
            setProgress(p => Math.min(p + 5, 95));
        }, 200);

        try {
            await onConfirm();
            clearInterval(interval);
            setProgress(100);
            setHash('0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6));
            setState('success');
        } catch (error) {
            clearInterval(interval);
            setState('idle');
            setProgress(0);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={state === 'idle' ? onClose : undefined} />

            <div className="relative w-full max-w-md glass-card bg-[#0a0a0c]/80 border-white/10 shadow-[0_0_50px_rgba(34,197,94,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                <div className="p-8 space-y-8">
                    {state === 'idle' && (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Arc Chain Protocol</span>
                                </div>
                                <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-foreground/20" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-white tracking-tight italic uppercase">Confirm Transmission</h2>
                                <p className="text-xs text-foreground/40 font-medium leading-relaxed">
                                    You are signing a settlement request on the Arc L1 Network. This action is immutable once confirmed.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-foreground/20">Action</span>
                                        <span className="text-white">{type === 'upgrade' ? 'Tier Upgrade' : type === 'transfer' ? 'Token Settlement' : 'Shield Generation'}</span>
                                    </div>

                                    {details.amount && (
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-foreground/20">Settlement</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-primary text-sm font-bold">{details.amount}</span>
                                                <span className="text-primary/40">USDC</span>
                                            </div>
                                        </div>
                                    )}

                                    {details.tier && (
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-foreground/20">Target Tier</span>
                                            <span className="text-primary">{details.tier}</span>
                                        </div>
                                    )}

                                    <div className="h-px bg-white/5" />

                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-foreground/20">Protocol Fee</span>
                                        <span className="text-foreground/40">{details.fee || '0.00 USDC'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-foreground/20">Network</span>
                                        <span className="text-primary/60 italic">Arc Testnet</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleAction}
                                className="w-full py-4 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2"
                            >
                                Sign & Confirm Transmission
                                <ArrowRight className="w-3 h-3 stroke-[3px]" />
                            </button>
                        </>
                    )}

                    {state === 'processing' && (
                        <div className="py-12 space-y-8 flex flex-col items-center text-center">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-primary/40" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Transmitting Assets</h3>
                                <div className="space-y-2">
                                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                                        <div
                                            className="h-full bg-primary transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em] animate-pulse">
                                        Settling on Arc L1...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {state === 'success' && (
                        <div className="py-12 space-y-8 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 animate-in zoom-in duration-500">
                                <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-white uppercase italic tracking-tight">Confirmed</h3>
                                <p className="text-xs text-foreground/40 font-medium max-w-[240px] mx-auto">
                                    Protocol settlement complete. Assets have been synchronized across the Arc Network.
                                </p>
                            </div>

                            <div className="pt-4 flex flex-col items-center gap-4">
                                <a
                                    href={`https://testnet.arcscan.app/tx/${hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline group"
                                >
                                    View on Arc Scan
                                    <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </a>
                                <p className="text-[8px] text-foreground/20 uppercase tracking-widest">
                                    Collapsing in 5 seconds...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
