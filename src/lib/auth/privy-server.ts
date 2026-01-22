import { PrivyClient } from '@privy-io/server-auth';

const privy = new PrivyClient(
    process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
    process.env.PRIVY_APP_SECRET!
);

/**
 * Authenticates a request using Privy's server-side authentication.
 * Returns the authenticated user's ID or null if authentication fails.
 */
export async function authenticateRequest(req: Request): Promise<string | null> {
    const authHeader = req.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);

    try {
        const verifiedClaims = await privy.verifyAuthToken(token);
        return verifiedClaims.userId;
    } catch (error) {
        console.error('[Auth] Token verification failed:', error);
        return null;
    }
}
