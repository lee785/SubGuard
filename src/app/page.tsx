'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
    Shield,
    CreditCard,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Settings,
    Activity,
    XCircle,
    CheckCircle2,
    Power,
    RotateCcw,
    Github,
    Twitter,
    MessageCircle,
    Cpu,
    Zap,
    Lock,
    ExternalLink,
    ChevronRight,
    Globe,
    Layers,
    Menu,
    X,
    Bell
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import FlowDiagram from '@/components/FlowDiagram';

// Dashboard Components
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import CardsManager from '@/components/dashboard/CardsManager';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import SubscriptionList from '@/components/dashboard/SubscriptionList';
import SettingsView from '@/components/dashboard/SettingsView';
import WalletProfile from '@/components/dashboard/WalletProfile';
import Transmissions from '@/components/dashboard/Transmissions';
import WalletPopup from '@/components/dashboard/WalletPopup';
import TierSelection from '@/components/dashboard/TierSelection';
import VirtualShieldFlow from '@/components/dashboard/VirtualShieldFlow';
import CardSuccess from '@/components/dashboard/CardSuccess';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Subscriptions with actual icon paths
const MOCK_SUBSCRIPTIONS = [
    { id: 1, name: 'Netflix Premium', type: 'Personal', amount: '15.99', status: 'Active', icon: '/icons/Netflix.png' },
    { id: 2, name: 'OpenAI', type: 'Developer', amount: '124.20', status: 'Guarded', icon: '/icons/OpenAi.png' },
    { id: 3, name: 'YouTube', type: 'Entertainment', amount: '28.00', status: 'Blocked', icon: '/icons/YouTube.png' },
    { id: 4, name: 'Spotify', type: 'Music', amount: '8.00', status: 'Active', icon: '/icons/Spotify.png' },
];

const MOCK_TRANSACTIONS = [
    { id: 1, merchant: 'Netflix', status: 'Approved', amount: '15.99', time: '2h ago', method: 'Arc Testnet' },
    { id: 2, merchant: 'OpenAI', status: 'Blocked', amount: '124.20', time: '5h ago', method: 'Arc Testnet' },
    { id: 3, merchant: 'YouTube', status: 'Approved', amount: '28.00', time: '1d ago', method: 'Arc Testnet' },
];

