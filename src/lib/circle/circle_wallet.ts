import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import { getWalletByUserId, saveUserWallet } from '@/lib/db/user_wallets';

// Initialize Circle SDK Client
const circleClient = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY!,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET_HEX!
});

const WALLET_SET_ID = process.env.CIRCLE_WALLET_SET_ID!;

// Arc Testnet Configuration
// USDC Contract: 0x3600000000000000000000000000000000000000
// Chain ID: 5042002
// RPC: https://rpc.testnet.arc.network

/**
 * Initializes a Circle wallet for a user on Arc Testnet.
 * If a wallet already exists for this userId, returns the existing one.
 * Otherwise, creates a new wallet via Circle Programmable Wallets API.
 */
export async function initializeUserWallet(userId: string) {
    console.log(`[Circle] Initializing wallet for user ${userId}...`);

    // Check if wallet already exists in our database
    let existingWallet = getWalletByUserId(userId);
    if (existingWallet) {
        console.log(`[Circle] Found existing wallet in local DB: ${existingWallet.address}`);
        return {
            id: existingWallet.walletId,
            address: existingWallet.address,
            userId: userId,
            blockchain: existingWallet.blockchain,
            isNew: false
        };
    }

    // NEW: Recovery Flow - Check Circle API directly if local DB is empty (common on Vercel redeploys)
    try {
        console.log(`[Circle] Local DB empty. Searching Circle for existing wallet with refId: ${userId}`);
        const listResponse = await circleClient.listWallets({
            walletSetId: WALLET_SET_ID,
        });

        const recoveredWallet = listResponse.data?.wallets?.find(w => w.refId === userId);

        if (recoveredWallet) {
            console.log(`[Circle] ♻️ Recovered existing wallet from Circle: ${recoveredWallet.address}`);
            // Update local DB cache
            saveUserWallet(userId, recoveredWallet.id!, recoveredWallet.address!, recoveredWallet.blockchain || 'ARC-TESTNET');

            return {
                id: recoveredWallet.id,
                address: recoveredWallet.address,
                userId: userId,
                blockchain: recoveredWallet.blockchain || 'ARC-TESTNET',
                isNew: false
            };
        }
    } catch (err: any) {
        console.warn(`[Circle] Recovery lookup failed (continuing to creation):`, err.message);
    }

    try {
        // Create new wallet via Circle API on ARC-TESTNET
        console.log(`[Circle] No existing wallet found. Creating new wallet on ARC-TESTNET...`);

        const response = await circleClient.createWallets({
            walletSetId: WALLET_SET_ID,
            blockchains: ['ARC-TESTNET'],
            count: 1,
            metadata: [{ refId: userId }]
        });

        if (!response.data?.wallets || response.data.wallets.length === 0) {
            throw new Error('No wallets returned from Circle API');
        }

        const wallet = response.data.wallets[0];

        // Save to our database
        saveUserWallet(userId, wallet.id!, wallet.address!, wallet.blockchain || 'ARC-TESTNET');

        console.log(`[Circle] ✅ Wallet created on Arc Testnet: ${wallet.address}`);

        return {
            id: wallet.id,
            address: wallet.address,
            userId: userId,
            blockchain: wallet.blockchain || 'ARC-TESTNET',
            isNew: true
        };

    } catch (error: any) {
        console.error(`[Circle] Failed to create wallet:`, error.message);
        // Re-throw - NO MORE MOCK FALLBACK - let error surface for debugging
        throw error;
    }
}

/**
 * Get wallet balance for a specific wallet on Arc Testnet
 */
export async function getWalletBalance(walletId: string) {
    console.log(`[Circle] Fetching balance for wallet ${walletId}...`);

    try {
        const response = await circleClient.getWalletTokenBalance({
            id: walletId
        });

        const balances = response.data?.tokenBalances || [];
        console.log(`[Circle] Raw balances for ${walletId}:`, JSON.stringify(balances));

        // Try to find USDC by symbol (handling potential variations)
        const usdcBalance = balances.find((b: any) =>
            b.token?.symbol === 'USDC' ||
            b.token?.name?.includes('USDC') ||
            b.token?.symbol?.includes('USDC')
        );

        const amount = usdcBalance?.amount || '0';
        console.log(`[Circle] Detected USDC Balance: ${amount}`);

        return {
            balance: amount,
            currency: 'USDC',
            raw: balances
        };
    } catch (error: any) {
        console.error(`[Circle] Failed to fetch balance:`, error.message);
        throw error;
    }
}

/**
 * Transfer USDC from one wallet to another on Arc Testnet
 */
export async function transferUSDC(
    fromWalletId: string,
    toAddress: string,
    amount: string
) {
    console.log(`[Circle] Initiating transfer: ${amount} USDC from ${fromWalletId} to ${toAddress}`);

    try {
        const response = await circleClient.createTransaction({
            walletId: fromWalletId,
            tokenId: 'USDC',
            destinationAddress: toAddress,
            amount: [amount],
            fee: {
                type: 'level',
                config: { feeLevel: 'MEDIUM' }
            }
        });

        console.log(`[Circle] ✅ Transaction created: ${response.data?.id}`);

        return {
            success: true,
            transactionId: response.data?.id,
            status: response.data?.state
        };
    } catch (error: any) {
        console.error(`[Circle] Transaction failed:`, error.message);
        // Re-throw - NO MORE MOCK FALLBACK
        throw error;
    }
}

/**
 * Get user's wallet by their Privy user ID
 */
export function getUserWallet(userId: string) {
    return getWalletByUserId(userId);
}

/**
 * Fund a virtual card wallet from the SubGuard admin wallet.
 * This is used for JIT funding of burner cards.
 */
export async function fundVirtualCard(targetWalletId: string, amount: string) {
    const adminWalletId = process.env.CIRCLE_ADMIN_WALLET_ID;

    if (!adminWalletId) {
        throw new Error('CIRCLE_ADMIN_WALLET_ID environment variable is not configured');
    }

    console.log(`[Circle] JIT Funding: ${amount} USDC from admin to wallet ${targetWalletId}`);

    try {
        // 1. Get the target wallet's address
        const walletResponse = await circleClient.getWallet({ id: targetWalletId });
        const destinationAddress = walletResponse.data?.wallet?.address;

        if (!destinationAddress) {
            throw new Error(`Could not find address for wallet ${targetWalletId}`);
        }

        // 2. Transfer from admin to target address
        const response = await circleClient.createTransaction({
            walletId: adminWalletId,
            tokenId: 'USDC',
            destinationAddress: destinationAddress,
            amount: [amount],
            fee: {
                type: 'level',
                config: { feeLevel: 'MEDIUM' }
            }
        });

        return {
            success: true,
            transactionId: response.data?.id,
            status: response.data?.state
        };
    } catch (error: any) {
        console.error(`[Circle] JIT Funding failed:`, error.message);
        throw error;
    }
}
