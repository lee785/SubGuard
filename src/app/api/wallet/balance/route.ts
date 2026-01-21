import { NextResponse } from 'next/server';
import { getWalletBalance } from '@/lib/circle/circle_wallet';
import { getWalletByUserId } from '@/lib/db/user_wallets';

/**
 * GET /api/wallet/balance?userId=xxx
 * Returns the USDC balance for a user's wallet
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const walletId = searchParams.get('walletId');

        if (!userId && !walletId) {
            return NextResponse.json(
                { success: false, error: 'userId or walletId is required' },
                { status: 400 }
            );
        }

        let targetWalletId = walletId;

        // If userId provided, lookup the wallet
        if (userId && !walletId) {
            const wallet = getWalletByUserId(userId);
            if (!wallet) {
                return NextResponse.json(
                    { success: false, error: 'No wallet found for this user' },
                    { status: 404 }
                );
            }
            targetWalletId = wallet.walletId;
        }

        const balance = await getWalletBalance(targetWalletId!);

        return NextResponse.json({
            success: true,
            balance: balance.balance,
            currency: balance.currency,
            isMock: balance.isMock || false
        });

    } catch (error: any) {
        console.error('[API] Balance fetch failed:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
