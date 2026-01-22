import { NextResponse } from 'next/server';
import { getUserWallet, initializeUserWallet } from '@/lib/circle/circle_wallet';
import { authenticateRequest } from '@/lib/auth/privy-server';
import { checkRateLimit } from '@/lib/ratelimit/simple-limiter';

/**
 * GET /api/wallet?userId=xxx
 * Returns the user's Circle wallet info
 * Protected by Privy authentication and IDOR check
 */
export async function GET(req: Request) {
    try {
        // 1. Rate limiting
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        if (!checkRateLimit(`wallet_fetch_${ip}`)) {
            return NextResponse.json(
                { success: false, error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // 2. Authentication
        const authenticatedUserId = await authenticateRequest(req);
        if (!authenticatedUserId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const requestedUserId = searchParams.get('userId');

        if (!requestedUserId) {
            return NextResponse.json(
                { success: false, error: 'userId is required' },
                { status: 400 }
            );
        }

        // 3. IDOR Protection: Ensure user only fetches their own wallet
        if (authenticatedUserId !== requestedUserId) {
            console.warn(`[Security] IDOR attempt by ${authenticatedUserId} on ${requestedUserId}`);
            return NextResponse.json(
                { success: false, error: 'Forbidden. You can only access your own wallet.' },
                { status: 403 }
            );
        }

        // Check if wallet exists
        let wallet = getUserWallet(requestedUserId);

        // If not, create one
        if (!wallet) {
            const newWallet = await initializeUserWallet(requestedUserId);
            wallet = {
                walletId: newWallet.id!,
                address: newWallet.address!,
                blockchain: newWallet.blockchain!,
                createdAt: new Date().toISOString(),
                tier: 'free' // Default tier for new wallets
            };
        }

        return NextResponse.json({
            success: true,
            wallet: {
                id: wallet.walletId,
                address: wallet.address,
                blockchain: wallet.blockchain,
                tier: wallet.tier
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
