import { NextResponse } from 'next/server';
import { initializeUserWallet } from '@/lib/circle/circle_wallet';
import { createCardholder, createVirtualCard } from '@/lib/stripe/stripe_issuing';

/**
 * POST /api/onboard
 * Body: { userId: string, email: string, name: string }
 */
export async function POST(req: Request) {
    try {
        const { userId, email, name } = await req.json();

        console.log(`🚀 Onboarding user: ${email} (${userId})`);

        // 1. Create Circle Managed Wallet on Arc
        const wallet = await initializeUserWallet(userId);
        console.log(`✅ Circle Wallet created: ${wallet.id}`);

        // 2. Create Stripe Cardholder
        const cardholder = await createCardholder(name, email);
        console.log(`✅ Stripe Cardholder created: ${cardholder.id}`);

        // 3. Create Virtual Card
        const card = await createVirtualCard(cardholder.id);
        console.log(`✅ Virtual Card created: ${card.id}`);

        return NextResponse.json({
            success: true,
            walletAddress: wallet.address,
            walletId: wallet.id,
            cardId: card.id,
            cardLast4: card.last4,
        });

    } catch (error: any) {
        console.error('Onboarding failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
