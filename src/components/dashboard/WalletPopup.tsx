'use client';

import { useState, useEffect } from 'react';
import {
    X,
    ArrowUpRight,
    ArrowDownLeft,
    Copy,
    Check,
    Shield,
    ExternalLink,
    ChevronLeft
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function WalletPopup({
    isOpen,
    onClose,
    address,
    userId,
    balance = 0,
    setBalance,
    addTransaction,
    setArcConfirm
}: {
    isOpen: boolean;
    onClose: () => void;
    address: string;
    userId?: string;
    balance?: number;
    setBalance: (bal: number) => void;
    addTransaction: (tx: any) => void;
    setArcConfirm: (data: any) => void;
}) {
    const [view, setView] = useState<'main' | 'send' | 'receive'>('main');
    const [copied, setCopied] = useState(false);
    const [sendAmount, setSendAmount] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [txResult, setTxResult] = useState<{ success: boolean; message: string } | null>(null);
    const [currentBalance, setCurrentBalance] = useState<number>(balance);

    // Fetch real balance on open
    useEffect(() => {
        if (isOpen && userId) {
            fetch(`/api/wallet/balance?userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setCurrentBalance(parseFloat(data.balance) || 0);
                    }
                })
                .catch(console.error);
        }
    }, [isOpen, userId]);

    if (!isOpen) return null;

    const copyAddress = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePercent = (percent: number) => {
        const amt = (currentBalance * percent) / 100;
        setSendAmount(amt.toFixed(2));
    };

    const handleConfirm = async () => {
        if (!sendAmount || !recipientAddress) return;

        setArcConfirm({
            isOpen: true,
            type: 'transfer',
            details: {
                amount: sendAmount,
                to: recipientAddress,
                fee: '0.00 USDC'
            },
            onConfirm: async () => {
                setIsSending(true);
                setTxResult(null);

                try {
                    const response = await fetch('/api/wallet/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: userId,
                            toAddress: recipientAddress,
                            amount: sendAmount
                        })
                    });

                    const data = await response.json();

                    if (data.success) {
                        // Immediate Local State Update
                        setBalance(currentBalance - parseFloat(sendAmount));
                        addTransaction({
                            merchant: 'USDC Settlement',
                            amount: sendAmount,
                            status: 'Approved'
                        });

                        setTxResult({ success: true, message: `Settlement complete!` });

                        // Reset WalletPopup state
                        setIsSending(false);
                        setView('main');
                        setSendAmount('');
                        setRecipientAddress('');
                    } else {
                        setTxResult({ success: false, message: data.error || 'Transaction failed' });
                        setIsSending(false);
                        throw new Error(data.error || 'Transaction failed');
                    }
                } catch (error: any) {
                    setTxResult({ success: false, message: error.message });
                    setIsSending(false);
                    throw error;
                }
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full h-[90vh] sm:h-auto sm:max-h-[85vh] sm:max-w-md glass-card bg-[#0a0a0c] border-white/10 overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 shadow-2xl rounded-t-3xl sm:rounded-2xl">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {view !== 'main' && (
                            <button onClick={() => setView('main')} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                                <ChevronLeft className="w-5 h-5 text-foreground/40" />
                            </button>
                        )}
                        <span className="text-sm font-bold tracking-widest text-white uppercase italic">
                            {view === 'main' ? 'Treasury Wallet' : view === 'send' ? 'Send USDC' : 'Receive Assets'}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-foreground/40" />
                    </button>
                </div>

                <div className="p-8">
                    {view === 'main' && (
                        <div className="space-y-8">
                            <div className="text-center space-y-2 py-2">
                                <p className="text-[9px] font-black tracking-[0.3em] text-foreground/30 uppercase">Available Balance</p>
                                <div className="flex items-baseline justify-center gap-2">
                                    <h2 className="text-4xl font-medium tracking-tight text-white">{currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                                    <span className="text-base font-bold text-primary/60">USDC</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setView('send')}
                                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group"
                                >
                                    <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Send</span>
                                </button>
                                <button
                                    onClick={() => setView('receive')}
                                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group"
                                >
                                    <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                        <ArrowDownLeft className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Receive</span>
                                </button>
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-foreground/30 font-bold uppercase tracking-widest">Network</span>
                                    <span className="text-primary font-bold">Arc Testnet (L1)</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-foreground/30 font-bold uppercase tracking-widest">Provider</span>
                                    <span className="text-white/60 font-bold">Circle non-custodial</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'send' && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Recipient Address</label>
                                    <input
                                        type="text"
                                        placeholder="0x..."
                                        value={recipientAddress}
                                        onChange={(e) => setRecipientAddress(e.target.value)}
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-4 text-sm focus:border-primary/50 transition-colors outline-none font-mono"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Amount (USDC)</label>
                                        <button
                                            onClick={() => setSendAmount(currentBalance.toString())}
                                            className="text-[10px] font-black text-primary uppercase hover:underline transition-all"
                                        >
                                            Max Amount
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="0.00"
                                                value={sendAmount}
                                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-4 text-sm focus:border-primary/50 transition-colors outline-none font-mono"
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9.]/g, '');
                                                    setSendAmount(val);
                                                }}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-foreground/20 uppercase tracking-widest">USDC</div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePercent(20)}
                                                className="flex-grow py-2 rounded-lg bg-white/[0.03] border border-white/5 text-[9px] font-black uppercase tracking-widest text-foreground/40 hover:bg-white/10 hover:text-white transition-all"
                                            >
                                                20% of Balance
                                            </button>
                                            <button
                                                onClick={() => handlePercent(50)}
                                                className="flex-grow py-2 rounded-lg bg-white/[0.03] border border-white/5 text-[9px] font-black uppercase tracking-widest text-foreground/40 hover:bg-white/10 hover:text-white transition-all"
                                            >
                                                50% of Balance
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleConfirm}
                                disabled={isSending || !sendAmount}
                                className="w-full py-4 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_4px_20px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isSending ? 'Transmitting Assets...' : 'Confirm Transmission'}
                            </button>
                        </div>
                    )}

                    {view === 'receive' && (
                        <div className="space-y-8 text-center">
                            <div className="flex justify-center">
                                <div className="p-6 rounded-3xl bg-white bg-white/[0.01] border border-white/5">
                                    {/* Mock QR placeholder */}
                                    <div className="w-48 h-48 bg-white/[0.05] rounded-xl flex items-center justify-center border border-white/10">
                                        <div className="w-32 h-32 border-2 border-primary/20 rounded-lg flex items-center justify-center">
                                            <Shield className="w-16 h-16 text-primary/10" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Your Treasury Address</p>
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
                                    <span className="text-[11px] font-mono text-foreground/60 truncate flex-grow text-left">
                                        {address === '0x...' ? 'Syncing with Arc Testnet...' : address}
                                    </span>
                                    {address !== '0x...' && (
                                        <button
                                            onClick={copyAddress}
                                            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-primary"
                                        >
                                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <p className="text-[10px] text-foreground/30 px-6 leading-relaxed">
                                Only send <span className="text-primary/60 font-bold">USDC</span> to this address on the <span className="text-primary/60 font-bold">Arc Testnet</span>. Other assets may be permanently lost.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Tip */}
                <div className="p-6 bg-primary/5 border-t border-white/5 flex items-center gap-3">
                    <Shield className="w-4 h-4 text-primary" />
                    <p className="text-[10px] text-primary/60 font-medium leading-relaxed uppercase tracking-tighter">
                        Institutional-grade non-custodial security by Circle
                    </p>
                </div>
            </div>
        </div>
    );
}
