'use client';

import { useState } from 'react';
import { Bell, Lock, Cpu } from 'lucide-react';

export default function SettingsView() {
    const [toggles, setToggles] = useState<Record<string, boolean>>({
        "Merchant Block Events": true,
        "Low Treasury Balance": true,
        "Policy Update Successful": false,
        "High Fidelity Analysis (Gemini 1.5)": true,
        "Automatic Card Cooling": true,
        "Web3 Signature Passthrough": false
    });

    const toggle = (label: string) => {
        setToggles(prev => ({ ...prev, [label]: !prev[label] }));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold">Preferences</h2>
                <p className="text-foreground/40 text-sm">Configure your guarding parameters and notifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Notification Settings */}
                <div className="glass-card p-8 bg-white/[0.01] border-white/5 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg">Alert Signals</h3>
                    </div>

                    <div className="space-y-4">
                        <ToggleItem label="Merchant Block Events" checked={toggles["Merchant Block Events"]} onToggle={toggle} />
                        <ToggleItem label="Low Treasury Balance" checked={toggles["Low Treasury Balance"]} onToggle={toggle} />
                        <ToggleItem label="Policy Update Successful" checked={toggles["Policy Update Successful"]} onToggle={toggle} />
                    </div>
                </div>

                {/* Security Settings */}
                <div className="glass-card p-8 bg-white/[0.01] border-white/5 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="font-bold text-lg">Guardian Protocols</h3>
                    </div>

                    <div className="space-y-4">
                        <ToggleItem label="High Fidelity Analysis (Gemini 1.5)" checked={toggles["High Fidelity Analysis (Gemini 1.5)"]} onToggle={toggle} />
                        <ToggleItem label="Automatic Card Cooling" checked={toggles["Automatic Card Cooling"]} onToggle={toggle} />
                        <ToggleItem label="Web3 Signature Passthrough" checked={toggles["Web3 Signature Passthrough"]} onToggle={toggle} />
                    </div>
                </div>

                {/* API / Integration Settings */}
                <div className="glass-card p-8 bg-white/[0.01] border-white/5 space-y-6 md:col-span-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Cpu className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="font-bold text-lg">Network Integration</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Active Testnet</p>
                            <p className="font-mono text-sm">Arc_Testnet</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Webhook Endpoint</p>
                            <p className="font-mono text-sm">https://agent.subguard.ai/v1/hook</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToggleItem({ label, checked, onToggle }: { label: string, checked: boolean, onToggle: (label: string) => void }) {
    return (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-foreground/70">{label}</span>
            <button
                onClick={() => onToggle(label)}
                className={`w-10 h-5 rounded-full relative transition-[background-color] duration-200 p-1 ${checked ? 'bg-primary' : 'bg-white/10'}`}
            >
                <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </div>
    );
}
