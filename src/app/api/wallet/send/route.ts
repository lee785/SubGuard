import { NextResponse } from 'next/server';
import { transferUSDC, getUserWallet } from '@/lib/circle/circle_wallet';
import { authenticateRequest } from '@/lib/auth/privy-server';
import { checkRateLimit } from '@/lib/ratelimit/simple-limiter';
import { sendUSDCSchema } from '@/lib/validation/schemas';
import { z } from 'zod';

/**
 * POST /api/wallet/send
 * Body: { toAddress, amount }
 * Sends USDC using local Circle SDK on Arc Testnet
 */
export async function POST(req: Request) {
    try {
        // Rate limiting
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        if (!checkRateLimit(`send_${ip}`)) {
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
        const validated = sendUSDCSchema.parse(body);

        // Get user's wallet from local DB
        const wallet = getUserWallet(userId);

        if (!wallet) {
            return NextResponse.json(
                { success: false, error: 'Wallet not found. Please contact support.' },
                { status: 404 }
            );
        }

        console.log(`[API] User ${userId} sending ${validated.amount} USDC to ${validated.toAddress}`);

        // Transfer using local Circle SDK
        const result = await transferUSDC(wallet.walletId, validated.toAddress, validated.amount);

        return NextResponse.json({
            success: true,
            transactionId: result.transactionId,
            status: result.status
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
        console.error('[API] Send failed:', error);

        // Return generic error message to client
        return NextResponse.json(
            { success: false, error: 'Transaction failed. Please try again.' },
            { status: 500 }
        );
    }
}
