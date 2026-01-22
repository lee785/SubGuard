import { NextResponse } from 'next/server';
import { getWalletBalance, getUserWallet } from '@/lib/circle/circle_wallet';
import { authenticateRequest } from '@/lib/auth/privy-server';
import { checkRateLimit } from '@/lib/ratelimit/simple-limiter';

/**
 * GET /api/wallet/balance
 * Returns the authenticated user's USDC balance from Circle SDK (Arc Testnet)
 */
export async function GET(req: Request) {
    try {
        // Rate limiting
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        if (!checkRateLimit(`balance_${ip}`)) {
            return NextResponse.json(
                { success: false, error: 'Too many requests. Please try again later.', balance: '0' },
                { status: 429 }
            );
        }

        // Authentication
        const userId = await authenticateRequest(req);
        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please sign in.', balance: '0' },
                { status: 401 }
            );
        }

        // Get user's wallet from local DB
        const wallet = getUserWallet(userId);

        if (!wallet) {
            return NextResponse.json(
                { success: false, error: 'Wallet not found.', balance: '0' },
                { status: 404 }
            );
        }

        // Get balance using local Circle SDK
        const balanceData = await getWalletBalance(wallet.walletId);

        return NextResponse.json({
            success: true,
            balance: balanceData.balance,
            currency: 'USDC'
        });

    } catch (error: any) {
        // Log full error server-side
        console.error('[API] Balance fetch failed:', error);

        // Return generic error message to client
        return NextResponse.json(
            { success: false, error: 'Failed to fetch balance. Please try again.', balance: '0' },
            { status: 500 }
        );
    }
}
