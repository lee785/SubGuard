import { NextResponse } from 'next/server';
import { getWalletByUserId, updateUserTier, getUserTier } from '@/lib/db/user_wallets';
import { getWalletBalance, transferUSDC } from '@/lib/circle/circle_wallet';
import { authenticateRequest } from '@/lib/auth/privy-server';
import { checkRateLimit } from '@/lib/ratelimit/simple-limiter';
import { tierUpgradeSchema } from '@/lib/validation/schemas';
import { z } from 'zod';

// Admin wallet - validated at startup
const SUBGUARD_ADMIN_WALLET = process.env.SUBGUARD_ADMIN_WALLET;

if (!SUBGUARD_ADMIN_WALLET) {
    throw new Error('SUBGUARD_ADMIN_WALLET environment variable is not configured');
}

// Tier pricing in USDC
const TIER_PRICES: Record<string, number> = {
    'free': 0,
    'tier1': 20,
    'tier2': 40
};

/**
 * POST /api/tier/upgrade
 * Body: { tierId }
 * 
 * Upgrades the authenticated user's tier after verifying balance and processing payment.
 */
export async function POST(req: Request) {
    try {
        // Rate limiting
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        if (!checkRateLimit(`tier_${ip}`)) {
            return NextResponse.json(
                { success: false, error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Authentication
        const userId = await authenticateRequest(req);
        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            );
        }

        // Parse and validate input
        const body = await req.json();
        const validated = tierUpgradeSchema.parse(body);
        const tierId = validated.tierId;

        const tierPrice = TIER_PRICES[tierId];
        if (tierPrice === undefined) {
            return NextResponse.json(
                { success: false, error: 'Invalid tier ID' },
                { status: 400 }
            );
        }

        // Get user's wallet
        const wallet = getWalletByUserId(userId);
        if (!wallet) {
            return NextResponse.json(
                { success: false, error: 'No wallet found. Please sign in again.' },
                { status: 404 }
            );
        }

        // Free tier - no payment needed
        if (tierPrice === 0) {
            updateUserTier(userId, tierId);
            return NextResponse.json({
                success: true,
                tier: tierId,
                message: 'Free tier activated!'
            });
        }

        // Check user's balance
        const balanceResult = await getWalletBalance(wallet.walletId);
        const userBalance = parseFloat(balanceResult.balance);

        console.log(`[Tier Upgrade] User ${userId} balance: ${userBalance} USDC, tier price: ${tierPrice} USDC`);

        if (userBalance < tierPrice) {
            return NextResponse.json({
                success: false,
                error: `Insufficient balance. You need ${tierPrice} USDC but have ${userBalance.toFixed(2)} USDC.`,
                requiredBalance: tierPrice,
                currentBalance: userBalance
            }, { status: 400 });
        }

        // Process payment to SubGuard admin wallet
        console.log(`[Tier Upgrade] Transferring ${tierPrice} USDC to admin wallet...`);

        const transferResult = await transferUSDC(
            wallet.walletId,
            SUBGUARD_ADMIN_WALLET!,
            tierPrice.toString()
        );

        if (!transferResult.success) {
            return NextResponse.json({
                success: false,
                error: 'Payment transfer failed. Please try again.'
            }, { status: 500 });
        }

        // Update user's tier
        updateUserTier(userId, tierId);

        console.log(`[Tier Upgrade] ✅ User ${userId} upgraded to ${tierId}`);

        return NextResponse.json({
            success: true,
            tier: tierId,
            transactionId: transferResult.transactionId,
            message: `Successfully upgraded to ${tierId === 'tier1' ? 'Tier 2' : 'Tier 3'}!`
        });

    } catch (error: any) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: error.errors[0].message },
                { status: 400 }
            );
        }

        // Log full error server-side
        console.error('[Tier Upgrade] Error:', error);

        // Return generic error message to client
        return NextResponse.json(
            { success: false, error: 'Tier upgrade failed. Please try again.' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/tier/upgrade
 * Returns the authenticated user's current tier
 */
export async function GET(req: Request) {
    try {
        // Rate limiting
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        if (!checkRateLimit(`tier_get_${ip}`)) {
            return NextResponse.json(
                { success: false, error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Authentication
        const userId = await authenticateRequest(req);
        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            );
        }

        const tier = getUserTier(userId);

        return NextResponse.json({
            success: true,
            tier: tier || 'free'
        });

    } catch (error: any) {
        // Log full error server-side
        console.error('[Tier GET] Error:', error);

        // Return generic error message to client
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tier. Please try again.' },
            { status: 500 }
        );
    }
}
