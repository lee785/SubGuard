'use client';

import { useState, useEffect } from 'react';
import { X, Shield, Zap, Bell, Check, Lock, ChevronRight, Activity } from 'lucide-react';

interface ShieldConfigPopupProps {
    sub: {
        id: number;
        name: string;
        icon: string;
        amount: string;
    } | null;
    onClose: () => void;
    onSave: (config: any) => void;
}

export default function ShieldConfigPopup({ sub, onClose, onSave }: ShieldConfigPopupProps) {
    const [limit, setLimit] = useState(sub?.amount || '0.00');
    const [sensitivity, setSensitivity] = useState<'Aggressive' | 'Balanced' | 'Relaxed'>('Balanced');
    const [isAutoBlock, setIsAutoBlock] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    if (!sub) return null;

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            onSave({ limit, sensitivity, isAutoBlock });
            setIsSaving(false);
            onClose();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <style jsx>{`
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type=number] {
                    -moz-appearance: textfield;
                }
            `}</style>
            <div
                className="absolute inset-0 bg-[#030305]/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full h-[90vh] sm:h-auto sm:max-h-[85vh] sm:max-w-md glass-card bg-[#0a0a0c] border-white/10 shadow-3xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 overflow-hidden rounded-t-3xl sm:rounded-2xl">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden">
                            <img src={sub.icon} alt={sub.name} className="w-8 h-8 object-contain" />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-1">Protection Config</h3>
                            <p className="font-bold text-white uppercase tracking-tighter">{sub.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-foreground/20 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Spending Limit */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Monthly Spend Cap</label>
                            <span className="text-[10px] font-mono text-primary">USDC</span>
                        </div>
                        <div className="relative group">
                            <input
                                type="number"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-4 font-mono text-xl focus:border-primary/50 focus:outline-none transition-all group-hover:bg-white/[0.04]"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-foreground/20 uppercase tracking-widest">Limit</div>
                        </div>
                    </div>

                    {/* AI Sensitivity */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">AI Agent Sensitivity</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['Aggressive', 'Balanced', 'Relaxed'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSensitivity(s)}
                                    className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${sensitivity === s
                                        ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                                        : 'bg-white/5 border-white/5 text-foreground/20 hover:bg-white/10'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <p className="text-[9px] text-foreground/30 leading-relaxed italic">
                            {sensitivity === 'Aggressive' && "Agent will block if idle for >48h or value drops by 5%."}
                            {sensitivity === 'Balanced' && "Default Arc protocol logic. Optimal for standard SaaS."}
                            {sensitivity === 'Relaxed' && "Higher tolerance. Only blocks on major anomalies."}
                        </p>
                    </div>

                    {/* Auto-Block Toggle */}
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between group cursor-pointer" onClick={() => setIsAutoBlock(!isAutoBlock)}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Instant Liquidity Cut</p>
                                <p className="text-[9px] text-primary/40 leading-none mt-1">Kill payment on fraud detection</p>
                            </div>
                        </div>
                        <div className={`w-10 h-5 rounded-full p-1 transition-colors ${isAutoBlock ? 'bg-primary' : 'bg-white/10'}`}>
                            <div className={`w-3 h-3 rounded-full bg-black transition-transform ${isAutoBlock ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-primary text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <Activity className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                Save Protocol Config
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
