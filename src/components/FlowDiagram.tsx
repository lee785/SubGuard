'use client';

import React from 'react';

const FlowDiagram = () => {
    return (
        <section className="relative overflow-hidden pt-24 pb-8 px-6">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-20 text-center">
                    <h2 className="text-5xl font-black tracking-widest text-primary uppercase mb-8">Cyber Grid Protocol</h2>
                    <p className="text-foreground/40 max-w-4xl mx-auto font-bold uppercase tracking-widest text-sm">Technical sequence for JIT Liquidity and Burner Cards solution.</p>
                </div>

                <div className="relative w-full aspect-[16/9] glass-card bg-[#050507] border-white/5 overflow-hidden p-0 shadow-[0_20px_60px_rgba(34,197,94,0.08)]">
                    <svg viewBox="0 0 1200 650" className="w-full h-full p-8 font-mono">
                        {/* Lifelines / Entities (Top) */}
                        <g transform="translate(100, 40)">
                            <rect width="160" height="50" rx="10" fill="white" fillOpacity="0.05" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
                            <text x="80" y="32" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">User</text>
                            <line x1="80" y1="50" x2="80" y2="520" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.1" />
                        </g>

                        <g transform="translate(300, 40)">
                            <rect width="200" height="50" rx="10" fill="white" fillOpacity="0.05" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
                            <text x="100" y="32" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">SubGuard Wallet (USDC)</text>
                            <line x1="100" y1="50" x2="100" y2="520" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.1" />
                        </g>

                        <g transform="translate(540, 40)">
                            <rect width="200" height="50" rx="10" fill="white" fillOpacity="0.05" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
                            <text x="100" y="32" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">SubGuard Agent (AI)</text>
                            <line x1="100" y1="50" x2="100" y2="520" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.1" />
                        </g>

                        <g transform="translate(780, 40)">
                            <rect width="180" height="50" rx="10" fill="white" fillOpacity="0.05" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
                            <text x="90" y="32" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Virtual Card API</text>
                            <line x1="90" y1="50" x2="90" y2="520" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.1" />
                        </g>

                        <g transform="translate(1000, 40)">
                            <rect width="160" height="50" rx="10" fill="white" fillOpacity="0.05" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
                            <text x="80" y="32" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Netflix</text>
                            <line x1="80" y1="50" x2="80" y2="520" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.1" />
                        </g>

                        {/* Lifelines / Entities (Bottom) */}
                        <g transform="translate(100, 520)">
                            <rect width="160" height="50" rx="10" fill="white" fillOpacity="0.05" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
                            <text x="80" y="32" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">User</text>
                        </g>

                        <g transform="translate(300, 520)">
                            <rect width="200" height="50" rx="10" fill="white" fillOpacity="0.05" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
                            <text x="100" y="32" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">SubGuard Wallet (USDC)</text>
                        </g>

                        <g transform="translate(540, 520)">
                            <rect width="200" height="50" rx="10" fill="white" fillOpacity="0.05" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
                            <text x="100" y="32" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">SubGuard Agent (AI)</text>
                        </g>

                        <g transform="translate(780, 520)">
                            <rect width="180" height="50" rx="10" fill="white" fillOpacity="0.05" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
                            <text x="90" y="32" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Virtual Card API</text>
                        </g>

                        <g transform="translate(1000, 520)">
                            <rect width="160" height="50" rx="10" fill="white" fillOpacity="0.05" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
                            <text x="80" y="32" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Netflix</text>
                        </g>

                        {/* Arrows and Sequence */}
                        <path d="M 180 120 L 400 120" stroke="#22c55e" strokeWidth="1.5" fill="none" className="animate-flow-line" />
                        <circle cx="400" cy="120" r="3" fill="#22c55e" className="animate-pulse" />
                        <text x="210" y="110" fill="#22c55e" fontSize="10" fontWeight="bold" opacity="0.8">Deposits $500 USDC</text>

                        <path d="M 400 145 L 640 145" stroke="#22c55e" strokeWidth="1.5" fill="none" className="animate-flow-line" />
                        <circle cx="640" cy="145" r="3" fill="#22c55e" />
                        <text x="440" y="135" fill="#22c55e" fontSize="10" fontWeight="bold" opacity="0.8">Deposits $500 USDC</text>

                        <path d="M 640 170 L 870 170" stroke="#22c55e" strokeWidth="1.5" fill="none" className="animate-flow-line" />
                        <circle cx="870" cy="170" r="3" fill="#22c55e" />
                        <text x="680" y="160" fill="#22c55e" fontSize="10" fontWeight="bold" opacity="0.8">Generate Virtual Visa</text>

                        {/* Monthly Cycle Line */}
                        <path d="M 180 230 L 1080 230" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.4" />
                        <circle cx="1080" cy="230" r="3" fill="#22c55e" />
                        <text x="630" y="220" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="black" letterSpacing="0.1em">Monthly Cycle</text>

                        {/* Vertical Connections to Monthly Cycle */}
                        <line x1="180" y1="230" x2="180" y2="520" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
                        <circle cx="180" cy="230" r="2" fill="#22c55e" />

                        <line x1="1080" y1="230" x2="1080" y2="520" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
                        <circle cx="1080" cy="230" r="2" fill="#22c55e" />

                        {/* Alt Branch / Kill List */}
                        <g transform="translate(540, 275)">
                            <rect width="200" height="110" rx="10" fill="white" fillOpacity="0.02" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
                            <path d="M 0 55 L 200 55" stroke="white" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="4 4" />

                            <rect width="36" height="18" rx="4" fill="#22c55e" opacity="0.8" />
                            <text x="18" y="13" textAnchor="middle" fill="black" fontSize="9" fontWeight="black">alt</text>

                            {/* Check Kill List (Green) */}
                            <rect width="200" height="55" rx="10" fill="#22c55e" fillOpacity="0.05" />
                            <text x="100" y="35" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">Check Kill List</text>

                            {/* Killed (Red) */}
                            <path d="M 0 55 L 200 55 L 200 100 Q 200 110 190 110 L 10 110 Q 0 110 0 100 Z" fill="#ef4444" fillOpacity="0.05" />
                            <text x="100" y="90" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Killed</text>
                        </g>

                        <path d="M 1080 230 L 1080 300 L 740 300" stroke="#22c55e" strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.2" />

                        {/* Approved (Green Flowing Line) */}
                        <path d="M 740 315 L 870 315" stroke="#22c55e" strokeWidth="1.5" fill="none" className="animate-flow-line" />
                        <text x="760" y="305" fill="#22c55e" fontSize="9" fontWeight="bold">Approved</text>

                        {/* Killed (Red Flowing Line) */}
                        <path d="M 740 375 L 870 375" stroke="#ef4444" strokeWidth="1.5" fill="none" className="animate-flow-line" />
                        <text x="760" y="365" fill="#ef4444" fontSize="9" fontWeight="bold">Killed</text>

                        {/* Final Transmission & Results */}
                        {/* Charge Signal (Green) - RE-ROUTED TO TOP NETFLIX */}
                        <path d="M 870 430 L 1080 430 L 1080 90" stroke="#22c55e" strokeWidth="2" fill="none" className="animate-flow-line" opacity="0.8" />
                        <circle cx="1080" cy="90" r="3" fill="#22c55e" className="animate-pulse" />
                        <text x="900" y="420" fill="#22c55e" fontSize="10" fontWeight="bold">Charge $15.99</text>

                        {/* Declined Signal (Red) */}
                        <text x="900" y="450" fill="#ef4444" fontSize="10" fontWeight="bold">DECLINED (insufficient Funds)</text>

                        <path d="M 400 480 L 180 480" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                        <text x="250" y="475" fill="#22c55e" fontSize="10" fontWeight="bold" opacity="0.5">Rename</text>

                        {/* ROUND 4/5 Improvements: Entity Feedback Loops */}

                        {/* 1. Bottom User -> Top User flow */}
                        <path d="M 180 520 L 180 90" stroke="#22c55e" strokeWidth="2" fill="none" className="animate-flow-line" opacity="0.4" />
                        <circle cx="180" cy="90" r="3" fill="#22c55e" className="animate-pulse" />

                        {/* 2. Bottom Agent -> alt box (Kill List) flow */}
                        <path d="M 640 520 L 640 385" stroke="#22c55e" strokeWidth="2" fill="none" className="animate-flow-line" opacity="0.4" />
                        <circle cx="640" cy="385" r="3" fill="#22c55e" className="animate-pulse" />

                        {/* 3. Declined branching flows (to Merchant and Card API) */}
                        <path d="M 940 450 L 1080 450 L 1080 520" stroke="#ef4444" strokeWidth="1.5" fill="none" className="animate-flow-line" opacity="0.5" />
                        <path d="M 940 450 L 870 450 L 870 520" stroke="#ef4444" strokeWidth="1.5" fill="none" className="animate-flow-line" opacity="0.5" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default FlowDiagram;
