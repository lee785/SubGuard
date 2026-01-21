'use client';

import {
    Plus,
    Shield,
    Settings,
    Eye,
    TrendingUp,
    MoreHorizontal,
    ArrowUpRight,
    Library,
    X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect } from 'react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const MOCK_SHIELD_CARDS = [
    {
        id: 1,
        name: 'Netflix Primary',
        merchant: 'Netflix',
        logo: '/icons/Netflix.png',
        limit: 20,
        spent: 15.99,
        last3: '291',
        fullNumber: '4242 4242 4242 4291',
        status: 'Active',
        tier: 'Free',
        frequency: 'monthly'
    },
    {
        id: 2,
        name: 'OpenAI Dev',
        merchant: 'OpenAI',
        logo: '/icons/OpenAi.png',
        limit: 50,
        spent: 32.40,
        last3: '812',
        fullNumber: '4111 1111 1111 1812',
        status: 'Guarded',
        tier: 'Tier 2',
        frequency: 'monthly'
    }
];

interface CardsManagerProps {
    onGenerateCard: () => void;
    onUpgrade: () => void;
    onUpdateCard: (updatedCard: any) => void;
    currentTier: { id: string, name: string, maxCards: number };
    userCards: any[];
    initialSelectedCard?: any;
    onCloseDetails?: () => void;
}

