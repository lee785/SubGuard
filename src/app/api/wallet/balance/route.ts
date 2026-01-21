import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://subguard-api.fly.dev';

/**
 * GET /api/wallet/balance?userId=xxx
 * Proxies to fly.io backend to get real USDC balance from Arc Testnet
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

        // Call the fly.io backend
        const response = await fetch(`${API_URL}/api/wallet/balance?userId=${userId}`);
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: data.error || 'Balance fetch failed' },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            balance: data.balance || '0',
            currency: 'USDC'
        });

    } catch (error: any) {
        console.error('[API] Balance fetch failed:', error);
        return NextResponse.json(
            { success: false, error: error.message, balance: '0' },
            { status: 500 }
        );
    }
}
