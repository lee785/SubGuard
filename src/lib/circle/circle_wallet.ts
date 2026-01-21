import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import { getWalletByUserId, saveUserWallet } from '@/lib/db/user_wallets';

// Initialize Circle SDK Client
const circleClient = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY!,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET!
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
    const existingWallet = getWalletByUserId(userId);
    if (existingWallet) {
        console.log(`[Circle] Found existing wallet: ${existingWallet.address}`);
        return {
            id: existingWallet.walletId,
            address: existingWallet.address,
            userId: userId,
            blockchain: existingWallet.blockchain,
            isNew: false
        };
    }

    try {
        // Create new wallet via Circle API on ARC-TESTNET
        console.log(`[Circle] Creating new wallet on ARC-TESTNET via Circle SDK...`);

        const response = await circleClient.createWallets({
            walletSetId: WALLET_SET_ID,
            blockchains: ['ARC-TESTNET'],  // <-- FIXED: Changed from MATIC-AMOY to ARC-TESTNET
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
        const usdcBalance = balances.find((b: any) => b.token?.symbol === 'USDC');

        console.log(`[Circle] Balance: ${usdcBalance?.amount || '0'} USDC`);

        return {
            balance: usdcBalance?.amount || '0',
            currency: 'USDC',
            raw: balances
        };
    } catch (error: any) {
        console.error(`[Circle] Failed to fetch balance:`, error.message);
        // Re-throw - NO MORE MOCK FALLBACK
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