export default function CardsManager({
    onGenerateCard,
    onUpgrade,
    onUpdateCard,
    currentTier,
    userCards,
    initialSelectedCard,
    onCloseDetails
}: CardsManagerProps) {
    const [selectedCardForDetails, setSelectedCardForDetails] = useState<any>(null);
    const [selectedCardForSettings, setSelectedCardForSettings] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    // Effect to handle initial view from external navigation (e.g. Success Screen)
    useEffect(() => {
        if (initialSelectedCard) {
            setSelectedCardForDetails(initialSelectedCard);
        }
    }, [initialSelectedCard]);

    const cardsToDisplay = userCards.length > 0 ? userCards : MOCK_SHIELD_CARDS;
    const isMockState = userCards.length === 0;

    const handleGenerateClick = () => {
        if (userCards.length >= currentTier.maxCards) {
            if (currentTier.id !== 'tier2') { // Assuming tier2 is the max tier which is called Tier 3 in the UI
                onUpgrade();
            }
            return;
        }
        onGenerateCard();
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const adjustLimit = (percent: number) => {
        if (!selectedCardForSettings) return;
        const factor = 1 + percent / 100;
        const newLimit = Math.round(selectedCardForSettings.limit * factor);
        const updated = { ...selectedCardForSettings, limit: newLimit };
        setSelectedCardForSettings(updated);
        onUpdateCard(updated);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Tier Stats Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 glass-card border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Library className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black tracking-[0.3em] text-foreground/20 uppercase">Current Subscription</p>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white">{currentTier.name}</h3>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded bg-primary text-black uppercase tracking-widest">Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-12">
                    <div className="space-y-1 text-center md:text-left">
                        <p className="text-[10px] font-black tracking-[0.2em] text-foreground/20 uppercase">Card Usage</p>
                        <p className="text-xl font-bold text-white">
                            {userCards.length} <span className="text-foreground/20">/</span> {currentTier.maxCards}
                        </p>
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                        <p className="text-[10px] font-black tracking-[0.2em] text-foreground/20 uppercase">Limit Remaining</p>
                        <p className="text-xl font-bold text-primary">$320.00</p>
                    </div>
                </div>

                <button
                    onClick={onUpgrade}
                    className="px-6 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2"
                >
                    Upgrade Tier
                    <ArrowUpRight className="w-3 h-3" />
                </button>
            </div>

            {/* Content Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Virtual Shields</h2>
                    <p className="text-sm text-foreground/40 font-medium">Isolated, non-custodial payment methods for your treasury.</p>
                </div>
                <button
                    onClick={handleGenerateClick}
                    disabled={currentTier.id === 'tier2' && userCards.length >= currentTier.maxCards}
                    className="px-6 py-3 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-[0_4px_20px_rgba(34,197,94,0.3)] flex items-center gap-2"
                >
                    <Plus className="w-3 h-3 stroke-[4px]" />
                    {userCards.length >= currentTier.maxCards && currentTier.id !== 'tier2' ? 'Upgrade to Create' : 'Generate Shield Card'}
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cardsToDisplay.map((card, idx) => (
                    <div
                        key={card.id || idx}
                        className={cn(
                            "glass-card p-8 bg-white/[0.01] border-white/5 space-y-8 group relative overflow-hidden transition-all",
                            !isMockState ? "hover:border-primary/20" : "opacity-60 cursor-not-allowed"
                        )}
                    >
                        {/* Card Reflection/Glow Effect */}
                        {!isMockState && (
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-all" />
                        )}

                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                    <img src={card.merchant?.icon || card.logo} alt={card.merchant?.name || card.name} className="w-7 h-7 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-lg font-bold text-white/90">{card.merchant?.name || card.name}</h3>
                                    <p className="text-[11px] font-mono tracking-[0.2em] text-foreground/30">•••• {card.last3 || card.last4?.slice(-3)}</p>
                                </div>
                            </div>
                            <div className={cn(
                                "px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest",
                                (card.status === 'Active' || card.policy) ? "bg-primary/20 text-primary" : "bg-blue-500/20 text-blue-400"
                            )}>
                                {card.status || 'Active'}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">
                                <span>{card.frequency === 'daily' ? 'Daily' : card.frequency === 'yearly' ? 'Yearly' : 'Monthly'} Spending Limit</span>
                                <span className="text-foreground/40">
                                    <span className="text-white">${card.spent || '0.00'}</span> / ${card.limit}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary/40 rounded-full group-hover:bg-primary transition-all duration-500"
                                    style={{ width: `${((card.spent || 0) / card.limit) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => !isMockState && setSelectedCardForDetails(card)}
                                disabled={isMockState}
                                className="flex-grow py-3 rounded-xl bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Eye className="w-3 h-3" />
                                View Details
                            </button>
                            <button
                                onClick={() => !isMockState && setSelectedCardForSettings(card)}
                                disabled={isMockState}
                                className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition-all"
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State / placeholder for empty slots */}
                {userCards.length > 0 && userCards.length < currentTier.maxCards && (
                    <button
                        onClick={onGenerateCard}
                        className="glass-card border-dashed border-white/5 hover:border-primary/20 bg-white/[0.01] flex flex-col items-center justify-center p-12 group transition-all h-[240px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all border border-transparent group-hover:border-primary/20">
                            <Plus className="w-6 h-6 text-foreground/20 group-hover:text-primary" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 group-hover:text-primary">Generate Shield {userCards.length + 1}</p>
                    </button>
                )}
            </div>

            {/* --- Modals --- */}
            {selectedCardForDetails && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => {
                        setSelectedCardForDetails(null);
                        onCloseDetails?.();
                    }} />
                    <div className="relative w-full max-w-md glass-card bg-[#0a0a0c] border-white/10 p-8 space-y-8 animate-in zoom-in-95">
                        <button onClick={() => {
                            setSelectedCardForDetails(null);
                            onCloseDetails?.();
                        }} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-5 h-5 text-foreground/40" />
                        </button>
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                                <img src={selectedCardForDetails.merchant?.icon || selectedCardForDetails.logo} alt="logo" className="w-10 h-10 object-contain" />
                            </div>
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">{selectedCardForDetails.merchant?.name || selectedCardForDetails.name} Details</h3>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Arc L1 Network Verified</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/5 relative group/item">
                                <p className="text-[9px] font-black text-foreground/20 uppercase tracking-widest">Card Number</p>
                                <p className="text-xl font-mono text-white tracking-[0.2em]">{selectedCardForDetails.fullNumber || '4242 4242 4242 ' + selectedCardForDetails.last4}</p>
                                <button
                                    onClick={() => handleCopy(selectedCardForDetails.fullNumber || '4242 4242 4242 ' + selectedCardForDetails.last4)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/item:opacity-100 transition-all hover:bg-primary hover:text-black"
                                >
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <p className="text-[9px] font-black text-foreground/20 uppercase tracking-widest">Expiry</p>
                                    <p className="text-lg font-mono text-white">{selectedCardForDetails.expiry || '12/27'}</p>
                                </div>
                                <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <p className="text-[9px] font-black text-foreground/20 uppercase tracking-widest">CVV</p>
                                    <p className="text-lg font-mono text-white">{selectedCardForDetails.cvv || '***'}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedCardForDetails(null);
                                onCloseDetails?.();
                            }}
                            className="w-full py-4 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest shadow-[0_4px_20px_rgba(34,197,94,0.3)]"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {selectedCardForSettings && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedCardForSettings(null)} />
                    <div className="relative w-full max-w-md glass-card bg-[#0a0a0c] border-white/10 p-8 space-y-8 animate-in zoom-in-95">
                        <button onClick={() => setSelectedCardForSettings(null)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-5 h-5 text-foreground/40" />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <img src={selectedCardForSettings.merchant?.icon || selectedCardForSettings.logo} alt="logo" className="w-7 h-7 object-contain" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight">{selectedCardForSettings.merchant?.name || selectedCardForSettings.name}</h3>
                                <p className="text-[10px] font-mono text-foreground/30">•••• {selectedCardForSettings.last4}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-baseline">
                                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Adjust {selectedCardForSettings.isGeneral ? 'Daily' : 'Monthly'} Limit</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-white">${selectedCardForSettings.limit}</span>
                                        <span className="text-[10px] font-black text-primary">USDC</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => adjustLimit(-10)} className="flex-grow py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">- 10%</button>
                                    <button onClick={() => adjustLimit(10)} className="flex-grow py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">+ 10%</button>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Guarding Status</p>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-bold text-white uppercase tracking-tight">Active Protection</span>
                                    </div>
                                    <div className="w-10 h-5 bg-primary/20 rounded-full relative">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_#22c55e]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedCardForSettings(null)}
                            className="w-full py-4 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
