import { NextResponse } from 'next/server';
import { getUserWallet, initializeUserWallet } from '@/lib/circle/circle_wallet';

/**
 * GET /api/wallet?userId=xxx
 * Returns the user's Circle wallet info
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'userId is required' },
                { status: 400 }
            );
        }

        // Check if wallet exists
        let wallet = getUserWallet(userId);

        // If not, create one
        if (!wallet) {
            const newWallet = await initializeUserWallet(userId);
            wallet = {
                walletId: newWallet.id!,
                address: newWallet.address!,
                blockchain: newWallet.blockchain!,
                createdAt: new Date().toISOString()
            };
        }

        return NextResponse.json({
            success: true,
            wallet: {
                id: wallet.walletId,
                address: wallet.address,
                blockchain: wallet.blockchain
            }
        });

    } catch (error: any) {
        console.error('[API] Wallet fetch failed:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
