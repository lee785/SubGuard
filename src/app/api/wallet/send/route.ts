import { NextResponse } from 'next/server';
import { transferUSDC } from '@/lib/circle/circle_wallet';
import { getWalletByUserId } from '@/lib/db/user_wallets';

/**
 * POST /api/wallet/send
 * Body: { userId, toAddress, amount }
 * Sends USDC from user's wallet to another address
 */
export async function POST(req: Request) {
    try {
        const { userId, toAddress, amount } = await req.json();

        if (!userId || !toAddress || !amount) {
            return NextResponse.json(
                { success: false, error: 'userId, toAddress, and amount are required' },
                { status: 400 }
            );
        }

        // Get user's wallet
        const wallet = getWalletByUserId(userId);
        if (!wallet) {
            return NextResponse.json(
                { success: false, error: 'No wallet found for this user' },
                { status: 404 }
            );
        }

        console.log(`[API] Sending ${amount} USDC from ${wallet.address} to ${toAddress}`);

        // Execute transfer
        const result = await transferUSDC(wallet.walletId, toAddress, amount);

        return NextResponse.json({
            success: result.success,
            transactionId: result.transactionId,
            status: result.status,
            isMock: result.isMock || false
        });

    } catch (error: any) {
        console.error('[API] Send failed:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
