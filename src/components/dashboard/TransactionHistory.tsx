'use client';

import { RotateCcw } from 'lucide-react';

interface Transaction {
    id: number;
    merchant: string;
    status: string;
    amount: string;
    time: string;
    method: string;
    hash?: string;
}

export default function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
    return (
        <div className="glass-card overflow-hidden bg-white/[0.01] border-white/5">
            <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">
                    <tr>
                        <th className="p-6">Entity</th>
                        <th className="p-6">Signal</th>
                        <th className="p-6">Registry Hash</th>
                        <th className="p-6 text-right">Value</th>
                        <th className="p-6 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="p-6 font-bold text-sm tracking-tight">{tx.merchant}</td>
                            <td className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Approved' ? "bg-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{tx.status}</span>
                                </div>
                            </td>
                            <td className="p-6">
                                {tx.status === 'Approved' ? (
                                    <a
                                        href={`https://testnet.arcscan.app/tx/${tx.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-mono text-primary/40 hover:text-primary transition-colors hover:underline uppercase"
                                    >
                                        {tx.hash ? `${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}` : 'View'}
                                    </a>
                                ) : (
                                    <span className="text-[10px] font-mono text-foreground/10">—</span>
                                )}
                            </td>
                            <td className="p-6 text-right font-mono text-sm font-bold text-primary">{tx.amount} USDC</td>
                            <td className="p-6 text-right opacity-20 hover:opacity-100 transition-opacity">
                                <RotateCcw className="w-4 h-4 cursor-pointer inline" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
