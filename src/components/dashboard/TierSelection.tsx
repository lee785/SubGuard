'use client';

import { useState } from 'react';
import { Shield, Check, ArrowRight, X, Loader2, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Tier {
    id: 'free' | 'tier1' | 'tier2';
    name: string;
    maxCards: number;
    price: number | 'Free';
    tagline: string;
    features: string[];
}

const TIERS: Tier[] = [
    {
        id: 'free',
        name: 'Tier 1',
        maxCards: 1,
        price: 'Free',
        tagline: 'Start Safe',
        features: ['1 Virtual Shield Card', 'AI-Adaptive Policy', 'Basic Fraud Protection']
    },
    {
        id: 'tier1',
        name: 'Tier 2',
        maxCards: 2,
        price: 20,
        tagline: 'More Safe, More Control',
        features: ['2 Virtual Shield Cards', 'Custom Spending Limits', 'Real-time Guarding']
    },
    {
        id: 'tier2',
        name: 'Tier 3',
        maxCards: 4,
        price: 40,
        tagline: 'Most Safe, Max Flexibility',
        features: ['4 Virtual Shield Cards', 'Advanced Guarding Logic', 'Priority Network Access']
    }
];

interface TierSelectionProps {
    onSelect: (tier: Tier) => void;
    currentTier?: string;
    onClose: () => void;
    userId?: string;
    userBalance?: number;
}

export default function TierSelection({ onSelect, currentTier, onClose, userId, userBalance = 0 }: TierSelectionProps) {
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [upgradingTier, setUpgradingTier] = useState<string | null>(null);

    const handleTierSelect = async (tier: Tier) => {
        setError(null);

        // If already on this tier, do nothing
        if (currentTier === tier.id) return;

        // Free tier - no payment needed
        if (tier.price === 'Free' || tier.price === 0) {
            onSelect(tier);
            return;
        }

        // Check balance before attempting upgrade
        if (userBalance < tier.price) {
            setError(`Not enough balance. You need ${tier.price} USDC but have ${userBalance.toFixed(2)} USDC. Deposit USDC to upgrade tier.`);
            return;
        }

        // Process upgrade with API
        setIsUpgrading(true);
        setUpgradingTier(tier.id);

        try {
            const response = await fetch('/api/tier/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    tierId: tier.id
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store tier in localStorage for persistence
                if (userId) {
                    localStorage.setItem(`tier_${userId}`, tier.id);
                }
                onSelect(tier);
            } else {
                setError(data.error || 'Upgrade failed. Please try again.');
            }
        } catch (err: any) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setIsUpgrading(false);
            setUpgradingTier(null);
        }
    };

    return (
        <div className="relative space-y-12 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-0 right-0 p-3 rounded-full bg-white/5 border border-white/5 text-foreground/40 hover:text-white hover:bg-white/10 transition-all z-10"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold tracking-tight text-white">Select Your Shield Tier</h2>
                <p className="text-foreground/40 max-w-lg mx-auto text-sm leading-relaxed">
                    Choose the level of protection that fits your treasury needs. Each tier unlocks more autonomous virtual cards.
                </p>
                {/* Balance Display */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Your Balance:</span>
                    <span className="text-sm font-bold text-primary">{userBalance.toFixed(2)} USDC</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-2xl mx-auto px-6">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                {TIERS.map((tier) => {
                    const tierPrice = tier.price === 'Free' ? 0 : tier.price;
                    const canAfford = userBalance >= tierPrice;
                    const isCurrentTier = currentTier === tier.id;
                    const isUpgradingThis = upgradingTier === tier.id;

                    return (
                        <div
                            key={tier.id}
                            className={cn(
                                "glass-card p-8 flex flex-col justify-between group relative overflow-hidden transition-all duration-500 hover:scale-[1.02]",
                                isCurrentTier ? "border-primary/50 bg-primary/[0.02]" : "border-white/5 hover:border-white/10"
                            )}
                        >
                            {isCurrentTier && (
                                <div className="absolute top-0 right-0 p-4">
                                    <span className="bg-primary text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Active</span>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-[10px] font-black tracking-[0.3em] text-foreground/30 uppercase mb-2">{tier.name}</h3>
                                    <p className="text-xl font-bold text-white mb-1">{tier.tagline}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-white">{tier.price === 'Free' ? 'FREE' : `$${tier.price}`}</span>
                                        {tier.price !== 'Free' && <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">USDC / One-time</span>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-foreground/40">
                                        <span>Max Cards</span>
                                        <span className="text-white">{tier.maxCards}</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-1000"
                                            style={{ width: `${(tier.maxCards / 4) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <ul className="space-y-3 pt-4">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-xs text-foreground/50">
                                            <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => handleTierSelect(tier)}
                                disabled={isCurrentTier || isUpgrading}
                                className={cn(
                                    "w-full py-4 mt-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                    isCurrentTier
                                        ? "bg-white/5 text-foreground/20 cursor-default"
                                        : !canAfford && tier.price !== 'Free'
                                            ? "bg-red-500/10 border border-red-500/20 text-red-400 cursor-not-allowed"
                                            : "bg-white/[0.03] border border-white/10 text-white hover:bg-primary hover:text-black hover:border-primary hover:shadow-[0_4px_20px_rgba(34,197,94,0.3)]"
                                )}
                            >
                                {isUpgradingThis ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing Payment...
                                    </>
                                ) : isCurrentTier ? (
                                    'Current Tier'
                                ) : !canAfford && tier.price !== 'Free' ? (
                                    'Insufficient Balance'
                                ) : tier.price === 'Free' ? (
                                    <>Activate Free<ArrowRight className="w-3.5 h-3.5" /></>
                                ) : (
                                    <>Activate {tier.name}<ArrowRight className="w-3.5 h-3.5" /></>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-center gap-3 opacity-20 group">
                <Shield className="w-4 h-4" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Institutional Grade Non-Custodial Security</p>
            </div>
        </div>
    );
}
