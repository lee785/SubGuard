import { NextResponse } from 'next/server';
import { initializeUserWallet } from '@/lib/circle/circle_wallet';
import { authenticateRequest } from '@/lib/auth/privy-server';
import { checkRateLimit } from '@/lib/ratelimit/simple-limiter';
import { onboardSchema } from '@/lib/validation/schemas';
import { z } from 'zod';

/**
 * POST /api/onboard
 * Body: { email?: string, name?: string }
 * 
 * Creates a Circle wallet for the authenticated user.
 */
export async function POST(req: Request) {
    try {
        // Rate limiting
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        if (!checkRateLimit(`onboard_${ip}`)) {
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

        // Parse and validate input (email and name are optional)
        const body = await req.json();
        const validated = onboardSchema.parse(body);

        console.log(`🚀 Onboarding user: ${validated.email || 'no email'} (${userId})`);

        // Create wallet using local Circle SDK
        const wallet = await initializeUserWallet(userId);

        console.log(`✅ Circle Wallet: ${wallet.id} (${wallet.address})`);

        return NextResponse.json({
            success: true,
            walletAddress: wallet.address,
            walletId: wallet.id,
            blockchain: wallet.blockchain,
            isNew: wallet.isNew,
            cardId: `card_mock_${Date.now()}`,
            cardLast4: '4242',
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
        console.error('[API] Onboarding failed:', error);

        // Return generic error message to client
        return NextResponse.json(
            { success: false, error: 'Onboarding failed. Please try again.' },
            { status: 500 }
        );
    }
}
