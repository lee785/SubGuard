'use client';

import { useState } from 'react';
import { Wallet, Power, ArrowUpRight, ArrowDownLeft, Copy, ExternalLink, Zap } from 'lucide-react';

interface WalletProfileProps {
    address: string;
    balance: string;
    logout: () => void;
}

export default function WalletProfile({ address, balance, logout }: WalletProfileProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white/[0.03] p-1.5 rounded-xl border border-white/5 hover:bg-white/[0.06] transition-all cursor-pointer group"
            >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Wallet className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col items-start pr-2">
                    <span className="text-[9px] uppercase text-foreground/40 font-bold tracking-tight">Balance</span>
                    <span className="text-xs font-mono font-bold text-primary">{balance} USDC</span>
                </div>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-4 w-72 glass-card p-6 z-50 bg-[#0a0a0c]/95 border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Your Wallet</span>
                                <button onClick={logout} className="text-red-500 hover:text-red-400 transition-colors">
                                    <Power className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono opacity-60">
                                        {address.slice(0, 8)}...{address.slice(-8)}
                                    </span>
                                    <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                                        <Copy className="w-3.5 h-3.5 opacity-40" />
                                    </button>
                                </div>
                                <div className="text-2xl font-black font-mono tracking-tighter text-primary">
                                    {balance} <span className="text-[10px] opacity-20">USDC</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-black text-[10px] font-black tracking-widest hover:bg-primary/90 transition-colors">
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                    SEND
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black tracking-widest hover:bg-white/10 transition-colors">
                                    <ArrowDownLeft className="w-3.5 h-3.5" />
                                    RECEIVE
                                </button>
                            </div>

                            <div className="pt-2 border-t border-white/5">
                                <a
                                    href={`https://testnet.arcscan.app/address/${address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 text-[10px] font-bold text-foreground/30 hover:text-primary transition-colors py-2"
                                >
                                    VIEW ON ARCSCAN
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
