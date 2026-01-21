import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://subguard-api.fly.dev';

/**
 * POST /api/onboard
 * Body: { userId: string, email: string, name: string }
 * 
 * This route proxies to the fly.io backend which handles Circle SDK operations.
 */
export async function POST(req: Request) {
    try {
        const { userId, email, name } = await req.json();

        console.log(`🚀 Onboarding user: ${email} (${userId})`);

        // Call the fly.io backend to create Circle wallet
        const walletResponse = await fetch(`${API_URL}/api/wallet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });

        const walletData = await walletResponse.json();

        if (!walletResponse.ok || !walletData.success) {
            console.error('❌ Wallet creation failed:', walletData.error);
            return NextResponse.json({
                success: false,
                error: walletData.error || 'Wallet creation failed'
            }, { status: 500 });
        }

        console.log(`✅ Circle Wallet created: ${walletData.walletId} (${walletData.address})`);

        // Return wallet details - Stripe card creation is optional/mock
        return NextResponse.json({
            success: true,
            walletAddress: walletData.address,
            walletId: walletData.walletId,
            cardId: `card_mock_${Date.now()}`,
            cardLast4: '4242',
        });

    } catch (error: any) {
        console.error('Onboarding failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
