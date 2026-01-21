import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://subguard-api.fly.dev';

/**
 * POST /api/wallet/send
 * Body: { userId, toAddress, amount }
 * Proxies to fly.io backend to send USDC on Arc Testnet
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

        console.log(`[API] Sending ${amount} USDC to ${toAddress} for user ${userId}`);

        // Call the fly.io backend
        const response = await fetch(`${API_URL}/api/wallet/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, toAddress, amount })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: data.error || 'Transfer failed' },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            transactionId: data.transactionId,
            status: data.status
        });

    } catch (error: any) {
        console.error('[API] Send failed:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
