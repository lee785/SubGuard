'use client';

import { useState } from 'react';
import { Settings, XCircle } from 'lucide-react';
import ShieldConfigPopup from './ShieldConfigPopup';

interface Subscription {
    id: number;
    name: string;
    type: string;
    amount: string;
    status: string;
    icon: string;
}

interface SubscriptionListProps {
    subs: Subscription[];
    toggleSub: (id: number) => void;
    onUnsubscribe: (id: number) => void;
}

export default function SubscriptionList({ subs, toggleSub, onUnsubscribe }: SubscriptionListProps) {
    const [showAll, setShowAll] = useState(false);
    const [selectedSubForConfig, setSelectedSubForConfig] = useState<Subscription | null>(null);
    const displayedSubs = showAll ? subs : subs.slice(0, 3);

    const handleSaveConfig = (config: any) => {
        console.log('Saved config for', selectedSubForConfig?.name, config);
        // Here you would typically notify the parent or save to state
    };

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {displayedSubs.map(sub => (
                    <div key={sub.id} className="glass-card p-6 group flex items-center justify-between border-white/5 hover:border-primary/20 bg-white/[0.01]">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/5 group-hover:bg-white/10 transition-colors">
                                {sub.icon.startsWith('/') ? (
                                    <img src={sub.icon} alt={sub.name} className="w-8 h-8 object-contain" />
                                ) : (
                                    <span className="text-2xl">{sub.icon}</span>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-base">{sub.name}</h4>
                                <p className="text-xs text-foreground/30 uppercase tracking-widest font-black mt-1 flex gap-4">
                                    <span>{sub.type}</span>
                                    <span className="text-primary">{sub.amount} USDC</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                <div className="relative group/tooltip">
                                    <button
                                        onClick={() => toggleSub(sub.id)}
                                        className={`text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-[0.2em] transition-all ${sub.status === 'Active' ? "bg-primary text-black" :
                                            sub.status === 'Guarded' ? "bg-white/10 text-white border border-white/10" :
                                                "bg-red-500/20 text-red-500 border border-red-500/20"
                                            }`}
                                    >
                                        {sub.status}
                                    </button>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-black text-[8px] text-white opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none uppercase tracking-widest font-black">
                                        Agent Guarding Status
                                    </div>
                                </div>
                                <button
                                    onClick={() => onUnsubscribe(sub.id)}
                                    className="text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-[0.2em] bg-red-500/10 text-red-500 border border-red-500/10 hover:bg-red-500/20 transition-all font-mono"
                                >
                                    UNSUBSCRIBE
                                </button>
                            </div>
                            <div className="relative group/tooltip">
                                <button
                                    onClick={() => setSelectedSubForConfig(sub)}
                                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/40 transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-black text-[8px] text-white opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none uppercase tracking-widest font-black">
                                    Configure Shield
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedSubForConfig && (
                <ShieldConfigPopup
                    sub={selectedSubForConfig}
                    onClose={() => setSelectedSubForConfig(null)}
                    onSave={handleSaveConfig}
                />
            )}

            {subs.length > 3 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full py-4 rounded-xl border border-dashed border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 hover:text-white hover:border-white/20 transition-all"
                >
                    {showAll ? 'View Less' : `View all ${subs.length} services`}
                </button>
            )}
        </div>
    );
}
