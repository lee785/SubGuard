import { NextResponse } from 'next/server';
import { getWalletByUserId, updateUserTier, getUserTier } from '@/lib/db/user_wallets';
import { getWalletBalance, transferUSDC } from '@/lib/circle/circle_wallet';

const SUBGUARD_ADMIN_WALLET = process.env.SUBGUARD_ADMIN_WALLET || '0xCD4c2FCB8af53d5DCcC95eD0230985431E3D2289';

// Tier pricing in USDC
const TIER_PRICES: Record<string, number> = {
    'free': 0,
    'tier1': 20,
    'tier2': 40
};

/**
 * POST /api/tier/upgrade
 * Body: { userId, tierId }
 * 
 * Upgrades a user's tier after verifying balance and processing payment.
 */
export async function POST(req: Request) {
    try {
        const { userId, tierId } = await req.json();

        if (!userId || !tierId) {
            return NextResponse.json(
                { success: false, error: 'userId and tierId are required' },
                { status: 400 }
            );
        }

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
                { success: false, error: 'No wallet found for this user. Please sign in again.' },
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
                error: `Not enough balance. You need ${tierPrice} USDC but have ${userBalance.toFixed(2)} USDC. Deposit USDC to upgrade tier.`,
                requiredBalance: tierPrice,
                currentBalance: userBalance
            }, { status: 400 });
        }

        // Process payment to SubGuard admin wallet
        console.log(`[Tier Upgrade] Transferring ${tierPrice} USDC to admin wallet ${SUBGUARD_ADMIN_WALLET}...`);

        const transferResult = await transferUSDC(
            wallet.walletId,
            SUBGUARD_ADMIN_WALLET,
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
        console.error('[Tier Upgrade] Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

/**
 * GET /api/tier/upgrade?userId=xxx
 * Returns the user's current tier
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

        const tier = getUserTier(userId);

        return NextResponse.json({
            success: true,
            tier: tier || 'free'
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
