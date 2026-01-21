'use client';

import { useState } from 'react';
import {
    Search,
    ChevronRight,
    Shield,
    Lock,
    Zap,
    Hand,
    CheckCircle2,
    X,
    Info,
    ArrowRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const MERCHANTS = [
    { id: 'netflix', name: 'Netflix', icon: '/icons/Netflix.png', category: 'Entertainment & Streaming' },
    { id: 'openai', name: 'OpenAI', icon: '/icons/OpenAi.png', category: 'AI & Developer Tools' },
    { id: 'youtube', name: 'YouTube', icon: '/icons/YouTube.png', category: 'Entertainment & Streaming' },
    { id: 'spotify', name: 'Spotify', icon: '/icons/Spotify.png', category: 'Music & Audio' },
    { id: 'x', name: 'X', icon: '/icons/X.png', category: 'Social Media' },
    { id: 'disney', name: 'Disney+', icon: '/icons/Disney.png', category: 'Entertainment & Streaming' },
    { id: 'claude', name: 'Claude', icon: '/icons/Claude.png', category: 'AI & Developer Tools' },
];

interface VirtualShieldFlowProps {
    onComplete: (cardData: any) => void;
    onCancel: () => void;
    slotIndex: number;
    totalSlots: number;
}

export default function VirtualShieldFlow({ onComplete, onCancel, slotIndex, totalSlots }: VirtualShieldFlowProps) {
    const isGeneralSlot = slotIndex === totalSlots - 1 && totalSlots > 1;
    const [step, setStep] = useState(1);
    const [merchant, setMerchant] = useState<any>(isGeneralSlot ? { name: 'General Card', icon: '/icons/General.png', category: 'General Spending' } : null);
    const [limit, setLimit] = useState(20);
    const [frequency, setFrequency] = useState<'daily' | 'monthly' | 'yearly'>(isGeneralSlot ? 'monthly' : 'monthly');
    const [policy, setPolicy] = useState<'strict' | 'adaptive' | 'manual'>('adaptive');
    const [searchQuery, setSearchQuery] = useState('');

    // Dynamic Logo Matching
    const currentMerchant = isGeneralSlot ? { name: 'General Card', icon: '/icons/General.png', category: 'General Spending' } : (MERCHANTS.find(m =>
        m.name.toLowerCase() === searchQuery.trim().toLowerCase()
    ) || (searchQuery.trim() ? { name: searchQuery.trim(), icon: '/icons/General.png', category: 'Custom Merchant' } : null));

    const handleSelectMerchant = () => {
        if (currentMerchant) {
            setMerchant(currentMerchant);
        }
    };

    const handleCreate = () => {
        onComplete({
            merchant: merchant || currentMerchant,
            limit,
            frequency,
            policy,
            isGeneral: isGeneralSlot,
            last3: Math.floor(100 + Math.random() * 900).toString(),
            fullNumber: `4242 4242 4242 ${Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0')}`,
            expiry: '12/27',
            cvv: Math.floor(100 + Math.random() * 900).toString()
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onCancel} />

            <div className="relative w-full max-w-6xl h-[85vh] glass-card bg-[#030305] border-white/10 flex overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                {/* Close Button */}
                <button onClick={onCancel} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors z-10">
                    <X className="w-5 h-5 text-foreground/40" />
                </button>

                {/* Left Side: Configuration */}
                <div className="flex-grow p-12 overflow-y-auto space-y-12 border-r border-white/5">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold tracking-tight text-white">Create Virtual Shield</h2>
                        <p className="text-foreground/40 text-sm">Configure a secure, isolated payment method for your subscription services.</p>
                    </div>

                    {/* Step 1: Merchant */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">1</div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Merchant Selection</h3>
                            <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-1 rounded">Auto-Detect</span>
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search merchants (e.g. Netflix, OpenAI)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-12 py-5 text-sm focus:border-primary/50 transition-all outline-none pr-32"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                {currentMerchant && (
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 animate-in fade-in zoom-in-50 duration-300">
                                        <img src={currentMerchant.icon} alt={currentMerchant.name} className="w-5 h-5 object-contain" />
                                    </div>
                                )}
                                <button
                                    onClick={handleSelectMerchant}
                                    disabled={!searchQuery.trim()}
                                    className="px-4 py-2 rounded-lg bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                                >
                                    Select
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2 text-foreground/30 text-[10px] font-medium leading-relaxed">
                            We'll automatically configure logo and category based on your selection.
                        </div>
                    </div>

                    {/* Step 2: Limits */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">2</div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Spending Limits</h3>
                        </div>

                        <div className="glass-card p-8 bg-white/[0.01] border-white/5 space-y-8">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Cap Frequency</span>
                                <div className="flex bg-black rounded-lg p-1 border border-white/5">
                                    {isGeneralSlot ? (
                                        <>
                                            <button
                                                onClick={() => setFrequency('daily')}
                                                className={cn(
                                                    "px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                                                    frequency === 'daily' ? "bg-primary text-black" : "text-foreground/40 hover:text-white"
                                                )}
                                            >Daily</button>
                                            <button
                                                onClick={() => setFrequency('monthly')}
                                                className={cn(
                                                    "px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                                                    frequency === 'monthly' ? "bg-primary text-black" : "text-foreground/40 hover:text-white"
                                                )}
                                            >Monthly</button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setFrequency('monthly')}
                                                className={cn(
                                                    "px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                                                    frequency === 'monthly' ? "bg-primary text-black" : "text-foreground/40 hover:text-white"
                                                )}
                                            >Monthly</button>
                                            <button
                                                onClick={() => setFrequency('yearly')}
                                                className={cn(
                                                    "px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                                                    frequency === 'yearly' ? "bg-primary text-black" : "text-foreground/40 hover:text-white"
                                                )}
                                            >Yearly</button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Limit Amount</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-white">{limit}.00</span>
                                        <span className="text-xs font-black text-primary uppercase">USDC</span>
                                    </div>
                                </div>
                                <div className="relative h-2 w-full bg-white/5 rounded-full">
                                    <div
                                        className="absolute left-0 top-0 h-full bg-primary rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-300"
                                        style={{ width: `${(limit / 200) * 100}%` }}
                                    />
                                    <input
                                        type="range"
                                        min="5"
                                        max="280"
                                        step="5"
                                        value={limit}
                                        onChange={(e) => setLimit(parseInt(e.target.value))}
                                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                    />
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-primary rounded-full shadow-lg transition-all duration-300 pointer-events-none"
                                        style={{ left: `calc(${(limit / 200) * 100}% - 10px)` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-black text-foreground/20 uppercase tracking-widest">
                                    <span>5 USDC</span>
                                    <span>280 USDC</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Guarding Policy */}
                    <div className="space-y-6 pb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">3</div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Guarding Policy</h3>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'strict', icon: Lock, label: 'Strict', desc: 'Hard decline on any charge over the limit.' },
                                { id: 'adaptive', icon: Zap, label: 'AI-Adaptive', desc: 'Allows small variances based on history.' },
                                { id: 'manual', icon: Hand, label: 'Manual', desc: 'Approve every single transaction manually.' }
                            ].map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPolicy(p.id as any)}
                                    className={cn(
                                        "glass-card p-6 flex flex-col items-start text-left gap-4 transition-all duration-300",
                                        policy === p.id
                                            ? "border-primary/50 bg-primary/[0.02]"
                                            : "border-white/5 bg-white/[0.01] hover:border-white/10"
                                    )}
                                >
                                    <div className={cn(
                                        "p-2 rounded-lg",
                                        policy === p.id ? "bg-primary/20 text-primary" : "bg-white/5 text-foreground/30"
                                    )}>
                                        <p.icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-white">{p.label}</p>
                                        <p className="text-[10px] text-foreground/40 leading-relaxed">{p.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleCreate}
                        className="w-full py-5 rounded-2xl bg-primary text-black text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_4px_30px_rgba(34,197,94,0.3)] flex items-center justify-center gap-3 group"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Create Shielded Card
                    </button>
                </div>

                {/* Right Side: Live Preview */}
                <div className="w-[450px] p-12 bg-black/50 space-y-12">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Live Preview</h3>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Updating</span>
                        </div>
                    </div>

                    {/* Virtual Card Preview */}
                    <div className="relative aspect-[1.58/1] w-full max-w-sm mx-auto group perspective-1000">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-black rounded-[24px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative h-full w-full rounded-[24px] border border-white/10 p-8 flex flex-col justify-between overflow-hidden bg-[#0a0a0c] shadow-2xl">
                            {/* Mesh Gradient Background */}
                            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_0%,_#22c55e22_0%,_transparent_70%)]" />

                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-primary" />
                                    <span className="text-[10px] font-black tracking-widest text-white uppercase italic">SubGuard</span>
                                </div>
                                <div className="w-10 h-6 bg-white/5 rounded-md flex items-center justify-center border border-white/10 overflow-hidden">
                                    <div className="flex -space-x-2">
                                        <div className="w-4 h-4 rounded-full bg-red-500/80" />
                                        <div className="w-4 h-4 rounded-full bg-yellow-500/80" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-8 bg-black/40 border border-white/5 rounded-md relative flex items-center justify-center">
                                        <div className="grid grid-cols-2 gap-px w-6">
                                            {[...Array(6)].map((_, i) => <div key={i} className="h-1 bg-white/10 rounded" />)}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-foreground/20">Virtual Debit</p>
                                        <div className="flex gap-px">
                                            <div className="w-1 h-3 bg-white/20 rounded-full" />
                                            <div className="w-1 h-3 bg-white/40 rounded-full h-4 translate-y-[-2px]" />
                                            <div className="w-1 h-3 bg-white/20 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <div className="flex gap-3 text-lg font-mono tracking-[0.2em] text-white/40">
                                            <span>••••</span>
                                            <span>••••</span>
                                            <span>••••</span>
                                            <span className="text-white">4291</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-foreground/30">Card Holder</p>
                                    <p className="text-xs font-bold text-white uppercase tracking-tight">SubGuard User</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-foreground/30">Expiry</p>
                                    <p className="text-xs font-bold text-white font-mono">12 / 27</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 bg-white/[0.02] border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                                <img src={merchant?.icon || currentMerchant?.icon || '/icons/General.png'} alt="merchant" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-bold text-white uppercase">{merchant?.name || currentMerchant?.name || 'New Shield'}</h4>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-bold text-primary">{limit}.00</span>
                                        <span className="text-[9px] font-black text-primary/40 uppercase">USDC</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-foreground/30 font-medium tracking-tight mb-1">{merchant?.category || 'SaaS Management'}</p>
                                <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">{frequency} Cap</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20 items-start">
                            <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <p className="text-[10px] text-primary/70 leading-relaxed font-medium">
                                {policy === 'adaptive' ? 'AI-Adaptive mode enabled. ±5% variance allowed for subscription adjustments.' :
                                    policy === 'strict' ? 'Strict mode enabled. Any transaction over the cap will be declined.' :
                                        'Manual mode enabled. Every transaction requires your cryptographic authorization.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