export default function Home() {
    const { login, authenticated, user, logout, ready, getAccessToken } = usePrivy();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isAgentActive, setIsAgentActive] = useState(true);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [isFlowOpen, setIsFlowOpen] = useState(false);
    const [showTierSelection, setShowTierSelection] = useState(false);
    const [currentTier, setCurrentTier] = useState<{ id: 'free' | 'tier1' | 'tier2', name: string, maxCards: number }>({ id: 'free', name: 'Tier 1', maxCards: 1 });
    const [userCards, setUserCards] = useState<any[]>([]);
    const [cardSuccess, setCardSuccess] = useState<any>(null);
    const [subs, setSubs] = useState(MOCK_SUBSCRIPTIONS);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [circleWallet, setCircleWallet] = useState<any>(null);
    const [balance, setBalance] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'cards' | 'transactions' | 'subscriptions' | 'settings'>('dashboard');
    const [cardToView, setCardToView] = useState<any>(null);

    // Persistence: Load active tab from localStorage
    useEffect(() => {
        const savedTab = localStorage.getItem('subguard_active_tab');
        if (savedTab && ['dashboard', 'cards', 'transactions', 'subscriptions', 'settings'].includes(savedTab)) {
            setActiveTab(savedTab as any);
        }
    }, []);

    // Persistence: Save active tab to localStorage
    useEffect(() => {
        localStorage.setItem('subguard_active_tab', activeTab);
    }, [activeTab]);

    // Trigger onboarding and wallet creation when user authenticates
    useEffect(() => {
        if (ready && authenticated && user) {
            fetchCircleWallet();
            handleOnboard();
        }
    }, [ready, authenticated, user]);

    const fetchCircleWallet = async () => {
        if (!user?.id) return;
        try {
            const token = await getAccessToken();
            const res = await fetch(`/api/wallet?userId=${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setCircleWallet(data.wallet);
                // Also fetch initial balance
                const balRes = await fetch(`/api/wallet/balance?userId=${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const balData = await balRes.json();
                if (balData.success) {
                    setBalance(parseFloat(balData.balance) || 0);
                }
            }
        } catch (err) {
            console.error('Failed to fetch Circle wallet:', err);
        }
    };

    const handleOnboard = async () => {
        if (!user?.id) return;
        if (typeof window !== 'undefined' && localStorage.getItem(`onboarded_${user?.id}`)) {
            console.log('✅ User already onboarded');
            return;
        }

        try {
            console.log('🔄 Triggering onboarding...');
            const token = await getAccessToken();
            const response = await fetch('/api/onboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: user?.id,
                    email: user?.email?.address || 'user@example.com',
                    name: 'Arc Guardian'
                })
            });

            if (response.ok) {
                localStorage.setItem(`onboarded_${user?.id}`, 'true');
                console.log('✅ Onboarding complete');
            }
        } catch (err) {
            console.error('Onboarding failed:', err);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        // Ensure the loading screen stays for at least 3 seconds as requested
        const startTime = Date.now();
        try {
            await logout();
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 3000 - elapsed);
            setTimeout(() => {
                setIsLoggingOut(false);
            }, remaining);
        } catch (err) {
            console.error('Logout failed:', err);
            setIsLoggingOut(false);
        }
    };

    const toggleSub = (id: number) => {
        setSubs(prev => prev.map(s => {
            if (s.id === id) {
                const newStatus = s.status === 'Blocked' ? 'Active' : 'Blocked';
                return { ...s, status: newStatus };
            }
            return s;
        }));
    };

    const handleUpdateCard = (updatedCard: any) => {
        setUserCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    };

    const handleUnsubscribe = (id: number) => {
        const sub = subs.find(s => s.id === id);
        if (!sub) return;

        setSubs(prev => prev.filter(s => s.id !== id));
        const newNotif = {
            id: Date.now(),
            title: `${sub.name} Unsubscribed`,
            description: `Agent Guard initiated. Future transactions for ${sub.name} are now permanently blocked.`,
            type: 'success',
            time: 'Just now'
        };
        setNotifications(prev => [newNotif, ...prev]);
        setIsNotifOpen(true);
    };

    /**
     * OPTIMIZATION: Instant Render Logic
     * We show the LoadingOverlay if Privy is not ready, auth is being checked, or we are logging out.
     */
    if (!ready || isLoggingOut) {
        return <LoadingOverlay />;
    }

    if (authenticated) {
        return (
            <div className="min-h-screen bg-[#030305] text-foreground animate-in fade-in duration-500 flex flex-col md:flex-row">
                {/* Mobile Header with Hamburger */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#030305] sticky top-0 z-50">
                    <div className="flex items-center gap-3">
                        <img src="/icons/SubGuard.png" alt="SubGuard" className="w-7 h-7" />
                        <span className="font-bold text-lg tracking-tighter">SUBGUARD</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground/40 transition-colors relative"
                        >
                            <Bell className="w-5 h-5" />
                            {notifications.length > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
                            )}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground/60 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                )}

                {/* Sidebar Navigation - Slide-in on mobile, fixed on desktop */}
                <aside className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#030305] p-6 flex flex-col gap-8 transition-transform duration-300 lg:translate-x-0 lg:min-h-screen",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 px-2">
                            <img src="/icons/SubGuard.png" alt="SubGuard" className="w-8 h-8" />
                            <span className="font-bold text-xl tracking-tighter">SUBGUARD</span>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-white/5"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-2 flex-grow">
                        <NavButton
                            active={activeTab === 'dashboard'}
                            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                            icon={<Cpu className="w-4 h-4" />}
                            label="Dashboard"
                        />
                        <NavButton
                            active={activeTab === 'subscriptions'}
                            onClick={() => { setActiveTab('subscriptions'); setIsMobileMenuOpen(false); }}
                            icon={<Zap className="w-4 h-4" />}
                            label="Subscriptions"
                        />
                        <NavButton
                            active={activeTab === 'cards'}
                            onClick={() => { setActiveTab('cards'); setIsMobileMenuOpen(false); }}
                            icon={<CreditCard className="w-4 h-4" />}
                            label="Virtual Cards"
                        />
                        <NavButton
                            active={activeTab === 'transactions'}
                            onClick={() => { setActiveTab('transactions'); setIsMobileMenuOpen(false); }}
                            icon={<Activity className="w-4 h-4" />}
                            label="Transactions"
                        />
                        <NavButton
                            active={activeTab === 'settings'}
                            onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
                            icon={<Settings className="w-4 h-4" />}
                            label="Settings"
                        />
                    </nav>

                    <div className="pt-6 border-t border-white/5 space-y-4">
                        <div className="px-2">
                            <p className="text-[10px] font-black tracking-[0.3em] text-foreground/20 uppercase mb-4">Account</p>
                            <div className="space-y-2">
                                <button
                                    onClick={() => { setIsWalletOpen(true); setIsMobileMenuOpen(false); }}
                                    className="w-full flex items-center justify-between group"
                                >
                                    <div className="flex flex-col items-start gap-0.5">
                                        <span className="text-xs font-bold text-foreground/80 group-hover:text-primary transition-colors">View Account</span>
                                        <span className="text-[10px] font-mono text-foreground/30 truncate w-32 text-left">
                                            {circleWallet?.address ? `${circleWallet.address.slice(0, 6)}...${circleWallet.address.slice(-4)}` : '0x...'}
                                        </span>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                        <ArrowUpRight className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                                    </div>
                                </button>

                                {/* Mobile Sign Out Button */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-between group p-2 rounded-xl border border-white/5 bg-white/5 lg:hidden"
                                >
                                    <span className="text-xs font-bold text-foreground/60 group-hover:text-red-500 transition-colors">Sign Out</span>
                                    <Power className="w-4 h-4 text-foreground/20 group-hover:text-red-500 transition-colors" />
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex-grow flex flex-col min-h-screen overflow-hidden">
                    {/* Internal Dashboard Header - hidden on mobile/tablet */}
                    <div className="hidden lg:flex items-center justify-between px-6 lg:px-8 py-4 lg:py-6 border-b border-white/5">
                        <div className="flex items-center gap-3 text-xs font-medium tracking-tight">
                            <span className="text-foreground/30 capitalize">{activeTab}</span>
                            <span className="text-foreground/10">/</span>
                            <span className="text-foreground/80 font-bold">Master View</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#22c55e]" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Arc L1 Active</span>
                            </div>
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/40 transition-colors relative"
                            >
                                <Bell className="w-5 h-5" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary border-2 border-[#030305]" />
                                )}
                            </button>
                            <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary">SG</div>
                                <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">SubGuard Admin</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 text-red-500/60 transition-colors"
                                title="Sign Out"
                            >
                                <Power className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow flex overflow-hidden">
                        {/* Content Area */}
                        <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
                            {activeTab === 'dashboard' && <DashboardOverview onOpenWallet={() => setIsWalletOpen(true)} balance={balance} onRefresh={fetchCircleWallet} />}
                            {activeTab === 'subscriptions' && <SubscriptionList subs={subs} toggleSub={toggleSub} onUnsubscribe={handleUnsubscribe} />}
                            {activeTab === 'cards' && (
                                showTierSelection ? (
                                    <TierSelection
                                        currentTier={currentTier.id}
                                        onSelect={(tier) => {
                                            setCurrentTier({ id: tier.id as any, name: tier.name, maxCards: tier.maxCards });
                                            setShowTierSelection(false);
                                        }}
                                        onClose={() => setShowTierSelection(false)}
                                    />
                                ) : (
                                    <CardsManager
                                        currentTier={currentTier}
                                        userCards={userCards}
                                        onGenerateCard={() => setIsFlowOpen(true)}
                                        onUpgrade={() => setShowTierSelection(true)}
                                        onUpdateCard={handleUpdateCard}
                                        initialSelectedCard={cardToView}
                                        onCloseDetails={() => setCardToView(null)}
                                    />
                                )
                            )}
                            {activeTab === 'transactions' && <TransactionHistory transactions={MOCK_TRANSACTIONS} />}
                            {activeTab === 'settings' && <SettingsView />}
                        </main>

                        {/* Right Sidebar - Transmissions (hidden on mobile/tablet) */}
                        {activeTab === 'dashboard' && (
                            <div className="hidden lg:block">
                                <Transmissions />
                            </div>
                        )}
                    </div>
                </div>

                <WalletPopup
                    isOpen={isWalletOpen}
                    onClose={() => setIsWalletOpen(false)}
                    address={circleWallet?.address || '0x...'}
                    userId={user?.id}
                    balance={balance}
                />

                {isFlowOpen && (
                    <VirtualShieldFlow
                        slotIndex={userCards.length}
                        totalSlots={currentTier.maxCards}
                        onComplete={(card) => {
                            setUserCards(prev => [...prev, card]);
                            setCardSuccess(card);
                            setIsFlowOpen(false);
                        }}
                        onCancel={() => setIsFlowOpen(false)}
                    />
                )}

                {cardSuccess && (
                    <CardSuccess
                        cardData={cardSuccess}
                        onClose={() => setCardSuccess(null)}
                        onViewDetails={() => {
                            setCardToView(cardSuccess);
                            setActiveTab('cards');
                            setCardSuccess(null);
                        }}
                    />
                )}

                {/* Notification Panel Overlay */}
                {isNotifOpen && (
                    <div className="fixed inset-0 z-[100] flex justify-end p-6 pointer-events-none">
                        <div className="absolute inset-0 bg-transparent pointer-events-auto" onClick={() => setIsNotifOpen(false)} />
                        <div className="relative w-[360px] h-fit max-h-[500px] glass-card bg-[#0a0a0c] border-white/10 shadow-3xl pointer-events-auto animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Notifications</h3>
                                <button onClick={() => setIsNotifOpen(false)} className="text-foreground/20 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex-grow overflow-y-auto p-4 space-y-3">
                                {notifications.length === 0 ? (
                                    <div className="py-20 text-center space-y-4">
                                        <Bell className="w-8 h-8 text-foreground/5 mx-auto" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20">No new alerts</p>
                                    </div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-primary">{n.type}</span>
                                                <span className="text-[8px] font-mono text-foreground/20">{n.time}</span>
                                            </div>
                                            <h4 className="text-[11px] font-bold text-white">{n.title}</h4>
                                            <p className="text-[9px] text-foreground/40 leading-relaxed">{n.description}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Default: Landing Page (Renders immediately while ready is false)
    return (
        <div className="min-h-screen flex flex-col pt-0 bg-[#030305]">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030305]/80 backdrop-blur-md">
                <div className="max-w-[1400px] mx-auto px-10 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/icons/SubGuard.png" alt="SubGuard" className="w-10 h-10 object-contain" />
                        <span className="font-bold text-xl tracking-tighter">SUBGUARD</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink href="#">SECURITY</NavLink>
                        <a href="https://testnet.arcscan.app/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-white transition-colors">
                            Arc Testnet
                        </a>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/20 cursor-not-allowed flex items-center gap-1">
                            Docs <span className="text-[10px] bg-white/5 px-1 py-0.5 rounded opacity-50">Soon</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={login} className="text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-white transition-colors">LOGIN</button>
                        <button onClick={login} className="btn-primary text-[10px] tracking-[0.2em] px-6 py-2.5">SIGN UP</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-8 px-6">
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000 md:-ml-12">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">LIVE ON ARC TESTNET</span>
                        </div>
                        <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight leading-[0.95]">
                            <span className="text-white">Your USDC Treasury,</span> <br />
                            <span className="text-primary italic">Autonomously Guarded.</span>
                        </h1>
                        <p className="text-base text-foreground/50 max-w-lg leading-relaxed">
                            Protect your assets from unwanted recurring charges. The first AI-powerd subscription gatekeeper built on Arc L1 architecture.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button onClick={login} className="btn-primary px-10 py-4 uppercase">Secure Your Assets</button>
                            <button className="btn-secondary px-10 py-4 uppercase opacity-50 cursor-not-allowed flex items-center gap-2" disabled>
                                View Documentation
                                <span className="text-[8px] bg-primary text-black px-1.5 py-0.5 rounded font-black tracking-widest">SOON</span>
                            </button>
                        </div>

                        {/* Hero Stats */}
                        <div className="pt-8 flex items-center gap-12 border-t border-white/5">
                            <div className="space-y-1">
                                <p className="text-2xl font-medium tracking-tighter text-foreground/70">99.9%</p>
                                <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">AI Accuracy</p>
                            </div>
                            <div className="w-px h-8 bg-white/5" />
                            <div className="space-y-1">
                                <p className="text-2xl font-medium tracking-tighter text-foreground/70">$100K</p>
                                <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">Capital Protected</p>
                            </div>
                            <div className="w-px h-8 bg-white/5" />
                            <div className="space-y-1">
                                <p className="text-2xl font-medium tracking-tighter text-foreground/70">4ms</p>
                                <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">Defense Latency</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[720px] flex items-center justify-center animate-in fade-in slide-in-from-right duration-1000">
                        {/* Floating Cards Composition */}
                        <div className="relative w-full h-full">
                            {/* Netflix Card */}
                            <div className="absolute top-[35%] left-[0%] z-20 animate-float shadow-2xl scale-[0.75]">
                                <div className="glass-card bg-[#0a0a0c]/90 border-white/10 p-4 w-64">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden shrink-0">
                                            <img src="/icons/Netflix.png" alt="Netflix" className="w-10 h-10 object-contain" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <p className="font-bold text-sm tracking-tight whitespace-nowrap">NETFLIX STANDARD</p>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                                    <span className="text-[7px] font-black text-primary uppercase tracking-widest">Safe</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Frequency</span>
                                                <span className="text-[10px] text-foreground/60 font-bold uppercase tracking-widest text-primary/60">Monthly</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Disney+ Card */}
                            <div className="absolute top-[10%] right-[5%] z-10 animate-float-delayed shadow-2xl opacity-60 scale-[0.75]">
                                <div className="glass-card bg-[#0a0a0c]/80 border-white/5 p-3 w-48 space-y-2 opacity-60">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden">
                                            <img src="/icons/Disney.png" alt="Disney+" className="w-7 h-7 object-contain" />
                                        </div>
                                        <p className="font-bold text-xs uppercase tracking-tight">DISNEY+</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] text-foreground/30 font-bold uppercase tracking-widest italic">Status: Verifying...</span>
                                        <RotateCcw className="w-3 h-3 text-primary animate-spin-slow" />
                                    </div>
                                </div>
                            </div>

                            {/* SubAgent Card (New) */}
                            <div className="absolute top-[50%] right-[0%] z-20 animate-float shadow-2xl scale-[0.85]">
                                <div className="glass-card bg-[#0a0a0c]/90 border-white/10 p-4 w-60 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <img src="/icons/SubGuard.png" alt="SubAgent" className="w-6 h-6 object-contain" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs uppercase tracking-tight">SUBAGENT</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                <span className="text-[9px] text-primary/60 font-black uppercase tracking-widest">24/7 Monitoring</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Unknown SaaS Card (Blocked) */}
                            <div className="absolute bottom-[15%] right-[0%] z-20 animate-float shadow-2xl rotate-3 scale-[0.85]">
                                <div className="glass-card bg-red-500/5 border-red-500/20 p-6 w-72 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                            <Globe className="w-6 h-6 text-foreground/20" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-foreground/40">UNKNOWN SAAS</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                                    <XCircle className="w-3 h-3 text-red-500" />
                                                </div>
                                                <span className="text-[10px] text-red-500 font-black uppercase tracking-[0.15em]">Blocked by ai</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Hub Image / Icon */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center blur-sm opacity-50" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] border border-white/5 rounded-[40px] bg-[#050507] shadow-inner flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-20" />
                                <Lock className="w-24 h-24 text-primary/30" />
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-primary shadow-[0_0_40px_rgba(34,197,94,0.6)] animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner Ticker */}
            <div className="border-y border-white/10 bg-white/[0.01] py-14 overflow-hidden">
                <div className="w-full px-6 flex items-center gap-20">
                    <div className="flex items-center gap-12 shrink-0 ml-4 md:ml-12 lg:ml-20">
                        <span className="text-[11px] font-black tracking-[0.7em] text-foreground/30 uppercase whitespace-nowrap">POWERED BY</span>
                        <div className="w-px h-10 bg-white/10" />
                    </div>

                    <div className="relative flex-grow overflow-hidden">
                        {/* Fading Masks */}
                        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#030305] to-transparent z-10" />
                        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#030305] to-transparent z-10" />

                        <div className="flex gap-40 w-max partner-ticker-animation items-center py-4">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex items-center gap-40 brightness-[1.1]">
                                    <img src="/icons/Stripe.png" alt="Stripe" className="h-10 w-auto object-contain" />
                                    <img src="/icons/Circle.png" alt="Circle" className="h-11 w-auto object-contain contrast-110 saturate-125" />
                                    <img src="/icons/Privy.png" alt="Privy" className="h-9 w-auto object-contain [filter:brightness(0)_invert(1)]" />
                                    <img src="/icons/Gemini.png" alt="Gemini" className="h-11 w-auto object-contain" />
                                    <img src="/icons/Arc.png" alt="Arc" className="h-10 w-auto object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Mitigation */}
            <section className="section-container">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">Advanced Mitigation.</h2>
                    <p className="text-foreground/40 max-w-lg">SubGuard implements zero-trust logic at the wallet level, ensuring every transaction aligns with protocol parameters.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 rounded-[32px] overflow-hidden">
                    <MitigationCard
                        icon={<Globe className="w-6 h-6 text-primary" />}
                        title="AI-Driven Logic"
                        description="Powered by Gemini 3 Flash, we scan for value-deterioration and predatory billing cycles before execution."
                    />
                    <MitigationCard
                        icon={<Layers className="w-6 h-6 text-primary" />}
                        title="Virtual Shielding"
                        description="Utilizing Stripe Issuing to create non-custodial virtual assets for specific SaaS tools and DAO operations."
                    />
                    <MitigationCard
                        icon={<Zap className="w-6 h-6 text-primary" />}
                        title="Arc L1 Settlement"
                        description="High-frequency settlement on the Arc L1 blockchain for fully compliant USDC treasury management."
                    />
                </div>
            </section>

            {/* Full-Stack Visibility */}
            <section className="section-container grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                    <h2 className="text-5xl font-bold leading-tight">Full-Stack <br /><span className="text-primary italic">Visibility.</span></h2>
                    <p className="text-foreground/40 leading-relaxed">
                        Monitor every recurring expense with granular precision. Block, capture, or limit any vendor with a single cryptographic signature.
                    </p>
                    <div className="space-y-4">
                        <VisibilityCheck>REAL-TIME CLASSIFICATION</VisibilityCheck>
                        <VisibilityCheck>PREDICTIVE RISK SCORING</VisibilityCheck>
                        <VisibilityCheck>MERCHANT-SPECIFIC LIMITS</VisibilityCheck>
                    </div>
                </div>
                <div className="glass-card p-0 border-white/10 bg-[#0a0a0c] shadow-2xl">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                        </div>
                        <span className="text-[10px] text-primary font-bold tracking-widest uppercase">Security Engine Active</span>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-4 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] pb-4">
                            <span>Subscription</span>
                            <span>Category</span>
                            <span className="text-right">Amt (Monthly)</span>
                            <span className="text-right">Action</span>
                        </div>
                        <VisibilityItem
                            name="Netflix Premium"
                            category="Personal"
                            amount="$15.99"
                            status="Guarded"
                            icon={<img src="/icons/Netflix.png" alt="Netflix" className="w-5 h-5 object-contain" />}
                        />
                        <VisibilityItem
                            name="OpenAI Engine"
                            category="Developer"
                            amount="$124.20"
                            status="Guarded"
                            icon={<img src="/icons/OpenAi.png" alt="OpenAI" className="w-5 h-5 object-contain" />}
                        />
                        <VisibilityItem
                            name="Claude Enterprise"
                            category="Developer"
                            amount="$1,400.00"
                            status="Blocked"
                            icon={<img src="/icons/Claude.png" alt="Claude" className="w-5 h-5 object-contain" />}
                        />
                    </div>
                </div>
            </section>

            {/* Animated Flow Diagram: Cyber Grid */}
            <FlowDiagram />

            {/* CTA Banner */}

            {/* CTA Banner */}
            <section className="px-6 py-20">
                <div className="max-w-[1100px] mx-auto rounded-[40px] bg-primary p-20 text-center space-y-8 shadow-[0_20px_50px_rgba(34,197,94,0.2)]">
                    <h2 className="text-4xl md:text-6xl font-bold text-black leading-tight tracking-tight">Secure Your Operations.</h2>
                    <p className="text-black/70 max-w-xl mx-auto font-medium text-lg">The standard for DAO treasury management and high-net-worth individual security on the Arc Network.</p>
                    <div className="flex flex-wrap justify-center gap-6 pt-10">
                        <button onClick={login} className="bg-black text-white px-12 py-5 uppercase font-black text-xs tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-2xl">Get Started Now</button>
                        <button className="border-2 border-black/20 text-black/60 px-12 py-5 uppercase font-black text-xs tracking-[0.2em] rounded-xl opacity-50 cursor-not-allowed" disabled>Enterprise Demo</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="pt-24 pb-12 px-6 relative border-t border-white/5">
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-16">
                    <div className="md:col-span-3 space-y-6 md:-ml-16">
                        <div className="flex items-center gap-2">
                            <img src="/icons/SubGuard.png" alt="SubGuard" className="w-10 h-10 object-contain" />
                            <span className="font-bold text-2xl tracking-tighter text-foreground/60">SUBGUARD</span>
                        </div>
                        <p className="text-sm text-foreground/40 leading-relaxed font-medium">
                            Base level guard protocols for institutions moving through the autonomous AI-driven asset protection.
                        </p>
                    </div>

                    <div className="md:col-span-2 md:col-start-5">
                        <h4 className="font-bold mb-6 text-sm tracking-widest text-foreground/30 uppercase">PRODUCT'S</h4>
                        <div className="space-y-4 text-sm font-bold opacity-60">
                            <p className="hover:text-primary cursor-pointer transition-colors">Subscription Tracker</p>
                            <p className="hover:text-primary cursor-pointer transition-colors">Shield Cards (virtual)</p>
                            <p className="hover:text-primary cursor-pointer transition-colors">AI Transaction Guard</p>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-bold mb-6 text-sm tracking-widest text-foreground/30 uppercase">ASSETS</h4>
                        <div className="space-y-4 text-sm font-bold opacity-60">
                            <p className="hover:text-primary cursor-pointer transition-colors">USDC on Arc</p>
                            <p className="hover:text-primary cursor-pointer transition-colors">Unified balances</p>
                            <p className="hover:text-primary cursor-pointer transition-colors">More assets soon</p>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-bold mb-6 text-sm tracking-widest text-foreground/30 uppercase">NETWORK</h4>
                        <div className="space-y-4 text-sm font-bold opacity-60">
                            <p className="hover:text-primary cursor-pointer transition-colors">Arc Testnet</p>
                            <p className="hover:text-primary cursor-pointer transition-colors">More chains soon</p>
                        </div>
                    </div>

                    <div className="md:col-span-2 md:-mr-16">
                        <h4 className="font-bold mb-6 text-sm tracking-widest text-foreground/30 uppercase">DOCUMENTATION</h4>
                        <div className="space-y-4 text-sm font-bold opacity-60">
                            <p className="hover:text-primary cursor-not-allowed transition-colors flex items-center gap-1">
                                Subguard <span className="text-[10px] bg-white/5 px-1 py-0.5 rounded opacity-50">Soon</span>
                            </p>
                            <a href="https://developers.circle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary cursor-pointer transition-colors block">Circle</a>
                            <a href="https://docs.arc.network/arc/concepts/welcome-to-arc" target="_blank" rel="noopener noreferrer" className="hover:text-primary cursor-pointer transition-colors block">Arc</a>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1100px] mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-xs text-foreground/20 font-bold uppercase tracking-widest md:-ml-16">
                        © 2026 SUBGUARD · ALL RIGHTS RESERVED
                    </p>
                    <div className="flex items-center gap-6 md:-mr-16">
                        <a href="https://github.com/lee785/SubGuard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group cursor-pointer transition-colors">
                            <Github className="w-5 h-5 text-foreground/20 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest group-hover:text-white transition-colors">GitHub</span>
                        </a>
                        <div className="flex items-center gap-2 group cursor-not-allowed">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-foreground/20 group-hover:text-white transition-colors fill-current">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 11.756 11.756 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                            <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">Discord <span className="text-[10px] ml-1 bg-white/5 px-1 py-0.5 rounded opacity-50">Soon</span></span>
                        </div>
                        <a href="https://x.com/heyeren_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group cursor-pointer transition-colors">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-foreground/20 group-hover:text-white transition-colors fill-current">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest group-hover:text-white transition-colors">Twitter</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-white transition-colors">
            {children}
        </a>
    );
}

function MitigationCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-8 space-y-4 bg-white/[0.01] border-r border-white/10 last:border-r-0 hover:bg-white/[0.03] transition-colors group">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-foreground/40 leading-relaxed text-xs">{description}</p>
        </div>
    );
}

function VisibilityCheck({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-foreground/60">
            <div className="w-5 h-5 rounded bg-primary/20 border border-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            </div>
            {children}
        </div>
    );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-bold",
                active
                    ? "bg-primary text-black shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                    : "text-foreground/40 hover:text-white hover:bg-white/[0.03]"
            )}
        >
            <div className={cn(
                "transition-colors",
                active ? "text-black" : "text-foreground/20 group-hover:text-primary"
            )}>
                {icon}
            </div>
            <span className="tracking-tight">{label}</span>
        </button>
    );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="glass-card p-8 flex items-center justify-between group bg-white/[0.01] border-white/5">
            <div>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40 mb-2">{title}</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-black font-mono tracking-tighter text-white">{value}</p>
                    <span className="text-[10px] opacity-20 font-bold uppercase tracking-widest">USDC</span>
                </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </div>
    );
}

function VisibilityItem({ name, category, amount, status, icon }: { name: string; category: string; amount: string; status: string; icon?: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center text-xs font-bold py-3 group border-b border-white/[0.02] last:border-0 hover:bg-white/[0.01] transition-colors rounded-lg px-2 -mx-2">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                    {icon}
                </div>
                <span className="text-white whitespace-nowrap">{name}</span>
            </div>
            <span className="text-foreground/30 uppercase tracking-tighter pl-4">{category}</span>
            <span className="text-right font-mono">{amount}</span>
            <div className="flex justify-end">
                <span className={cn(
                    "text-[8px] font-black px-2 py-0.5 rounded uppercase",
                    status === 'Guarded' ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'
                )}>{status}</span>
            </div>
        </div>
    );
}

function Step({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-foreground/60">
            <div className="w-5 h-5 rounded bg-primary/20 border border-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            </div>
            {children}
        </div>
    );
}

function LoadingOverlay() {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#030305] flex items-center justify-center animate-in fade-in duration-500">
            <div className="relative flex flex-col items-center gap-8">
                {/* Glowing Aura */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-[60px] animate-pulse" />

                {/* Logo Container */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <img
                        src="/icons/SubGuard.png"
                        alt="SubGuard"
                        className="w-20 h-20 object-contain animate-pulse relative z-10"
                    />

                    {/* Ring Path Animation (Visual flair) */}
                    <div className="absolute inset-0 border-2 border-primary/10 rounded-full animate-spin-slow" />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">
                        Synchronizing
                    </span>
                    <span className="text-[8px] font-bold text-foreground/20 uppercase tracking-[0.3em]">
                        Arc L1 Security Layer
                    </span>
                </div>
            </div>
        </div>
    );
}
